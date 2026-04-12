import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { getCustomers } from '@/api/customers'
import DashboardStats from './dashboardstats'
import FilterBar from './Filterbar'
import CustomerRow from './customer-row'

const MONTH_INDEX = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11
}

export default function Dashboard() {
  const [customers, setCustomers] = useState([])
  const [activeFilters, setActiveFilters] = useState({
    from: '',
    to: '',
    month: '',
    year: '',
    type: '',
    state: '',
    destination: '',
    country: ''
  })
  const [loading, setLoading] = useState(true)
  const { searchQuery = '' } = useOutletContext() || {}

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true)
        const data = await getCustomers()
        setCustomers(data || [])
      } catch (error) {
        console.error('Error fetching customers:', error.message)
      } finally {
        setLoading(false)
      }
    }

    loadCustomers()
  }, [])

  const filteredCustomers = useMemo(() => {
    let filtered = [...customers]
    const { from, to, month, year, type, state, destination, country } = activeFilters

    if (searchQuery.trim()) {
      const needle = searchQuery.toLowerCase()
      filtered = filtered.filter((customer) =>
        customer.full_name?.toLowerCase().includes(needle) ||
        customer.email_id?.toLowerCase().includes(needle) ||
        customer.contact_number?.includes(searchQuery) ||
        customer.tours?.[0]?.destination?.toLowerCase().includes(needle)
      )
    }

    if (from) {
      filtered = filtered.filter((customer) => {
        const tour = customer.tours?.[0]
        return tour?.start_date && new Date(tour.start_date) >= new Date(from)
      })
    }

    if (to) {
      filtered = filtered.filter((customer) => {
        const tour = customer.tours?.[0]
        return tour?.start_date && new Date(tour.start_date) <= new Date(to)
      })
    }

    if (month && MONTH_INDEX[month] !== undefined) {
      filtered = filtered.filter((customer) => {
        const tour = customer.tours?.[0]
        return tour?.start_date && new Date(tour.start_date).getMonth() === MONTH_INDEX[month]
      })
    }

    if (year) {
      filtered = filtered.filter((customer) => {
        const tour = customer.tours?.[0]
        return tour?.start_date && new Date(tour.start_date).getFullYear().toString() === year
      })
    }

    if (type) {
      filtered = filtered.filter((customer) => customer.tours?.[0]?.tour_type?.name === type)
    }

    if (state) {
      filtered = filtered.filter((customer) =>
        customer.tours?.[0]?.state?.name?.toLowerCase() === state.toLowerCase()
      )
    }

    if (country) {
      filtered = filtered.filter((customer) =>
        customer.tours?.[0]?.country?.name?.toLowerCase() === country.toLowerCase()
      )
    }

    if (destination) {
      filtered = filtered.filter((customer) =>
        customer.tours?.[0]?.destination?.toLowerCase().includes(destination.toLowerCase())
      )
    }

    return filtered
  }, [customers, activeFilters, searchQuery])

  const headingClass = 'px-2 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 truncate'

  return (
    <div className="flex h-full w-full min-w-0 flex-col overflow-hidden">
      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4 min-h-0 w-full min-w-0">
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">Customers</h1>
          <p className="mt-0.5 text-xs text-gray-500">Manage and view all customer information</p>
        </div>

        <DashboardStats customers={customers} />
        <FilterBar onApply={setActiveFilters} />

        <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white shadow">
          <table className="w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className={`${headingClass} w-[13%]`}>Customer</th>
                <th className={`${headingClass} w-[12%]`}>Contact</th>
                <th className={`${headingClass} w-[12%]`}>Destination</th>
                <th className={`${headingClass} w-[10%]`}>Package</th>
                <th className={`${headingClass} w-[12%]`}>Travel Dates</th>
                <th className={`${headingClass} w-[8%]`}>Group</th>
                <th className={`${headingClass} w-[8%]`}>Paid</th>
                <th className={`${headingClass} w-[8%]`}>Pending</th>
                <th className={`${headingClass} w-[9%]`}>Status</th>
                <th className={`${headingClass} w-[8%]`}>Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="10" className="px-6 py-8 text-center text-sm text-gray-400">
                    Loading customers...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-6 py-8 text-center text-sm text-gray-400">
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
  )
}
