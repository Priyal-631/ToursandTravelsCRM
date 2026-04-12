import { useState, useRef, useEffect } from 'react';

const FilterDropdown = ({ label, options, value, onChange, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const displayValue = value || label;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-[#2F4156] transition-all text-sm font-medium text-gray-700"
      >
        {Icon && <Icon className="w-4 h-4 text-gray-400" />}
        <span>{displayValue}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-[9999] max-h-64 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option === label ? '' : option);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                value === option || (!value && option === label) ? 'bg-blue-50 font-semibold text-[#2F4156]' : 'text-gray-700'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const QueriesFilterBar = ({ onFilterChange, profiles = [] }) => {
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  const handleApply = () => {
    onFilterChange({ priority, status, assigned_to: assignedTo });
  };

  const handleReset = () => {
    setPriority('');
    setStatus('');
    setAssignedTo('');
    onFilterChange({ priority: '', status: '', assigned_to: '' });
  };

  const priorityOptions = ['All Priority', 'High', 'Medium', 'Low'];
  const statusOptions = ['All Status', 'Open', 'In Progress', 'Closed'];
  const memberOptions = ['All Members', ...profiles.map(p => p.full_name)];

  // Map member name back to ID for API call
  const getMemberId = (name) => {
    if (!name || name === 'All Members') return '';
    const member = profiles.find(p => p.full_name === name);
    return member?.id || '';
  };

  useEffect(() => {
    handleApply();
  }, [priority, status, assignedTo]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-4">
      <div className="flex items-center gap-3 flex-wrap">
        <FilterDropdown
          label="All Priority"
          options={priorityOptions}
          value={priority}
          onChange={setPriority}
        />

        <FilterDropdown
          label="All Status"
          options={statusOptions}
          value={status}
          onChange={setStatus}
        />

        <FilterDropdown
          label="All Members"
          options={memberOptions}
          value={assignedTo}
          onChange={setAssignedTo}
        />

        {(priority || status || assignedTo) && (
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default QueriesFilterBar;