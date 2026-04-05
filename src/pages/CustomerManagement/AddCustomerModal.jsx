/**
 * src/pages/CustomerManagement/AddCustomerModal.jsx
 *
 * Validation (real-time trigger messages):
 *  - Phone / WhatsApp: digits only, 10 digits, starts 6–9 (Indian mobile)
 *    → triggers inline error as the user types and on blur
 *    → a digit progress bar shows how many digits are filled
 *  - Email: standard email format → triggers on blur
 *  - Required fields shown on submit attempt
 */

import { useState } from "react"
import { X, Check, Copy } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DESTINATIONS, TOUR_STATUSES, PACKAGE_TYPES,
  FOLLOW_UP_STATUSES,
} from "@/utils/constants"

const INIT_CUST = {
  full_name: "", contact_number: "", whatsapp_number: "",
  email_id: "", departure_city: "", follow_up_status: "New",
}
const INIT_TOUR = {
  destination: "", package_type: "", start_date: "", end_date: "",
  number_of_adults: 1, number_of_children: 0,
  amount_paid: "", amount_pending: "", status: "Upcoming", notes: "",
}

const PHONE_RE = /^[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function phoneErr(val) {
  if (!val.trim()) return null;
  if (!/^\d+$/.test(val)) return "Only digits are allowed";
  if (val.length < 10)    return `${10 - val.length} more digit${10 - val.length > 1 ? "s" : ""} needed`;
  if (!PHONE_RE.test(val)) return "Must start with 6, 7, 8, or 9";
  return null;
}
function emailErr(val) {
  if (!val.trim()) return null;
  return EMAIL_RE.test(val.trim()) ? null : "Enter a valid email (e.g. name@domain.com)";
}

export default function AddCustomerModal({ onClose, onSubmit, error: externalError }) {
  const [cust, setCust]      = useState(INIT_CUST)
  const [tour, setTour]      = useState(INIT_TOUR)
  const [submitting, setSub] = useState(false)
  const [errors, setErrors]  = useState({})
  const [touched, setTouch]  = useState({})
  const [sameWA, setSameWA]  = useState(false)

  const setErr = (f, msg) => setErrors(p => ({ ...p, [f]: msg || undefined }))

  const pC = (f, v) => {
    setCust(p => ({ ...p, [f]: v }))
    if (touched[f]) revalidate(f, v)
  }
  const pT = (f, v) => setTour(p => ({ ...p, [f]: v }))

  const touch = (f) => {
    setTouch(p => ({ ...p, [f]: true }))
    revalidate(f, cust[f])
  }

  function revalidate(f, v) {
    if (f === "full_name")       setErr(f, !v.trim() ? "Full name is required" : null)
    if (f === "contact_number")  setErr(f, !v.trim() ? "Contact number is required" : phoneErr(v))
    if (f === "whatsapp_number" && v.trim()) setErr(f, phoneErr(v))
    if (f === "email_id")        setErr(f, !v.trim() ? "Email is required" : emailErr(v))
  }

  const handlePhone = (field, raw) => {
    const digits = raw.replace(/\D/g, "").slice(0, 10)
    setCust(p => ({ ...p, [field]: digits }))
    if (touched[field]) setErr(field, !digits.trim() && field === "contact_number" ? "Contact number is required" : phoneErr(digits))
    if (field === "contact_number" && sameWA) setCust(p => ({ ...p, whatsapp_number: digits }))
  }

  const handleSameWA = (checked) => {
    setSameWA(checked)
    if (checked) { setCust(p => ({ ...p, whatsapp_number: p.contact_number })); setErr("whatsapp_number", null) }
  }

  function validateAll() {
    const e = {}
    if (!cust.full_name.trim())      e.full_name      = "Full name is required"
    if (!cust.contact_number.trim()) e.contact_number = "Contact number is required"
    else { const pe = phoneErr(cust.contact_number); if (pe) e.contact_number = pe }
    if (cust.whatsapp_number.trim()) { const we = phoneErr(cust.whatsapp_number); if (we) e.whatsapp_number = we }
    if (!cust.email_id.trim())       e.email_id = "Email is required"
    else { const ee = emailErr(cust.email_id); if (ee) e.email_id = ee }
    return e
  }

  async function handleSubmit() {
    setTouch({ full_name: true, contact_number: true, email_id: true, whatsapp_number: true })
    const e = validateAll()
    if (Object.keys(e).length) { setErrors(e); return }
    try {
      setSub(true)
      await onSubmit(cust, tour.destination ? tour : null)
    } finally {
      setSub(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Add Customer</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
          {externalError && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">⚠ {externalError}</p>
          )}

          {/* Section 1 */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Customer Info</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">

              <Field label="Full Name" error={errors.full_name} required>
                <Input placeholder="Full name" value={cust.full_name}
                  onChange={e => pC("full_name", e.target.value)}
                  onBlur={() => touch("full_name")}
                  className={errors.full_name ? "border-red-400" : ""} />
              </Field>

              <Field label="Contact Number" error={errors.contact_number} required>
                <Input placeholder="10-digit mobile number" value={cust.contact_number}
                  onChange={e => handlePhone("contact_number", e.target.value)}
                  onBlur={() => touch("contact_number")}
                  maxLength={10} inputMode="numeric"
                  className={errors.contact_number ? "border-red-400" : ""} />
                <PhoneProgress val={cust.contact_number} />
              </Field>

              <Field label="WhatsApp Number" error={errors.whatsapp_number}>
                <div className="space-y-1">
                  <Input placeholder="10-digit WhatsApp number" value={cust.whatsapp_number}
                    onChange={e => { setSameWA(false); handlePhone("whatsapp_number", e.target.value) }}
                    onBlur={() => touch("whatsapp_number")}
                    maxLength={10} inputMode="numeric" disabled={sameWA}
                    className={`${errors.whatsapp_number ? "border-red-400" : ""} ${sameWA ? "opacity-60" : ""}`} />
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={sameWA} onChange={e => handleSameWA(e.target.checked)}
                      className="w-3.5 h-3.5 accent-[#2F4156] cursor-pointer" />
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Copy className="h-3 w-3" /> Same as Contact Number
                    </span>
                  </label>
                </div>
              </Field>

              <Field label="Email" error={errors.email_id} required>
                <Input type="email" placeholder="email@example.com" value={cust.email_id}
                  onChange={e => pC("email_id", e.target.value)}
                  onBlur={() => touch("email_id")}
                  className={errors.email_id ? "border-red-400" : ""} />
              </Field>

              <Field label="Departure City">
                <Input placeholder="e.g. Mumbai" value={cust.departure_city}
                  onChange={e => pC("departure_city", e.target.value)} />
              </Field>

              <Field label="Follow-up Status">
                <Select value={cust.follow_up_status} onChange={v => pC("follow_up_status", v)}
                  options={FOLLOW_UP_STATUSES} />
              </Field>

            </div>
          </div>

          {/* Section 2 */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Tour Info <span className="normal-case font-normal text-gray-400">(optional)</span>
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">

              <Field label="Destination">
                <Select value={tour.destination} onChange={v => pT("destination", v)}
                  options={DESTINATIONS} placeholder="Select destination" />
              </Field>

              <Field label="Package Type">
                <Select value={tour.package_type} onChange={v => pT("package_type", v)}
                  options={PACKAGE_TYPES} placeholder="Select package" />
              </Field>

              <Field label="Start Date">
                <Input type="date" value={tour.start_date} onChange={e => pT("start_date", e.target.value)} />
              </Field>

              <Field label="End Date">
                <Input type="date" value={tour.end_date} onChange={e => pT("end_date", e.target.value)} />
              </Field>

              <Field label="Adults">
                <Input type="number" min={1} value={tour.number_of_adults}
                  onChange={e => pT("number_of_adults", e.target.value)} />
              </Field>

              <Field label="Children">
                <Input type="number" min={0} value={tour.number_of_children}
                  onChange={e => pT("number_of_children", e.target.value)} />
              </Field>

              <Field label="Amount Paid (₹)">
                <Input type="number" min={0} placeholder="0" value={tour.amount_paid}
                  onChange={e => pT("amount_paid", e.target.value)} />
              </Field>

              <Field label="Amount Pending (₹)">
                <Input type="number" min={0} placeholder="0" value={tour.amount_pending}
                  onChange={e => pT("amount_pending", e.target.value)} />
              </Field>

              <Field label="Tour Status">
                <Select value={tour.status} onChange={v => pT("status", v)} options={TOUR_STATUSES} />
              </Field>

              <Field label="Notes" className="col-span-2">
                <textarea value={tour.notes} onChange={e => pT("notes", e.target.value)}
                  placeholder="Any additional notes…"
                  className="w-full h-16 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </Field>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/60 flex-shrink-0">
          <Button variant="outline" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting}
            className="bg-[#2F4156] hover:bg-[#253548] text-white gap-2 min-w-[90px]">
            <Check className="h-4 w-4" />
            {submitting ? "Adding…" : "Add"}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Digit progress bar ────────────────────────────────────────────────
function PhoneProgress({ val }) {
  const len = (val || "").length;
  if (len === 0) return null;
  const done = len >= 10;
  return (
    <div className="mt-1 flex items-center gap-1.5">
      <div className="flex-1 h-1 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-200 ${done ? "bg-green-500" : "bg-orange-400"}`}
          style={{ width: `${(len / 10) * 100}%` }}
        />
      </div>
      <span className={`text-[10px] font-medium ${done ? "text-green-600" : "text-orange-500"}`}>
        {done ? "✓" : `${len}/10`}
      </span>
    </div>
  );
}

function Field({ label, children, error, required, className = "" }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-xs font-medium text-gray-600">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-[11px] text-red-500 flex items-center gap-1"><span>⚠</span>{error}</p>}
    </div>
  )
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}