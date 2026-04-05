/**
 * src/pages/CustomerManagement/Index.jsx
 *
 * Customer Management page (Admin only route: /admin/customers)
 *
 * Fixes in this version:
 *  - Tour data (Destination, Package, Dates, Group, Paid, Pending, Status, Notes)
 *    is correctly inserted via addCustomer() which writes to both customers + tours tables
 *  - Actions column (Edit / Delete) wired through CustomerRow → onUpdated / onDeleted
 *  - Delete removes the row instantly from local state
 *  - Edit saves and reflects immediately in table + DashboardStats
 *  - Export CSV uses the fixed ExportCsv helper (dates show as dd/mm/yyyy)
 *  - FilterBar at top, Export CSV + Add Customer buttons in header
 */

import { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '@/api/supabaseClient';
import { addCustomer } from '@/api/customers';
import { exportCsv } from '@/api/ExportCsv';
import DashboardStats from '@/pages/Dashboard/dashboardstats';
import FilterBar from '@/pages/Dashboard/Filterbar';
import CustomerRow from '@/pages/Dashboard/customer-row';
import AddCustomerModal from './AddCustomerModal';
import { Download, Plus } from 'lucide-react';

const MONTH_INDEX = {
  January: 0, February: 1, March: 2,  April: 3,
  May: 4,     June: 5,     July: 6,   August: 7,
  September: 8, October: 9, November: 10, December: 11,
};

// ── Shared Supabase select ────────────────────────────────────────────
const CUSTOMER_SELECT = `
  id,
  full_name,
  contact_number,
  whatsapp_number,
  email_id,
  departure_city,
  follow_up_status,
  created_at,
  tours (
    id,
    destination,
    package_type,
    start_date,
    end_date,
    number_of_adults,
    number_of_children,
    amount_paid,
    amount_pending,
    status,
    notes,
    tour_type:tour_type_id ( name ),
    state:state_id ( name ),
    country:country_id ( name )
  )
`;

// ── CSV export (dates already formatted by ExportCsv.js) ─────────────
function handleExportCsv(customers) {
  if (!customers.length) return;
  const rows = customers.map(c => {
    const t = c.tours?.[0] ?? {};
    return {
      'Name':         c.full_name        || '',
      'Contact':      c.contact_number   || '',
      'WhatsApp':     c.whatsapp_number  || '',
      'Email':        c.email_id         || '',
      'City':         c.departure_city   || '',
      'Follow-up':    c.follow_up_status || '',
      'Destination':  t.destination      || '',
      'Package':      t.package_type     || '',
      'Start Date':   t.start_date       || '',   // ExportCsv.js formats ISO → dd/mm/yyyy
      'End Date':     t.end_date         || '',
      'Adults':       t.number_of_adults  ?? '',
      'Children':     t.number_of_children ?? '',
      'Paid (INR)':   t.amount_paid       ?? '',
      'Pending (INR)':t.amount_pending    ?? '',
      'Tour Status':  t.status            || '',
      'Notes':        t.notes             || '',
    };
  });
  exportCsv(rows, `customers-${new Date().toISOString().slice(0, 10)}`);
}

export default function CustomerManagement() {
  const [customers, setCustomers]                 = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [activeFilters, setActiveFilters]         = useState({
    from: '', to: '', month: '', year: '',
    type: '', state: '', destination: '', country: '',
  });
  const [loading, setLoading]   = useState(true);
  const [showAdd, setShowAdd]   = useState(false);
  const [addError, setAddError] = useState(null);
  const { searchQuery = '' } = useOutletContext() || {};

  // ── Fetch all customers ───────────────────────────────────────────
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select(CUSTOMER_SELECT)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setCustomers(data || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  // ── Add customer ──────────────────────────────────────────────────
  // addCustomer() in customers.js inserts into customers AND tours tables
  // and returns the full customer object (with nested tours) from Supabase.
  const handleAddSubmit = async (custFields, tourFields) => {
    try {
      setAddError(null);
      const newCustomer = await addCustomer(custFields, tourFields);
      // Prepend to local state → instantly visible in table and stats
      setCustomers(prev => [newCustomer, ...prev]);
      setShowAdd(false);
    } catch (err) {
      console.error('Add error:', err);
      setAddError(err.message || 'Failed to add customer. Please try again.');
    }
  };

  // ── Inline edit saved ─────────────────────────────────────────────
  const handleUpdated = (updatedCustomer) => {
    setCustomers(prev =>
      prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c)
    );
  };

  // ── Delete ────────────────────────────────────────────────────────
  const handleDeleted = (customerId) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
  };

  // ── Filter logic ──────────────────────────────────────────────────
  useEffect(() => {
    let filtered = [...customers];
    const { from, to, month, year, type, state, destination, country } = activeFilters;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.full_name?.toLowerCase().includes(q) ||
        c.email_id?.toLowerCase().includes(q) ||
        c.contact_number?.includes(searchQuery) ||
        c.tours?.[0]?.destination?.toLowerCase().includes(q)
      );
    }
    if (from) {
      filtered = filtered.filter(c => {
        const t = c.tours?.[0];
        return t?.start_date && new Date(t.start_date) >= new Date(from);
      });
    }
    if (to) {
      filtered = filtered.filter(c => {
        const t = c.tours?.[0];
        return t?.start_date && new Date(t.start_date) <= new Date(to);
      });
    }
    if (month && MONTH_INDEX[month] !== undefined) {
      filtered = filtered.filter(c => {
        const t = c.tours?.[0];
        return t?.start_date && new Date(t.start_date).getMonth() === MONTH_INDEX[month];
      });
    }
    if (year) {
      filtered = filtered.filter(c => {
        const t = c.tours?.[0];
        return t?.start_date && new Date(t.start_date).getFullYear().toString() === year;
      });
    }
    if (type)        filtered = filtered.filter(c => c.tours?.[0]?.tour_type?.name === type);
    if (state)       filtered = filtered.filter(c => c.tours?.[0]?.state?.name?.toLowerCase() === state.toLowerCase());
    if (country)     filtered = filtered.filter(c => c.tours?.[0]?.country?.name?.toLowerCase() === country.toLowerCase());
    if (destination) filtered = filtered.filter(c => c.tours?.[0]?.destination?.toLowerCase().includes(destination.toLowerCase()));

    setFilteredCustomers(filtered);
  }, [customers, activeFilters, searchQuery]);

  const th = "px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider truncate";

  return (
    <div className="flex flex-col h-full overflow-hidden w-full min-w-0">
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0 w-full min-w-0">

        {/* ── Header ── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">Customer Management</h1>
            <p className="text-gray-500 text-xs mt-0.5">Manage and view all customer information</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExportCsv(filteredCustomers)}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-[#2F4156] hover:text-white hover:border-[#2F4156] transition-colors duration-150"
            >
              <Download size={13} />
              Export CSV
            </button>
            <button
              onClick={() => { setAddError(null); setShowAdd(true); }}
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-[#2F4156] text-white rounded-lg hover:bg-[#253548] transition-colors duration-150"
            >
              <Plus size={14} />
              Add Customer
            </button>
          </div>
        </div>

        {/* ── Stats (full list, not filtered) ── */}
        <DashboardStats customers={customers} />

        {/* ── Filter bar ── */}
        <FilterBar onApply={filters => setActiveFilters(filters)} />

        {/* ── Table ── */}
        <div className="bg-white rounded-lg shadow border border-gray-100 overflow-x-auto">
          <table className="w-full table-fixed divide-y divide-gray-200" style={{ minWidth: 1100 }}>
            <thead className="bg-gray-50">
              <tr>
                <th className={`${th} w-[12%]`}>Customer</th>
                <th className={`${th} w-[11%]`}>Contact</th>
                <th className={`${th} w-[11%]`}>Destination</th>
                <th className={`${th} w-[9%]`}>Package</th>
                <th className={`${th} w-[10%]`}>Travel Dates</th>
                <th className={`${th} w-[6%]`}>Group</th>
                <th className={`${th} w-[7%]`}>Paid</th>
                <th className={`${th} w-[7%]`}>Pending</th>
                <th className={`${th} w-[8%]`}>Status</th>
                <th className={`${th} w-[12%]`}>Notes</th>
                <th className={`${th} w-[7%]`}>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="11" className="px-6 py-8 text-center text-gray-400 text-sm">
                    Loading customers…
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="11" className="px-6 py-8 text-center text-gray-400 text-sm">
                    No customers found
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(customer => (
                  <CustomerRow
                    key={customer.id}
                    customer={customer}
                    onUpdated={handleUpdated}
                    onDeleted={handleDeleted}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* ── Add Customer Modal ── */}
      {showAdd && (
        <AddCustomerModal
          onClose={() => setShowAdd(false)}
          onSubmit={handleAddSubmit}
          error={addError}
        />
      )}
    </div>
  );
}