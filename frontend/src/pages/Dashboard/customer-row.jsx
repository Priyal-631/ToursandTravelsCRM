import { useState } from 'react';
import { format, isValid } from 'date-fns';
import { MapPin, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react';

export default function CustomerRow({ customer }) {

  // ── Expandable notes state ────────────────────────────────────────
  const [notesExpanded, setNotesExpanded] = useState(false);

  const getTourStatusColor = (status) => {
    const colors = {
      'Upcoming':  'bg-blue-100 text-blue-800',
      'Ongoing':   'bg-green-100 text-green-800',
      'Completed': 'bg-gray-100 text-gray-800',
      'Cancelled': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTourTypeColor = (type) => {
    return type === 'International'
      ? 'bg-purple-100 text-purple-800'
      : 'bg-orange-100 text-orange-800';
  };

  const getAvatarColor = (name) => {
    const colors = [
      'bg-blue-500', 'bg-purple-500', 'bg-green-500',
      'bg-red-500',  'bg-yellow-500', 'bg-pink-500',
    ];
    const index = (name?.charCodeAt(0) || 0) % colors.length;
    return colors[index];
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

  const tour = customer.tours?.[0] ?? null;
  const tourTypeName  = tour?.tour_type?.name ?? null;
  const locationLabel = tourTypeName === 'International'
    ? tour?.country?.name ?? null
    : tour?.state?.name ?? null;

  const hasNotes = tour?.notes && tour.notes.trim().length > 0;
  const notesNeedExpand = hasNotes && tour.notes.length > 60;

  // Shared compact td padding — no whitespace-nowrap
  const td = "px-2 py-2 align-top";

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150 align-top">

      {/* ── 1. Customer ──────────────────────────────────────────── */}
      <td className={td}>
        <div className="flex items-center gap-2 min-w-0">
          <div className={`h-7 w-7 rounded-full flex items-center justify-center
                          text-white font-semibold text-xs flex-shrink-0
                          ${getAvatarColor(customer.full_name)}`}>
            {customer.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-gray-900 truncate">
              {customer.full_name || '—'}
            </div>
            <div className="text-xs text-gray-400 truncate">
              {customer.departure_city || 'City not set'}
            </div>
          </div>
        </div>
      </td>

      {/* ── 2. Contact ───────────────────────────────────────────── */}
      <td className={td}>
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="flex items-center text-xs text-gray-700">
            <Phone size={11} className="mr-1 text-gray-400 flex-shrink-0" />
            <span className="truncate">{customer.contact_number || '—'}</span>
          </div>
          {customer.whatsapp_number &&
            customer.whatsapp_number !== customer.contact_number && (
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

      {/* ── 3. Tour Destination ──────────────────────────────────── */}
      <td className={td}>
        {tour ? (
          <div className="min-w-0">
            <div className="flex items-center gap-1 text-xs text-gray-700">
              <MapPin size={11} className="text-gray-400 flex-shrink-0" />
              <span className="truncate">{tour.destination}</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5 flex-wrap">
              {tourTypeName && (
                <span className={`px-1.5 py-0.5 text-xs font-semibold rounded-full
                                  ${getTourTypeColor(tourTypeName)}`}>
                  {tourTypeName}
                </span>
              )}
              {locationLabel && (
                <span className="text-xs text-gray-400 truncate">{locationLabel}</span>
              )}
            </div>
          </div>
        ) : (
          <span className="text-xs text-gray-400">No tour</span>
        )}
      </td>

      {/* ── 4. Package Type ──────────────────────────────────────── */}
      <td className={td}>
        <span className="text-xs text-gray-700 truncate block">
          {tour?.package_type || '—'}
        </span>
      </td>

      {/* ── 5. Travel Dates ──────────────────────────────────────── */}
      <td className={td}>
        {tour ? (
          <div>
            <div className="text-xs text-gray-700">
              {safeFormat(tour.start_date, 'dd MMM yy')}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              → {safeFormat(tour.end_date, 'dd MMM yy')}
            </div>
          </div>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        )}
      </td>

      {/* ── 6. Group Size ────────────────────────────────────────── */}
      <td className={td}>
        {tour ? (
          <div>
            <div className="text-xs text-gray-700">
              {tour.number_of_adults ?? 0}A
              {(tour.number_of_children ?? 0) > 0 &&
                ` / ${tour.number_of_children}C`}
            </div>
          </div>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        )}
      </td>

      {/* ── 7. Amount Paid ───────────────────────────────────────── */}
      <td className={td}>
        <span className="text-xs font-medium text-green-700 block truncate">
          {tour ? formatCurrency(tour.amount_paid) : '—'}
        </span>
      </td>

      {/* ── 8. Amount Pending ────────────────────────────────────── */}
      <td className={td}>
        <span className={`text-xs font-medium block truncate ${
          tour?.amount_pending > 0 ? 'text-red-600' : 'text-gray-400'
        }`}>
          {tour
            ? (tour.amount_pending > 0 ? formatCurrency(tour.amount_pending) : '₹0')
            : '—'}
        </span>
      </td>

      {/* ── 9. Tour Status ───────────────────────────────────────── */}
      <td className={td}>
        {tour ? (
          <span className={`px-1.5 py-0.5 inline-flex text-xs leading-5
                           font-semibold rounded-full
                           ${getTourStatusColor(tour.status)}`}>
            {tour.status || 'Upcoming'}
          </span>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        )}
      </td>

      {/* ── 10. Notes — expandable ───────────────────────────────── */}
      <td className={td}>
        {hasNotes ? (
          <div>
            <p className={`text-xs text-gray-500 leading-relaxed ${
              !notesExpanded && notesNeedExpand ? 'line-clamp-2' : ''
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
                  ? <><ChevronUp size={11} /> Less</>
                  : <><ChevronDown size={11} /> More</>
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