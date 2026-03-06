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

  // ── Search from Topbar via layout context ─────────────────────────
  const { searchQuery = '' } = useOutletContext() || {};

  // ── Fetch customers + nested tours ────────────────────────────────
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

  // ── FilterBar Apply ───────────────────────────────────────────────
  const handleApply = (filters) => {
    setActiveFilters(filters);
  };

  // ── Combined filter + search logic ────────────────────────────────
  useEffect(() => {
    let filtered = [...customers];
    const { from, to, month, year, type, state, destination, country } = activeFilters;

    // Topbar search — name, email, phone, tour destination
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

  const th = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600 mt-1">Manage and view all customer information</p>
      </div>

      {/* ✅ Stats cards — derives counts from the already-fetched customers */}
      <DashboardStats customers={customers} />

      <FilterBar onApply={handleApply} />

      <div className="mt-4 bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className={th}>Customer</th>
                <th className={th}>Contact</th>
                <th className={th}>Destination</th>
                <th className={th}>Package</th>
                <th className={th}>Travel Dates</th>
                <th className={th}>Group Size</th>
                <th className={th}>Paid</th>
                <th className={th}>Pending</th>
                <th className={th}>Tour Status</th>
                <th className={th}>Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="10" className="px-6 py-8 text-center text-gray-500">
                    Loading customers...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-6 py-8 text-center text-gray-500">
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