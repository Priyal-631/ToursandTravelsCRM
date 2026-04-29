import { useEffect, useState } from 'react'
import { CalendarDays, Plus, Search, UserCheck, UserX, Users } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  getCustomerStats,
  updateCustomer
} from '@/api/customers'
import { createTour, updateTour } from '@/api/tours'
import { getCountries, getProfiles, getStates, getTourTypes } from '@/api/lookups'

const PAGE_SIZE = 10

const initialCustomer = {
  full_name: '',
  contact_number: '',
  whatsapp_number: '',
  email_id: '',
  departure_city: '',
  follow_up_status: 'New',
  follow_up_notes: '',
  assigned_to: ''
}

const initialTour = {
  destination: '',
  package_type: '',
  start_date: '',
  end_date: '',
  number_of_adults: 1,
  number_of_children: 0,
  revenue: '',
  amount_paid: '',
  amount_pending: '',
  status: 'Upcoming',
  notes: '',
  tour_type_id: '',
  state_id: '',
  country_id: ''
}

function StatCard({ label, value, icon: Icon, iconClass }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`rounded-lg p-2 ${iconClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}

function CustomerModal({ open, customer, profiles, states, countries, tourTypes, saving, error, onClose, onSave }) {
  const [form, setForm] = useState(initialCustomer)
  const [tour, setTour] = useState(initialTour)

  useEffect(() => {
    if (!open) return
    const currentTour = customer?.tours?.[0]
    setForm(customer ? { ...initialCustomer, ...customer } : initialCustomer)
    setTour(
      currentTour
        ? {
            ...initialTour,
            ...currentTour,
            start_date: currentTour.start_date ? String(currentTour.start_date).slice(0, 10) : '',
            end_date: currentTour.end_date ? String(currentTour.end_date).slice(0, 10) : '',
            tour_type_id: currentTour.tour_type?.id || '',
            state_id: currentTour.state?.id || '',
            country_id: currentTour.country?.id || ''
          }
        : initialTour
    )
  }, [open, customer])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">{customer ? 'Edit Customer' : 'Add Customer'}</h2>
        </div>
        <div className="space-y-4 px-6 py-5">
          {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <label className="block text-xs font-medium text-gray-600">Full Name<Input value={form.full_name} onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))} /></label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block text-xs font-medium text-gray-600">Contact Number<Input value={form.contact_number || ''} onChange={(event) => setForm((current) => ({ ...current, contact_number: event.target.value }))} /></label>
                <label className="block text-xs font-medium text-gray-600">WhatsApp Number<Input value={form.whatsapp_number || ''} onChange={(event) => setForm((current) => ({ ...current, whatsapp_number: event.target.value }))} /></label>
              </div>
              <label className="block text-xs font-medium text-gray-600">Email<Input type="email" value={form.email_id || ''} onChange={(event) => setForm((current) => ({ ...current, email_id: event.target.value }))} /></label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block text-xs font-medium text-gray-600">Departure City<Input value={form.departure_city || ''} onChange={(event) => setForm((current) => ({ ...current, departure_city: event.target.value }))} /></label>
              </div>
              <label className="block text-xs font-medium text-gray-600">Notes<textarea className="mt-1 min-h-24 w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={form.follow_up_notes || ''} onChange={(event) => setForm((current) => ({ ...current, follow_up_notes: event.target.value }))} /></label>
            </div>
            <div className="space-y-3">
              <label className="block text-xs font-medium text-gray-600">Destination<Input value={tour.destination || ''} onChange={(event) => setTour((current) => ({ ...current, destination: event.target.value }))} /></label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block text-xs font-medium text-gray-600">Tour Type
                  <select className="mt-1 h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-sm" value={tour.tour_type_id || ''} onChange={(event) => setTour((current) => ({ ...current, tour_type_id: event.target.value }))}>
                    <option value="">Select type</option>
                    {tourTypes.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}
                  </select>
                </label>
                <label className="block text-xs font-medium text-gray-600">Package Type<Input value={tour.package_type || ''} onChange={(event) => setTour((current) => ({ ...current, package_type: event.target.value }))} /></label>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block text-xs font-medium text-gray-600">Start Date<Input type="date" value={tour.start_date || ''} onChange={(event) => setTour((current) => ({ ...current, start_date: event.target.value }))} /></label>
                <label className="block text-xs font-medium text-gray-600">End Date<Input type="date" value={tour.end_date || ''} onChange={(event) => setTour((current) => ({ ...current, end_date: event.target.value }))} /></label>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block text-xs font-medium text-gray-600">State<select className="mt-1 h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-sm" value={tour.state_id || ''} onChange={(event) => setTour((current) => ({ ...current, state_id: event.target.value }))}><option value="">Select state</option>{states.map((state) => <option key={state.id} value={state.id}>{state.name}</option>)}</select></label>
                <label className="block text-xs font-medium text-gray-600">Country<select className="mt-1 h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-sm" value={tour.country_id || ''} onChange={(event) => setTour((current) => ({ ...current, country_id: event.target.value }))}><option value="">Select country</option>{countries.map((country) => <option key={country.id} value={country.id}>{country.name}</option>)}</select></label>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <label className="block text-xs font-medium text-gray-600">Revenue<Input type="number" min="0" value={tour.revenue ?? ''} onChange={(event) => setTour((current) => ({ ...current, revenue: event.target.value }))} /></label>
                <label className="block text-xs font-medium text-gray-600">Paid<Input type="number" min="0" value={tour.amount_paid ?? ''} onChange={(event) => setTour((current) => ({ ...current, amount_paid: event.target.value }))} /></label>
                <label className="block text-xs font-medium text-gray-600">Pending<Input type="number" min="0" value={tour.amount_pending ?? ''} onChange={(event) => setTour((current) => ({ ...current, amount_pending: event.target.value }))} /></label>
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
  )
}

export default function CustomerManagementPage() {
  const { searchQuery = '' } = useOutletContext() || {}
  const [customers, setCustomers] = useState([])
  const [profiles, setProfiles] = useState([])
  const [states, setStates] = useState([])
  const [countries, setCountries] = useState([])
  const [tourTypes, setTourTypes] = useState([])
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    inactiveCustomers: 0,
    newThisMonth: 0
  })
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [modalCustomer, setModalCustomer] = useState(undefined)
  const [localSearch, setLocalSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [locationFilter, setLocationFilter] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [yearFilter, setYearFilter] = useState('')
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1
  })

  const normalizedSearch = (localSearch || searchQuery).trim()
  const yearOptions = ['2024', '2025', '2026']

  useEffect(() => {
    setPage(1)
  }, [normalizedSearch, statusFilter, locationFilter, fromDate, toDate, yearFilter])

  useEffect(() => {
    const loadLookups = async () => {
      try {
        const [profileData, stateData, countryData, typeData] = await Promise.all([
          getProfiles(),
          getStates(),
          getCountries(),
          getTourTypes()
        ])
        setProfiles(profileData || [])
        setStates(stateData || [])
        setCountries(countryData || [])
        setTourTypes(typeData || [])
      } catch (err) {
        setError(err.message)
      }
    }

    loadLookups()
  }, [])

  useEffect(() => {
    const loadStats = async () => {
      try {
        setStatsLoading(true)
        const statsData = await getCustomerStats()
        setStats(statsData || {
          totalCustomers: 0,
          activeCustomers: 0,
          inactiveCustomers: 0,
          newThisMonth: 0
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setStatsLoading(false)
      }
    }

    loadStats()
  }, [])

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true)
        setError('')
        const customerData = await getCustomers({
          search: normalizedSearch,
          status: statusFilter,
          location: locationFilter,
          fromDate,
          toDate,
          year: yearFilter,
          page,
          limit: PAGE_SIZE
        })
        setCustomers(customerData?.items || [])
        setMeta(customerData?.meta || {
          page: 1,
          limit: PAGE_SIZE,
          total: 0,
          totalPages: 1
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadCustomers()
  }, [normalizedSearch, statusFilter, locationFilter, fromDate, toDate, yearFilter, page])

  const reloadStats = async () => {
    const statsData = await getCustomerStats()
    setStats(statsData || {
      totalCustomers: 0,
      activeCustomers: 0,
      inactiveCustomers: 0,
      newThisMonth: 0
    })
  }

  const syncCustomer = async (form, tour) => {
    try {
      setSaving(true)
      setSaveError('')
      const payload = { ...initialCustomer, ...form, assigned_to: form.assigned_to || null }
      const tourPayload = tour.destination
        ? {
            destination: tour.destination,
            package_type: tour.package_type || null,
            start_date: tour.start_date || null,
            end_date: tour.end_date || null,
            revenue: tour.revenue === '' ? null : Number(tour.revenue),
            amount_paid: tour.amount_paid === '' ? null : Number(tour.amount_paid),
            amount_pending: tour.amount_pending === '' ? null : Number(tour.amount_pending),
            number_of_adults: Number(tour.number_of_adults || 1),
            number_of_children: Number(tour.number_of_children || 0),
            status: tour.status || 'Upcoming',
            notes: tour.notes || null,
            tour_type_id: tour.tour_type_id ? Number(tour.tour_type_id) : null,
            state_id: tour.state_id ? Number(tour.state_id) : null,
            country_id: tour.country_id ? Number(tour.country_id) : null
          }
        : null

      if (!modalCustomer) {
        await createCustomer({ ...payload, tour: tourPayload })
      } else {
        await updateCustomer(modalCustomer.id, payload)
        if (tourPayload) {
          const currentTourId = modalCustomer.tours?.[0]?.id
          if (currentTourId) {
            await updateTour(currentTourId, tourPayload)
          } else {
            await createTour({ ...tourPayload, customer_id: modalCustomer.id })
          }
        }
      }

      setModalCustomer(undefined)
      const customerData = await getCustomers({
        search: normalizedSearch,
        status: statusFilter,
        location: locationFilter,
        fromDate,
        toDate,
        year: yearFilter,
        page,
        limit: PAGE_SIZE
      })
      setCustomers(customerData?.items || [])
      setMeta(customerData?.meta || meta)
      await reloadStats()
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (customer) => {
    if (!window.confirm(`Delete ${customer.full_name}?`)) return

    try {
      await deleteCustomer(customer.id)
      const nextPage = customers.length === 1 && page > 1 ? page - 1 : page
      if (nextPage !== page) setPage(nextPage)
      const customerData = await getCustomers({
        search: normalizedSearch,
        status: statusFilter,
        location: locationFilter,
        fromDate,
        toDate,
        year: yearFilter,
        page: nextPage,
        limit: PAGE_SIZE
      })
      setCustomers(customerData?.items || [])
      setMeta(customerData?.meta || meta)
      await reloadStats()
    } catch (err) {
      setError(err.message)
    }
  }

  const clearFilters = () => {
    setLocalSearch('')
    setStatusFilter('All')
    setLocationFilter('')
    setFromDate('')
    setToDate('')
    setYearFilter('')
    setPage(1)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden w-full min-w-0">
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0 w-full min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">Customer Management</h1>
            <p className="text-gray-500 text-xs mt-0.5">Manage customer records with live backend data</p>
          </div>
          <Button onClick={() => { setSaveError(''); setModalCustomer(null) }} className="bg-[#2F4156] text-white hover:bg-[#253548]"><Plus className="h-4 w-4" />Add Customer</Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Customers" value={statsLoading ? '...' : stats.totalCustomers} icon={Users} iconClass="bg-blue-50 text-blue-600" />
          <StatCard label="Active Customers" value={statsLoading ? '...' : stats.activeCustomers} icon={UserCheck} iconClass="bg-green-50 text-green-600" />
          <StatCard label="Inactive Customers" value={statsLoading ? '...' : stats.inactiveCustomers} icon={UserX} iconClass="bg-red-50 text-red-600" />
          <StatCard label="New This Month" value={statsLoading ? '...' : stats.newThisMonth} icon={CalendarDays} iconClass="bg-amber-50 text-amber-600" />
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[220px] flex-1">
              <label className="text-xs font-medium text-gray-500">Search</label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  value={localSearch}
                  onChange={(event) => setLocalSearch(event.target.value)}
                  placeholder="Search by name, email or phone..."
                  className="pl-9 h-9 bg-[#F5EFEB] border-[#ddd4cc] focus:bg-white"
                />
              </div>
            </div>

            <div className="min-w-[150px]">
              <label className="text-xs font-medium text-gray-500">Status</label>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="mt-1 h-9 w-full rounded-md border border-[#ddd4cc] bg-[#F5EFEB] px-3 text-sm">
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="min-w-[180px]">
              <label className="text-xs font-medium text-gray-500">Location</label>
              <Input
                value={locationFilter}
                onChange={(event) => setLocationFilter(event.target.value)}
                placeholder="Destination or city"
                className="mt-1 h-9 bg-[#F5EFEB] border-[#ddd4cc] focus:bg-white"
              />
            </div>

            <div className="min-w-[150px]">
              <label className="text-xs font-medium text-gray-500">From Date</label>
              <Input
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                className="mt-1 h-9 bg-[#F5EFEB] border-[#ddd4cc] focus:bg-white"
              />
            </div>

            <div className="min-w-[150px]">
              <label className="text-xs font-medium text-gray-500">To Date</label>
              <Input
                type="date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
                className="mt-1 h-9 bg-[#F5EFEB] border-[#ddd4cc] focus:bg-white"
              />
            </div>

            <div className="min-w-[120px]">
              <label className="text-xs font-medium text-gray-500">Year</label>
              <select value={yearFilter} onChange={(event) => setYearFilter(event.target.value)} className="mt-1 h-9 w-full rounded-md border border-[#ddd4cc] bg-[#F5EFEB] px-3 text-sm">
                <option value="">All Years</option>
                {yearOptions.map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>

            <div className="min-w-[130px]">
              <Button variant="outline" onClick={clearFilters} className="h-9 w-full border-[#ddd4cc] bg-[#F5EFEB] hover:bg-white">
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div className="bg-white rounded-lg shadow border border-gray-100 overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Customer', 'Contact', 'Destination', 'Status', 'Revenue', 'Actions'].map((title) => (
                  <th key={title} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-400 text-sm">Loading customers...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-400 text-sm">No customers found</td></tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4"><div className="text-sm font-medium text-gray-900">{customer.full_name}</div><div className="text-xs text-gray-400">{customer.departure_city || 'City not set'}</div></td>
                    <td className="px-4 py-4"><div className="text-sm text-gray-700">{customer.contact_number || '-'}</div><div className="text-xs text-gray-400">{customer.email_id || '-'}</div></td>
                    <td className="px-4 py-4"><div className="text-sm text-gray-700">{customer.tours?.[0]?.destination || 'No tour'}</div><div className="text-xs text-gray-400">{customer.tours?.[0]?.tour_type?.name || '-'}</div></td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${customer.follow_up_status === 'Lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {customer.follow_up_status === 'Lost' ? 'Inactive' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">{customer.tours?.[0]?.revenue != null ? `Rs ${Number(customer.tours[0].revenue).toLocaleString('en-IN')}` : '-'}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3 text-sm">
                        <button onClick={() => { setSaveError(''); setModalCustomer(customer) }} className="text-gray-600 hover:text-[#567C8D]">Edit</button>
                        <button onClick={() => handleDelete(customer)} className="text-gray-600 hover:text-red-600">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
            <p className="text-sm text-gray-500">Showing {customers.length} of {meta.total} customers</p>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setPage((current) => Math.max(current - 1, 1))} disabled={page <= 1 || loading}>Previous</Button>
              <span className="text-sm text-gray-600">Page {meta.page} of {meta.totalPages || 1}</span>
              <Button variant="outline" onClick={() => setPage((current) => Math.min(current + 1, meta.totalPages || 1))} disabled={page >= (meta.totalPages || 1) || loading}>Next</Button>
            </div>
          </div>
        </div>
      </div>

      <CustomerModal
        open={modalCustomer !== undefined}
        customer={modalCustomer || null}
        profiles={profiles}
        states={states}
        countries={countries}
        tourTypes={tourTypes}
        saving={saving}
        error={saveError}
        onClose={() => setModalCustomer(undefined)}
        onSave={syncCustomer}
      />
    </div>
  )
}
