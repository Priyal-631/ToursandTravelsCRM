import { useState } from 'react';
import { format, isValid } from 'date-fns';
import { MapPin, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react';

export default function CustomerRow({ customer }) {

  // ── Expandable notes state ────────────────────────────────────────
  const [notesExpanded, setNotesExpanded] = useState(false);

  // ── Tour status badge colors ──────────────────────────────────────
  const getTourStatusColor = (status) => {
    const colors = {
      'Upcoming':  'bg-blue-100 text-blue-800',
      'Ongoing':   'bg-green-100 text-green-800',
      'Completed': 'bg-gray-100 text-gray-800',
      'Cancelled': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // ── Tour type badge colors ────────────────────────────────────────
  const getTourTypeColor = (type) => {
    return type === 'International'
      ? 'bg-purple-100 text-purple-800'
      : 'bg-orange-100 text-orange-800';
  };

  // ── Avatar color based on first letter of name ───────────────────
  const getAvatarColor = (name) => {
    const colors = [
      'bg-blue-500', 'bg-purple-500', 'bg-green-500',
      'bg-red-500',  'bg-yellow-500', 'bg-pink-500',
    ];
    const index = (name?.charCodeAt(0) || 0) % colors.length;
    return colors[index];
  };

  // ── Safe date formatter ───────────────────────────────────────────
  const safeFormat = (dateValue, formatStr) => {
    if (!dateValue) return '—';
    const date = new Date(dateValue);
    return isValid(date) ? format(date, formatStr) : '—';
  };

  // ── Currency formatter ────────────────────────────────────────────
  const formatCurrency = (val) => {
    if (val == null || val === '') return '—';
    return '₹' + Number(val).toLocaleString('en-IN');
  };

  // ── Get latest tour from nested array ────────────────────────────
  const tour = customer.tours?.[0] ?? null;

  const tourTypeName  = tour?.tour_type?.name ?? null;
  const locationLabel = tourTypeName === 'International'
    ? tour?.country?.name ?? null
    : tour?.state?.name ?? null;

  const hasNotes = tour?.notes && tour.notes.trim().length > 0;
  // Show expand toggle only if notes exceed ~60 characters
  const notesNeedExpand = hasNotes && tour.notes.length > 60;

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150 align-top">

      {/* ── 1. Customer ──────────────────────────────────────────── */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className={`h-9 w-9 rounded-full flex items-center justify-center
                          text-white font-semibold text-sm flex-shrink-0
                          ${getAvatarColor(customer.full_name)}`}>
            {customer.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {customer.full_name || '—'}
            </div>
            <div className="text-xs text-gray-400">
              {customer.departure_city || 'City not set'}
            </div>
          </div>
        </div>
      </td>

      {/* ── 2. Contact — phone + whatsapp (if different) + email ─── */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col gap-1">
          <div className="flex items-center text-sm text-gray-700">
            <Phone size={12} className="mr-2 text-gray-400 flex-shrink-0" />
            {customer.contact_number || '—'}
          </div>
          {customer.whatsapp_number &&
            customer.whatsapp_number !== customer.contact_number && (
            <div className="flex items-center text-xs text-gray-400">
              <Phone size={12} className="mr-2 text-gray-300 flex-shrink-0" />
              WA: {customer.whatsapp_number}
            </div>
          )}
          <div className="flex items-center text-xs text-gray-500">
            <Mail size={12} className="mr-2 text-gray-400 flex-shrink-0" />
            {customer.email_id || '—'}
          </div>
        </div>
      </td>

      {/* ── 3. Tour Destination ──────────────────────────────────── */}
      <td className="px-6 py-4 whitespace-nowrap">
        {tour ? (
          <div>
            <div className="flex items-center gap-1 text-sm text-gray-700">
              <MapPin size={13} className="text-gray-400 flex-shrink-0" />
              {tour.destination}
            </div>
            <div className="flex items-center gap-2 mt-1">
              {tourTypeName && (
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full
                                  ${getTourTypeColor(tourTypeName)}`}>
                  {tourTypeName}
                </span>
              )}
              {locationLabel && (
                <span className="text-xs text-gray-400">{locationLabel}</span>
              )}
            </div>
          </div>
        ) : (
          <span className="text-xs text-gray-400">No tour booked</span>
        )}
      </td>

      {/* ── 4. Package Type ──────────────────────────────────────── */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-700">
          {tour?.package_type || '—'}
        </span>
      </td>

      {/* ── 5. Travel Dates ──────────────────────────────────────── */}
      <td className="px-6 py-4 whitespace-nowrap">
        {tour ? (
          <div>
            <div className="text-sm text-gray-700">
              {safeFormat(tour.start_date, 'dd MMM yyyy')}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              → {safeFormat(tour.end_date, 'dd MMM yyyy')}
            </div>
          </div>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        )}
      </td>

      {/* ── 6. Group Size ────────────────────────────────────────── */}
      <td className="px-6 py-4 whitespace-nowrap">
        {tour ? (
          <div>
            <div className="text-sm text-gray-700">
              {tour.number_of_adults ?? 0} adult{tour.number_of_adults !== 1 ? 's' : ''}
            </div>
            {(tour.number_of_children ?? 0) > 0 && (
              <div className="text-xs text-gray-400 mt-0.5">
                {tour.number_of_children} child{tour.number_of_children !== 1 ? 'ren' : ''}
              </div>
            )}
          </div>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        )}
      </td>

      {/* ── 7. Amount Paid ───────────────────────────────────────── */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-medium text-green-700">
          {tour ? formatCurrency(tour.amount_paid) : '—'}
        </span>
      </td>

      {/* ── 8. Amount Pending ────────────────────────────────────── */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`text-sm font-medium ${
          tour?.amount_pending > 0 ? 'text-red-600' : 'text-gray-400'
        }`}>
          {tour
            ? (tour.amount_pending > 0 ? formatCurrency(tour.amount_pending) : '₹0')
            : '—'}
        </span>
      </td>

      {/* ── 9. Tour Status ───────────────────────────────────────── */}
      <td className="px-6 py-4 whitespace-nowrap">
        {tour ? (
          <span className={`px-2 py-1 inline-flex text-xs leading-5
                           font-semibold rounded-full
                           ${getTourStatusColor(tour.status)}`}>
            {tour.status || 'Upcoming'}
          </span>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        )}
      </td>

      {/* ── 10. Notes — expandable on click ──────────────────────── */}
      <td className="px-6 py-4" style={{ minWidth: '200px', maxWidth: '280px' }}>
        {hasNotes ? (
          <div>
            <p className={`text-xs text-gray-500 leading-relaxed ${
              notesExpanded ? '' : 'line-clamp-2'
            }`}>
              {tour.notes}
            </p>
            {notesNeedExpand && (
              <button
                onClick={() => setNotesExpanded((prev) => !prev)}
                className="mt-1 flex items-center gap-1 text-xs text-blue-500
                           hover:text-blue-700 transition-colors duration-150"
              >
                {notesExpanded
                  ? <><ChevronUp size={12} /> Show less</>
                  : <><ChevronDown size={12} /> Show more</>
                }
              </button>
            )}
          </div>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        )}
      </td>

    </tr>
  );
}