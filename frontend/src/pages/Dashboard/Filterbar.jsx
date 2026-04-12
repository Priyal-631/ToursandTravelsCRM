import { useEffect, useRef, useState } from 'react'
import { getCountries, getStates } from '@/api/lookups'

const IconCalendar = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const IconChevron = ({ up }) => (
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <polyline points={up ? '18 15 12 9 6 15' : '6 9 12 15 18 9'} />
  </svg>
)

const IconCheck = () => (
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

function Dropdown({ label, options, value, onChange, loading = false }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => {
          if (!loading) setOpen((current) => !current)
        }}
        disabled={loading}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 12px',
          background: loading ? '#f0f0f0' : '#F5EFEB',
          border: '1.5px solid',
          borderColor: open ? '#2F4156' : '#ddd4cc',
          borderRadius: 8,
          fontSize: 13,
          color: loading ? '#999' : '#000',
          cursor: loading ? 'not-allowed' : 'pointer',
          whiteSpace: 'nowrap',
          minWidth: 130,
          justifyContent: 'space-between',
          boxShadow: open ? '0 0 0 3px #2F415620' : 'none',
          transition: 'all 0.15s',
          fontFamily: 'inherit'
        }}
      >
        <span>{loading ? 'Loading...' : value || label}</span>
        {!loading && <IconChevron up={open} />}
      </button>

      {open && !loading && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            minWidth: '100%',
            maxHeight: 220,
            overflowY: 'auto',
            background: '#fff',
            border: '1.5px solid #e2e8f0',
            borderRadius: 10,
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            zIndex: 100,
            animation: 'dropIn 0.15s ease'
          }}
        >
          {options.map((option) => {
            const isSelected = value === option || (!value && option === options[0])
            return (
              <div
                key={option}
                onClick={() => {
                  onChange(option === options[0] ? '' : option)
                  setOpen(false)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 14px',
                  fontSize: 13,
                  cursor: 'pointer',
                  color: '#374151',
                  transition: 'background 0.1s'
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.background = '#f8fafc'
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.background = 'transparent'
                }}
              >
                <span style={{ width: 16, color: '#2F4156' }}>{isSelected && <IconCheck />}</span>
                {option}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function FilterBar({ onApply }) {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [type, setType] = useState('')
  const [destination, setDestination] = useState('')
  const [country, setCountry] = useState('')
  const [state, setState] = useState('')
  const [stateOptions, setStateOptions] = useState(['All States'])
  const [countryOptions, setCountryOptions] = useState(['All Countries'])
  const [loadingStates, setLoadingStates] = useState(true)
  const [loadingCountries, setLoadingCountries] = useState(true)

  useEffect(() => {
    const loadStates = async () => {
      try {
        const data = await getStates()
        setStateOptions(['All States', ...data.map((item) => item.name)])
      } catch (error) {
        console.error('States fetch failed:', error.message)
      } finally {
        setLoadingStates(false)
      }
    }

    loadStates()
  }, [])

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const data = await getCountries()
        setCountryOptions(['All Countries', ...data.map((item) => item.name)])
      } catch (error) {
        console.error('Countries fetch failed:', error.message)
      } finally {
        setLoadingCountries(false)
      }
    }

    loadCountries()
  }, [])

  const months = ['All Months', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const years = ['All Years', '2024', '2025', '2026']
  const types = ['All Types', 'National', 'International']

  const handleTypeChange = (value) => {
    setType(value)
    setDestination('')
    setCountry('')
    setState('')
  }

  const handleReset = () => {
    setFrom('')
    setTo('')
    setMonth('')
    setYear('')
    setType('')
    setDestination('')
    setCountry('')
    setState('')
    onApply?.({
      from: '',
      to: '',
      month: '',
      year: '',
      type: '',
      state: '',
      destination: '',
      country: ''
    })
  }

  const datePickerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    padding: '8px 12px',
    background: '#F5EFEB',
    border: '1.5px solid #ddd4cc',
    borderRadius: 8,
    color: '#000'
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.6; cursor: pointer; }
      `}</style>

      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: '20px 22px',
          border: '1.5px solid #f1f5f9',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
        }}
      >
        <div style={{ marginBottom: 14, fontSize: 15, fontWeight: 600, color: '#1e293b' }}>Filters</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
          <div style={datePickerStyle}>
            <span><IconCalendar /></span>
            <input
              type="date"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                fontSize: 13,
                background: 'transparent',
                cursor: 'pointer',
                fontFamily: 'inherit',
                colorScheme: 'light'
              }}
            />
          </div>

          <div style={datePickerStyle}>
            <span><IconCalendar /></span>
            <input
              type="date"
              value={to}
              onChange={(event) => setTo(event.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                fontSize: 13,
                background: 'transparent',
                cursor: 'pointer',
                fontFamily: 'inherit',
                colorScheme: 'light'
              }}
            />
          </div>

          <Dropdown label="All Months" options={months} value={month} onChange={setMonth} />
          <Dropdown label="All Years" options={years} value={year} onChange={setYear} />
          <Dropdown label="All Types" options={types} value={type} onChange={handleTypeChange} />

          {type === 'National' && (
            <Dropdown label="All States" options={stateOptions} value={state} onChange={setState} loading={loadingStates} />
          )}

          {type === 'International' && (
            <Dropdown
              label="All Countries"
              options={countryOptions}
              value={country}
              onChange={setCountry}
              loading={loadingCountries}
            />
          )}

          {!type && (
            <Dropdown
              label="All Destinations"
              options={stateOptions}
              value={destination}
              onChange={setDestination}
              loading={loadingStates}
            />
          )}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => onApply?.({ from, to, month, year, type, state, destination, country })}
            style={{
              padding: '8px 20px',
              background: '#2F4156',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 13.5,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
          >
            Apply
          </button>
          <button
            onClick={handleReset}
            style={{
              padding: '8px 20px',
              background: '#F5EFEB',
              color: '#000',
              border: '1.5px solid #ddd4cc',
              borderRadius: 8,
              fontSize: 13.5,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
