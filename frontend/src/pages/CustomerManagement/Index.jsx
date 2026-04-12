import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createCustomer, deleteCustomer, getCustomers, updateCustomer } from '@/api/customers';
import { createTour, updateTour } from '@/api/tours';
import { getCountries, getProfiles, getStates, getTourTypes } from '@/api/lookups';

const initialCustomer = { full_name: '', contact_number: '', whatsapp_number: '', email_id: '', departure_city: '', follow_up_status: 'New', follow_up_notes: '', assigned_to: '' };
const initialTour = { destination: '', package_type: '', start_date: '', end_date: '', number_of_adults: 1, number_of_children: 0, revenue: '', amount_paid: '', amount_pending: '', status: 'Upcoming', notes: '', tour_type_id: '', state_id: '', country_id: '' };

function CustomerModal({ open, customer, profiles, states, countries, tourTypes, saving, error, onClose, onSave }) {
  const [form, setForm] = useState(initialCustomer);
  const [tour, setTour] = useState(initialTour);

  useEffect(() => {
    if (!open) return;
    const currentTour = customer?.tours?.[0];
    setForm(customer ? { ...initialCustomer, ...customer } : initialCustomer);
    setTour(currentTour ? {
      ...initialTour,
      ...currentTour,
      start_date: currentTour.start_date ? String(currentTour.start_date).slice(0, 10) : '',
      end_date: currentTour.end_date ? String(currentTour.end_date).slice(0, 10) : '',
      tour_type_id: currentTour.tour_type?.id || '',
      state_id: currentTour.state?.id || '',
      country_id: currentTour.country?.id || '',
    } : initialTour);
  }, [open, customer]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">{customer ? 'Edit Customer' : 'Add Customer'}</h2>
        </div>
        <div className="space-y-4 px-6 py-5">
          {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <label className="block text-xs font-medium text-gray-600">Full Name<Input value={form.full_name} onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))} /></label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block text-xs font-medium text-gray-600">Contact Number<Input value={form.contact_number || ''} onChange={(e) => setForm((p) => ({ ...p, contact_number: e.target.value }))} /></label>
                <label className="block text-xs font-medium text-gray-600">WhatsApp Number<Input value={form.whatsapp_number || ''} onChange={(e) => setForm((p) => ({ ...p, whatsapp_number: e.target.value }))} /></label>
              </div>
              <label className="block text-xs font-medium text-gray-600">Email<Input type="email" value={form.email_id || ''} onChange={(e) => setForm((p) => ({ ...p, email_id: e.target.value }))} /></label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block text-xs font-medium text-gray-600">Departure City<Input value={form.departure_city || ''} onChange={(e) => setForm((p) => ({ ...p, departure_city: e.target.value }))} /></label>
                <label className="block text-xs font-medium text-gray-600">Assigned To
                  <select className="mt-1 h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-sm" value={form.assigned_to || ''} onChange={(e) => setForm((p) => ({ ...p, assigned_to: e.target.value }))}>
                    <option value="">Unassigned</option>
                    {profiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.full_name || profile.email}</option>)}
                  </select>
                </label>
              </div>
              <label className="block text-xs font-medium text-gray-600">Follow-up Status
                <select className="mt-1 h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-sm" value={form.follow_up_status || 'New'} onChange={(e) => setForm((p) => ({ ...p, follow_up_status: e.target.value }))}>
                  {['New', 'Contacted', 'Interested', 'Converted', 'Lost'].map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </label>
              <label className="block text-xs font-medium text-gray-600">Notes<textarea className="mt-1 min-h-24 w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={form.follow_up_notes || ''} onChange={(e) => setForm((p) => ({ ...p, follow_up_notes: e.target.value }))} /></label>
            </div>
            <div className="space-y-3">
              <label className="block text-xs font-medium text-gray-600">Destination<Input value={tour.destination || ''} onChange={(e) => setTour((p) => ({ ...p, destination: e.target.value }))} /></label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block text-xs font-medium text-gray-600">Tour Type
                  <select className="mt-1 h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-sm" value={tour.tour_type_id || ''} onChange={(e) => setTour((p) => ({ ...p, tour_type_id: e.target.value }))}>
                    <option value="">Select type</option>
                    {tourTypes.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}
                  </select>
                </label>
                <label className="block text-xs font-medium text-gray-600">Package Type<Input value={tour.package_type || ''} onChange={(e) => setTour((p) => ({ ...p, package_type: e.target.value }))} /></label>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block text-xs font-medium text-gray-600">Start Date<Input type="date" value={tour.start_date || ''} onChange={(e) => setTour((p) => ({ ...p, start_date: e.target.value }))} /></label>
                <label className="block text-xs font-medium text-gray-600">End Date<Input type="date" value={tour.end_date || ''} onChange={(e) => setTour((p) => ({ ...p, end_date: e.target.value }))} /></label>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block text-xs font-medium text-gray-600">State<select className="mt-1 h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-sm" value={tour.state_id || ''} onChange={(e) => setTour((p) => ({ ...p, state_id: e.target.value }))}><option value="">Select state</option>{states.map((state) => <option key={state.id} value={state.id}>{state.name}</option>)}</select></label>
                <label className="block text-xs font-medium text-gray-600">Country<select className="mt-1 h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-sm" value={tour.country_id || ''} onChange={(e) => setTour((p) => ({ ...p, country_id: e.target.value }))}><option value="">Select country</option>{countries.map((country) => <option key={country.id} value={country.id}>{country.name}</option>)}</select></label>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <label className="block text-xs font-medium text-gray-600">Revenue<Input type="number" min="0" value={tour.revenue ?? ''} onChange={(e) => setTour((p) => ({ ...p, revenue: e.target.value }))} /></label>
                <label className="block text-xs font-medium text-gray-600">Paid<Input type="number" min="0" value={tour.amount_paid ?? ''} onChange={(e) => setTour((p) => ({ ...p, amount_paid: e.target.value }))} /></label>
                <label className="block text-xs font-medium text-gray-600">Pending<Input type="number" min="0" value={tour.amount_pending ?? ''} onChange={(e) => setTour((p) => ({ ...p, amount_pending: e.target.value }))} /></label>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={() => onSave(form, tour)} disabled={saving} className="bg-[#2F4156] text-white hover:bg-[#253548]">{saving ? 'Saving...' : customer ? 'Save Changes' : 'Add Customer'}</Button>
        </div>
      </div>
    </div>
  );
}

export default function CustomerManagementPage() {
  const { searchQuery = '' } = useOutletContext() || {};
  const [customers, setCustomers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [tourTypes, setTourTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [modalCustomer, setModalCustomer] = useState(undefined);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [customerData, profileData, stateData, countryData, typeData] = await Promise.all([getCustomers(), getProfiles(), getStates(), getCountries(), getTourTypes()]);
        setCustomers(customerData || []);
        setProfiles(profileData || []);
        setStates(stateData || []);
        setCountries(countryData || []);
        setTourTypes(typeData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const needle = searchQuery.trim().toLowerCase();
    if (!needle) return customers;
    return customers.filter((customer) => [customer.full_name, customer.email_id, customer.contact_number, customer.tours?.[0]?.destination].filter(Boolean).some((value) => String(value).toLowerCase().includes(needle)));
  }, [customers, searchQuery]);

  const syncCustomer = async (form, tour) => {
    try {
      setSaving(true);
      setSaveError('');
      const payload = { ...initialCustomer, ...form, assigned_to: form.assigned_to || null };
      const tourPayload = tour.destination ? { destination: tour.destination, package_type: tour.package_type || null, start_date: tour.start_date || null, end_date: tour.end_date || null, revenue: tour.revenue === '' ? null : Number(tour.revenue), amount_paid: tour.amount_paid === '' ? null : Number(tour.amount_paid), amount_pending: tour.amount_pending === '' ? null : Number(tour.amount_pending), number_of_adults: Number(tour.number_of_adults || 1), number_of_children: Number(tour.number_of_children || 0), status: tour.status || 'Upcoming', notes: tour.notes || null, tour_type_id: tour.tour_type_id ? Number(tour.tour_type_id) : null, state_id: tour.state_id ? Number(tour.state_id) : null, country_id: tour.country_id ? Number(tour.country_id) : null } : null;
      if (!modalCustomer) {
        const created = await createCustomer({ ...payload, tour: tourPayload });
        setCustomers((prev) => [created, ...prev]);
      } else {
        const updated = await updateCustomer(modalCustomer.id, payload);
        let next = updated;
        if (tourPayload) {
          const currentTourId = modalCustomer.tours?.[0]?.id;
          const savedTour = currentTourId ? await updateTour(currentTourId, tourPayload) : await createTour({ ...tourPayload, customer_id: modalCustomer.id });
          next = { ...updated, tours: [savedTour, ...(updated.tours || []).filter((item) => item.id !== savedTour.id)] };
        }
        setCustomers((prev) => prev.map((item) => item.id === modalCustomer.id ? next : item));
      }
      setModalCustomer(undefined);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden w-full min-w-0">
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0 w-full min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">Customer Management</h1>
            <p className="text-gray-500 text-xs mt-0.5">Manage customer records with live backend data</p>
          </div>
          <Button onClick={() => { setSaveError(''); setModalCustomer(null); }} className="bg-[#2F4156] text-white hover:bg-[#253548]"><Plus className="h-4 w-4" />Add Customer</Button>
        </div>
        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        <div className="bg-white rounded-lg shadow border border-gray-100 overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr>{['Customer', 'Contact', 'Destination', 'Assigned To', 'Status', 'Revenue', 'Actions'].map((title) => <th key={title} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</th>)}</tr></thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-400 text-sm">Loading customers...</td></tr> : filtered.length === 0 ? <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-400 text-sm">No customers found</td></tr> : filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4"><div className="text-sm font-medium text-gray-900">{customer.full_name}</div><div className="text-xs text-gray-400">{customer.departure_city || 'City not set'}</div></td>
                  <td className="px-4 py-4"><div className="text-sm text-gray-700">{customer.contact_number || '-'}</div><div className="text-xs text-gray-400">{customer.email_id || '-'}</div></td>
                  <td className="px-4 py-4"><div className="text-sm text-gray-700">{customer.tours?.[0]?.destination || 'No tour'}</div><div className="text-xs text-gray-400">{customer.tours?.[0]?.tour_type?.name || '-'}</div></td>
                  <td className="px-4 py-4 text-sm text-gray-700">{customer.assignedProfile?.full_name || 'Unassigned'}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{customer.follow_up_status || '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{customer.tours?.[0]?.revenue != null ? `Rs ${Number(customer.tours[0].revenue).toLocaleString('en-IN')}` : '-'}</td>
                  <td className="px-4 py-4"><div className="flex items-center gap-3 text-sm"><button onClick={() => { setSaveError(''); setModalCustomer(customer); }} className="text-gray-600 hover:text-[#567C8D]">Edit</button><button onClick={async () => { if (!window.confirm(`Delete ${customer.full_name}?`)) return; try { await deleteCustomer(customer.id); setCustomers((prev) => prev.filter((item) => item.id !== customer.id)); } catch (err) { setError(err.message); } }} className="text-gray-600 hover:text-red-600">Delete</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <CustomerModal open={modalCustomer !== undefined} customer={modalCustomer || null} profiles={profiles} states={states} countries={countries} tourTypes={tourTypes} saving={saving} error={saveError} onClose={() => setModalCustomer(undefined)} onSave={syncCustomer} />
    </div>
  );
}
