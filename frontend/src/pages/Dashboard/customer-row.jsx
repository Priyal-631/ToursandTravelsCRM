import { useState } from 'react';
import { format, isValid } from 'date-fns';
import { MapPin, Phone, Mail, ChevronDown, ChevronUp, Pencil, Trash2, X, Check } from 'lucide-react';
import { updateCustomerFields, updateTourFields, deleteCustomer } from '@/api/customers';
import { TOUR_STATUSES, FOLLOW_UP_STATUSES } from '@/utils/constants';

// ── Inline edit modal ─────────────────────────────────────────────────
function EditModal({ customer, onClose, onSaved }) {
  const tour = customer.tours?.[0] ?? null;

  const [cust, setCust] = useState({
    full_name:        customer.full_name        || '',
    contact_number:   customer.contact_number   || '',
    whatsapp_number:  customer.whatsapp_number  || '',
    email_id:         customer.email_id         || '',
    departure_city:   customer.departure_city   || '',
    follow_up_status: customer.follow_up_status || 'New',
  });

  const [tourData, setTourData] = useState({
    destination:        tour?.destination        || '',
    package_type:       tour?.package_type       || '',
    start_date:         tour?.start_date         || '',
    end_date:           tour?.end_date           || '',
    number_of_adults:   tour?.number_of_adults   ?? 1,
    number_of_children: tour?.number_of_children ?? 0,
    amount_paid:        tour?.amount_paid        ?? '',
    amount_pending:     tour?.amount_pending     ?? '',
    status:             tour?.status             || 'Upcoming',
    notes:              tour?.notes              || '',
  });

  const [saving, setSaving]   = useState(false);
  const [errors, setErrors]   = useState({});

  const pC = (f, v) => { setCust(p => ({ ...p, [f]: v })); clearErr(f); };
  const pT = (f, v) => setTourData(p => ({ ...p, [f]: v }));
  const clearErr = f => errors[f] && setErrors(p => ({ ...p, [f]: undefined }));

  // Phone: digits only, cap 10
  const handlePhone = (field, raw) => {
    const digits = raw.replace(/\D/g, '').slice(0, 10);
    pC(field, digits);
  };

  function validate() {
    const e = {};
    if (!cust.full_name.trim()) e.full_name = 'Required';
    if (!cust.contact_number.trim()) {
      e.contact_number = 'Required';
    } else if (!/^[6-9]\d{9}$/.test(cust.contact_number)) {
      e.contact_number = 'Enter a valid 10-digit Indian mobile number';
    }
    if (cust.email_id.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cust.email_id.trim())) {
      e.email_id = 'Enter a valid email address';
    }
    return e;
  }

  async function handleSave() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    try {
      setSaving(true);
      // 1. Update customer fields
      const updated = await updateCustomerFields(customer.id, cust);
      // 2. Update tour fields if a tour exists
      if (tour?.id) {
        await updateTourFields(tour.id, tourData);
      }
      // Re-fetch the updated customer via the returned object
      // (updateCustomerFields already returns the full customer with tours)
      onSaved(updated);
      onClose();
    } catch (err) {
      console.error('Save error:', err);
      setErrors({ _global: err.message || 'Failed to save. Try again.' });
    } finally {
      setSaving(false);
    }
  }

  const inputCls = (err) =>
    `w-full h-8 px-2 text-xs rounded border ${err ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-1 focus:ring-[#567C8D] bg-white`;

  const selectCls = `w-full h-8 px-2 text-xs rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#567C8D] bg-white`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-base font-semibold text-gray-900">Edit Customer</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {errors._global && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{errors._global}</p>
          )}

          {/* Customer Info */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Customer Info</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">

              <EField label="Full Name" error={errors.full_name} required>
                <input className={inputCls(errors.full_name)} value={cust.full_name}
                  onChange={e => pC('full_name', e.target.value)} placeholder="Full name" />
              </EField>

              <EField label="Contact Number" error={errors.contact_number} required>
                <input className={inputCls(errors.contact_number)} value={cust.contact_number}
                  onChange={e => handlePhone('contact_number', e.target.value)}
                  placeholder="10-digit mobile" inputMode="numeric" maxLength={10} />
              </EField>

              <EField label="WhatsApp Number">
                <input className={inputCls(false)} value={cust.whatsapp_number}
                  onChange={e => handlePhone('whatsapp_number', e.target.value)}
                  placeholder="10-digit WhatsApp" inputMode="numeric" maxLength={10} />
              </EField>

              <EField label="Email" error={errors.email_id}>
                <input className={inputCls(errors.email_id)} value={cust.email_id} type="email"
                  onChange={e => pC('email_id', e.target.value)} placeholder="email@example.com" />
              </EField>

              <EField label="Departure City">
                <input className={inputCls(false)} value={cust.departure_city}
                  onChange={e => pC('departure_city', e.target.value)} placeholder="e.g. Mumbai" />
              </EField>

              <EField label="Follow-up Status">
                <select className={selectCls} value={cust.follow_up_status}
                  onChange={e => pC('follow_up_status', e.target.value)}>
                  {FOLLOW_UP_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </EField>

            </div>
          </div>

          {/* Tour Info */}
          {tour && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Tour Info</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">

                <EField label="Destination">
                  <input className={inputCls(false)} value={tourData.destination}
                    onChange={e => pT('destination', e.target.value)} placeholder="Destination" />
                </EField>

                <EField label="Package Type">
                  <input className={inputCls(false)} value={tourData.package_type}
                    onChange={e => pT('package_type', e.target.value)} placeholder="Package type" />
                </EField>

                <EField label="Start Date">
                  <input className={inputCls(false)} type="date" value={tourData.start_date}
                    onChange={e => pT('start_date', e.target.value)} />
                </EField>

                <EField label="End Date">
                  <input className={inputCls(false)} type="date" value={tourData.end_date}
                    onChange={e => pT('end_date', e.target.value)} />
                </EField>

                <EField label="Adults">
                  <input className={inputCls(false)} type="number" min={1} value={tourData.number_of_adults}
                    onChange={e => pT('number_of_adults', e.target.value)} />
                </EField>

                <EField label="Children">
                  <input className={inputCls(false)} type="number" min={0} value={tourData.number_of_children}
                    onChange={e => pT('number_of_children', e.target.value)} />
                </EField>

                <EField label="Amount Paid (₹)">
                  <input className={inputCls(false)} type="number" min={0} value={tourData.amount_paid}
                    onChange={e => pT('amount_paid', e.target.value)} placeholder="0" />
                </EField>

                <EField label="Amount Pending (₹)">
                  <input className={inputCls(false)} type="number" min={0} value={tourData.amount_pending}
                    onChange={e => pT('amount_pending', e.target.value)} placeholder="0" />
                </EField>

                <EField label="Tour Status">
                  <select className={selectCls} value={tourData.status}
                    onChange={e => pT('status', e.target.value)}>
                    {TOUR_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </EField>

                <EField label="Notes" className="col-span-2">
                  <textarea className="w-full h-16 px-2 py-1.5 text-xs rounded border border-gray-200 resize-none focus:outline-none focus:ring-1 focus:ring-[#567C8D]"
                    value={tourData.notes} onChange={e => pT('notes', e.target.value)}
                    placeholder="Any additional notes…" />
                </EField>

              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/60 flex-shrink-0">
          <button onClick={onClose} disabled={saving}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-[#2F4156] hover:bg-[#253548] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
            <Check className="h-4 w-4" />
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function EField({ label, children, error, required, className = '' }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-xs font-medium text-gray-600">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-[11px] text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

// ── Delete confirmation ───────────────────────────────────────────────
function DeleteConfirm({ name, onConfirm, onCancel, deleting }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-2">Delete Customer</h3>
        <p className="text-sm text-gray-500 mb-5">
          Are you sure you want to delete <span className="font-medium text-gray-800">{name}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} disabled={deleting}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={deleting}
            className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50">
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main CustomerRow ──────────────────────────────────────────────────
export default function CustomerRow({ customer, onUpdated, onDeleted }) {
  const [notesExpanded, setNotesExpanded] = useState(false);
  const [showEdit, setShowEdit]           = useState(false);
  const [showDelete, setShowDelete]       = useState(false);
  const [deleting, setDeleting]           = useState(false);

  const getTourStatusColor = (status) => {
    const colors = {
      'Upcoming':  'bg-blue-100 text-blue-800',
      'Ongoing':   'bg-green-100 text-green-800',
      'Completed': 'bg-gray-100 text-gray-800',
      'Cancelled': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTourTypeColor = (type) =>
    type === 'International' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800';

  const getAvatarColor = (name) => {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-pink-500'];
    return colors[(name?.charCodeAt(0) || 0) % colors.length];
  };

  const safeFormat = (dateValue, formatStr) => {
    if (!dateValue) return '—';
    const date = new Date(dateValue);
    return isValid(date) ? format(date, formatStr) : '—';
  };

  const formatCurrency = (val) => {
    if (val == null || val === '') return '—';
    return '₹' + Number(val).toLocaleString('en-IN');
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteCustomer(customer.id);
      onDeleted?.(customer.id);
      setShowDelete(false);
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeleting(false);
    }
  };

  const tour           = customer.tours?.[0] ?? null;
  const tourTypeName   = tour?.tour_type?.name ?? null;
  const locationLabel  = tourTypeName === 'International'
    ? tour?.country?.name ?? null
    : tour?.state?.name ?? null;

  const hasNotes        = tour?.notes && tour.notes.trim().length > 0;
  const notesNeedExpand = hasNotes && tour.notes.length > 60;

  const td = "px-2 py-2 align-top";

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors duration-150 align-top">

        {/* 1. Customer */}
        <td className={td}>
          <div className="flex items-center gap-2 min-w-0">
            <div className={`h-7 w-7 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0 ${getAvatarColor(customer.full_name)}`}>
              {customer.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-gray-900 truncate">{customer.full_name || '—'}</div>
              <div className="text-xs text-gray-400 truncate">{customer.departure_city || 'City not set'}</div>
            </div>
          </div>
        </td>

        {/* 2. Contact */}
        <td className={td}>
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center text-xs text-gray-700">
              <Phone size={11} className="mr-1 text-gray-400 flex-shrink-0" />
              <span className="truncate">{customer.contact_number || '—'}</span>
            </div>
            {customer.whatsapp_number && customer.whatsapp_number !== customer.contact_number && (
              <div className="flex items-center text-xs text-gray-400">
                <Phone size={11} className="mr-1 text-gray-300 flex-shrink-0" />
                <span className="truncate">WA: {customer.whatsapp_number}</span>
              </div>
            )}
            <div className="flex items-center text-xs text-gray-500">
              <Mail size={11} className="mr-1 text-gray-400 flex-shrink-0" />
              <span className="truncate">{customer.email_id || '—'}</span>
            </div>
          </div>
        </td>

        {/* 3. Destination */}
        <td className={td}>
          {tour ? (
            <div className="min-w-0">
              <div className="flex items-center gap-1 text-xs text-gray-700">
                <MapPin size={11} className="text-gray-400 flex-shrink-0" />
                <span className="truncate">{tour.destination}</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                {tourTypeName && (
                  <span className={`px-1.5 py-0.5 text-xs font-semibold rounded-full ${getTourTypeColor(tourTypeName)}`}>
                    {tourTypeName}
                  </span>
                )}
                {locationLabel && <span className="text-xs text-gray-400 truncate">{locationLabel}</span>}
              </div>
            </div>
          ) : (
            <span className="text-xs text-gray-400">No tour</span>
          )}
        </td>

        {/* 4. Package */}
        <td className={td}>
          <span className="text-xs text-gray-700 truncate block">{tour?.package_type || '—'}</span>
        </td>

        {/* 5. Travel Dates */}
        <td className={td}>
          {tour ? (
            <div>
              <div className="text-xs text-gray-700">{safeFormat(tour.start_date, 'dd MMM yy')}</div>
              <div className="text-xs text-gray-400 mt-0.5">→ {safeFormat(tour.end_date, 'dd MMM yy')}</div>
            </div>
          ) : (
            <span className="text-xs text-gray-400">—</span>
          )}
        </td>

        {/* 6. Group */}
        <td className={td}>
          {tour ? (
            <div className="text-xs text-gray-700">
              {tour.number_of_adults ?? 0}A
              {(tour.number_of_children ?? 0) > 0 && ` / ${tour.number_of_children}C`}
            </div>
          ) : (
            <span className="text-xs text-gray-400">—</span>
          )}
        </td>

        {/* 7. Paid */}
        <td className={td}>
          <span className="text-xs font-medium text-green-700 block truncate">
            {tour ? formatCurrency(tour.amount_paid) : '—'}
          </span>
        </td>

        {/* 8. Pending */}
        <td className={td}>
          <span className={`text-xs font-medium block truncate ${tour?.amount_pending > 0 ? 'text-red-600' : 'text-gray-400'}`}>
            {tour ? (tour.amount_pending > 0 ? formatCurrency(tour.amount_pending) : '₹0') : '—'}
          </span>
        </td>

        {/* 9. Status */}
        <td className={td}>
          {tour ? (
            <span className={`px-1.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getTourStatusColor(tour.status)}`}>
              {tour.status || 'Upcoming'}
            </span>
          ) : (
            <span className="text-xs text-gray-400">—</span>
          )}
        </td>

        {/* 10. Notes */}
        <td className={td}>
          {hasNotes ? (
            <div>
              <p className={`text-xs text-gray-500 leading-relaxed ${!notesExpanded && notesNeedExpand ? 'line-clamp-2' : ''}`}>
                {tour.notes}
              </p>
              {notesNeedExpand && (
                <button
                  onClick={() => setNotesExpanded(p => !p)}
                  className="mt-1 flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 transition-colors"
                >
                  {notesExpanded ? <><ChevronUp size={11} /> Less</> : <><ChevronDown size={11} /> More</>}
                </button>
              )}
            </div>
          ) : (
            <span className="text-xs text-gray-400">—</span>
          )}
        </td>

        {/* 11. Actions */}
        <td className={td}>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowEdit(true)}
              title="Edit customer"
              className="p-1.5 rounded-lg text-gray-400 hover:text-[#2F4156] hover:bg-[#EEF2F7] transition-colors"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => setShowDelete(true)}
              title="Delete customer"
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </td>

      </tr>

      {/* Edit modal */}
      {showEdit && (
        <EditModal
          customer={customer}
          onClose={() => setShowEdit(false)}
          onSaved={(updated) => {
            onUpdated?.(updated);
            setShowEdit(false);
          }}
        />
      )}

      {/* Delete confirm */}
      {showDelete && (
        <DeleteConfirm
          name={customer.full_name}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          deleting={deleting}
        />
      )}
    </>
  );
}