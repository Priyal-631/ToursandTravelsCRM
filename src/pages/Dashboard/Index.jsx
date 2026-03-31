import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '@/api/supabaseClient';
import DashboardStats from './dashboardstats';
import FilterBar from './Filterbar';
import CustomerRow from './customer-row';

const MONTH_INDEX = {
  January: 0, February: 1, March: 2,  April: 3,
  May: 4,     June: 5,     July: 6,   August: 7,
  September: 8, October: 9, November: 10, December: 11,
};

export default function Dashboard() {
  const [customers, setCustomers]                 = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [activeFilters, setActiveFilters]         = useState({
    from: '', to: '', month: '', year: '',
    type: '', state: '', destination: '', country: '',
  });
  const [loading, setLoading] = useState(true);

  const { searchQuery = '' } = useOutletContext() || {};

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select(`
          id,
          full_name,
          contact_number,
          whatsapp_number,
          email_id,
          departure_city,
          follow_up_status,
          created_at,
          tours (
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
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (filters) => {
    setActiveFilters(filters);
  };

  useEffect(() => {
    let filtered = [...customers];
    const { from, to, month, year, type, state, destination, country } = activeFilters;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((c) =>
        c.full_name?.toLowerCase().includes(q) ||
        c.email_id?.toLowerCase().includes(q) ||
        c.contact_number?.includes(searchQuery) ||
        c.tours?.[0]?.destination?.toLowerCase().includes(q)
      );
    }

    if (from) {
      filtered = filtered.filter((c) => {
        const tour = c.tours?.[0];
        if (!tour?.start_date) return false;
        return new Date(tour.start_date) >= new Date(from);
      });
    }
    if (to) {
      filtered = filtered.filter((c) => {
        const tour = c.tours?.[0];
        if (!tour?.start_date) return false;
        return new Date(tour.start_date) <= new Date(to);
      });
    }
    if (month && MONTH_INDEX[month] !== undefined) {
      filtered = filtered.filter((c) => {
        const tour = c.tours?.[0];
        if (!tour?.start_date) return false;
        return new Date(tour.start_date).getMonth() === MONTH_INDEX[month];
      });
    }
    if (year) {
      filtered = filtered.filter((c) => {
        const tour = c.tours?.[0];
        if (!tour?.start_date) return false;
        return new Date(tour.start_date).getFullYear().toString() === year;
      });
    }
    if (type) {
      filtered = filtered.filter((c) => {
        const tour = c.tours?.[0];
        return tour?.tour_type?.name === type;
      });
    }
    if (state) {
      filtered = filtered.filter((c) => {
        const tour = c.tours?.[0];
        return tour?.state?.name?.toLowerCase() === state.toLowerCase();
      });
    }
    if (country) {
      filtered = filtered.filter((c) => {
        const tour = c.tours?.[0];
        return tour?.country?.name?.toLowerCase() === country.toLowerCase();
      });
    }
    if (destination) {
      filtered = filtered.filter((c) => {
        const tour = c.tours?.[0];
        return tour?.destination?.toLowerCase().includes(destination.toLowerCase());
      });
    }

    setFilteredCustomers(filtered);
  }, [customers, activeFilters, searchQuery]);

  // ── Compact, truncating header — no whitespace-nowrap so columns don't blow out
  const th = "px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider truncate";

  return (
    // w-full + min-w-0 prevents the flex child from exceeding the layout width
    <div className="flex flex-col h-full overflow-hidden w-full min-w-0">

      {/* ── Scrollable content area ── */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0 w-full min-w-0">

        {/* Page header */}
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">Customers</h1>
          <p className="text-gray-500 text-xs mt-0.5">Manage and view all customer information</p>
        </div>

        {/* Stats */}
        <DashboardStats customers={customers} />

        {/* Filter bar */}
        <FilterBar onApply={handleApply} />

        {/* Table — overflow-x-auto here lets the table scroll horizontally
            inside the page instead of pushing the page wider             */}
        <div className="bg-white rounded-lg shadow border border-gray-100 overflow-x-auto">
          <table className="w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className={`${th} w-[13%]`}>Customer</th>
                <th className={`${th} w-[12%]`}>Contact</th>
                <th className={`${th} w-[12%]`}>Destination</th>
                <th className={`${th} w-[10%]`}>Package</th>
                <th className={`${th} w-[12%]`}>Travel Dates</th>
                <th className={`${th} w-[8%]`}>Group</th>
                <th className={`${th} w-[8%]`}>Paid</th>
                <th className={`${th} w-[8%]`}>Pending</th>
                <th className={`${th} w-[9%]`}>Status</th>
                <th className={`${th} w-[8%]`}>Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="10" className="px-6 py-8 text-center text-gray-400 text-sm">
                    Loading customers…
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-6 py-8 text-center text-gray-400 text-sm">
                    No customers found
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <CustomerRow key={customer.id} customer={customer} />
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}