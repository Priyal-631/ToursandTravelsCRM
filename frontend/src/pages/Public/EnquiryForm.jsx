import { useState } from 'react';
import { saveEnquiry, toDateLabel } from '../../api/enquiryStorage';

const INITIAL = {
  name: '', email: '', phone: '',
  whatsapp: '',
  destination: '', travelDates: '', budget: '',
  travelMonth: '', departureCity: '', query: '',
  totalTravellers: 1,
  adults: 1,
  children: 0,
};

const Field = ({ label, name, type = 'text', placeholder, value, onChange, error }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#567C8D]/30 focus:border-[#567C8D] transition-colors ${error ? 'border-red-300' : 'border-gray-200'}`}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

export default function EnquiryForm() {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sameAsMobile, setSameAsMobile] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())        e.name        = 'Name is required';
    if (!form.email.trim())       e.email       = 'Email is required';
    if (!form.phone.trim())       e.phone       = 'Phone is required';
    if (!form.destination.trim()) e.destination = 'Destination is required';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const now = new Date();
    saveEnquiry({
      id: `enq-${now.getTime()}`,
      customer: form.name.trim(),
      subject: form.destination?.trim() ? `Trip Enquiry: ${form.destination.trim()}` : 'Travel Enquiry',
      message: form.query?.trim() || `Travel plan for ${form.totalTravellers || 1} traveler(s).`,
      date: toDateLabel(now),
      priority: 'Medium',
      status: 'Contacted',
      assigned: 'Unassigned',
      replied: false,
      email: form.email.trim(),
      phone: form.phone.trim(),
      destination: form.destination.trim(),
      travelMonth: form.travelMonth,
      departureCity: form.departureCity.trim(),
      budget: form.budget,
      totalTravellers: Number(form.totalTravellers) || 1,
      adults: Number(form.adults) || 0,
      children: Number(form.children) || 0,
      whatsapp: form.whatsapp.trim(),
    });

    console.log('Enquiry submitted:', form);
    setSubmitted(true);
    setForm(INITIAL);
    setErrors({});
    setSameAsMobile(false);
  };

  const handleSameAsMobile = (checked) => {
    setSameAsMobile(checked);
    setForm(p => ({ ...p, whatsapp: checked ? p.phone : '' }));
  };

  const handlePhoneChange = (val) => {
    setForm(p => ({ ...p, phone: val, whatsapp: sameAsMobile ? val : p.whatsapp }));
    setErrors(p => ({ ...p, phone: '' }));
  };

  const handleCounter = (name, delta) => {
    setForm(p => ({ ...p, [name]: Math.max(0, p[name] + delta) }));
  };

  const handleFieldChange = (name, val) => {
    setForm(p => ({ ...p, [name]: val }));
    setErrors(p => ({ ...p, [name]: '' }));
  };

  if (submitted) {
    return (
      <div className="w-full bg-[#2F4156] flex items-center justify-center p-4 py-16">
        <div className="bg-white rounded-2xl shadow-sm px-10 py-12 max-w-md w-full text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#567C8D]/10 flex items-center justify-center mx-auto">
            <svg className="w-7 h-7 text-[#567C8D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#2F4156]">Enquiry Submitted!</h2>
          <p className="text-gray-500 text-sm">We'll get back to you shortly.</p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-2 px-6 py-2 bg-[#2F4156] text-white rounded-lg text-sm hover:bg-[#3a5068] transition-colors"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#2F4156] flex items-center justify-center p-6 py-8">
      <div className="bg-white rounded-2xl shadow-lg px-8 py-8 w-full max-w-2xl">

        {/* ── Header ── */}
        <div className="text-center mb-6">
          <p className="text-sm font-semibold text-[#020318] uppercase tracking-widest mb-1">Sukhi Travels</p> {/* ← added */}
          <h2 className="text-2xl font-bold text-[#2F4156]">✈️ Plan Your Dream Vacation ✈️</h2>
          <p className="text-sm text-gray-500 mt-1">Tell us your travel plans and our experts will design the perfect package for you.</p>
        </div>

        <div className="space-y-4">

          {/* ── Row 1: Full Name | Mobile Number ── */}
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Full Name *"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              error={errors.name}
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Mobile Number *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="10-digit mobile number"
                className={`border rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#567C8D]/30 focus:border-[#567C8D] transition-colors ${errors.phone ? 'border-red-300' : 'border-gray-200'}`}
              />
              {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
            </div>
          </div>

          {/* ── Row 2: WhatsApp | Email ── */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">WhatsApp Number</label>
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={sameAsMobile}
                    onChange={(e) => handleSameAsMobile(e.target.checked)}
                    className="w-3.5 h-3.5 accent-[#567C8D] cursor-pointer"
                  />
                  <span className="text-xs text-gray-500">Same as Mobile</span>
                </label>
              </div>
              <input
                type="tel"
                value={form.whatsapp}
                disabled={sameAsMobile}
                onChange={(e) => setForm(p => ({ ...p, whatsapp: e.target.value }))}
                placeholder="+91 98765 43210"
                className={`border rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#567C8D]/30 focus:border-[#567C8D] transition-colors border-gray-200 ${sameAsMobile ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''}`}
              />
            </div>
            <Field
              label="Email ID"
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={form.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              error={errors.email}
            />
          </div>

          {/* ── Row 3: Destination | Travel Month ── */}
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Destination Interested In *"
              name="destination"
              placeholder="e.g. Bali, Switzerland, Kashmir"
              value={form.destination}
              onChange={(e) => handleFieldChange('destination', e.target.value)}
              error={errors.destination}
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Approx Travel Month</label>
              <select
                value={form.travelMonth}
                onChange={(e) => handleFieldChange('travelMonth', e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#567C8D]/30 focus:border-[#567C8D] transition-colors bg-white"
              >
                <option value="">Select month</option>
                {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Row 4: Total Travellers | Departure City ── */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Total No. of Travelers</label>
              <input
                type="number"
                min="1"
                value={form.totalTravellers}
                onChange={(e) => handleFieldChange('totalTravellers', e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#567C8D]/30 focus:border-[#567C8D] transition-colors bg-gray-50"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Departure City</label>
              <input
                type="text"
                value={form.departureCity}
                onChange={(e) => handleFieldChange('departureCity', e.target.value)}
                placeholder="e.g. Mumbai"
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#567C8D]/30 focus:border-[#567C8D] transition-colors"
              />
            </div>
          </div>

          {/* ── Row 5: Adults counter | Children counter ── */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">No. of Adults</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleCounter('adults', -1)}
                  className="w-9 h-9 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 text-lg font-medium transition-colors flex items-center justify-center"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-medium text-gray-700">{form.adults}</span>
                <button
                  type="button"
                  onClick={() => handleCounter('adults', 1)}
                  className="w-9 h-9 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 text-lg font-medium transition-colors flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">No. of Children</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleCounter('children', -1)}
                  className="w-9 h-9 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 text-lg font-medium transition-colors flex items-center justify-center"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-medium text-gray-700">{form.children}</span>
                <button
                  type="button"
                  onClick={() => handleCounter('children', 1)}
                  className="w-9 h-9 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 text-lg font-medium transition-colors flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* ── Budget Range (full width) ── */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Budget Range</label>
            <select
              value={form.budget}
              onChange={(e) => handleFieldChange('budget', e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#567C8D]/30 focus:border-[#567C8D] transition-colors bg-white"
            >
              <option value="">Select budget range</option>
              <option value="under-25k">Under ₹25,000</option>
              <option value="25k-50k">₹25,000 – ₹50,000</option>
              <option value="50k-1l">₹50,000 – ₹1,00,000</option>
              <option value="1l-2l">₹1,00,000 – ₹2,00,000</option>
              <option value="above-2l">Above ₹2,00,000</option>
            </select>
          </div>

          {/* ── Query / Special Requirements (full width) ── */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Your Query / Special Requirements</label>
            <textarea
              value={form.query}
              onChange={(e) => handleFieldChange('query', e.target.value)}
              placeholder="Tell us about any special requirements, preferences, or questions you have..."
              rows={4}
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#567C8D]/30 focus:border-[#567C8D] transition-colors resize-y"
            />
          </div>

          {/* ── Submit button (full width) ── */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-3 bg-[#567C8D] hover:bg-[#2F4156] text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Get My Travel Quote 🚀
          </button>

          {/* ── Trust badges ── */}
          <div className="flex items-center justify-center gap-6 pt-2 border-t border-gray-100">
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
              </svg>
              10,000+ Happy Travelers
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Best Price Guarantee
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              24/7 Travel Support
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}