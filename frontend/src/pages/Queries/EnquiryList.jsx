import { useState, useRef, useEffect } from 'react';
import { format, isValid } from 'date-fns';
import { updateQuery } from '../../api/queries';

// Priority Badge Component
const PriorityBadge = ({ queryId, currentPriority, onRefresh }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleUpdate = async (newPriority) => {
    setIsUpdating(true);
    setIsOpen(false);
    try {
      await updateQuery(queryId, { priority: newPriority });
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Failed to update priority');
    } finally {
      setIsUpdating(false);
    }
  };

  const getPriorityColor = (priority) => {
    if (priority === 'High') return 'bg-red-500 text-white';
    if (priority === 'Medium') return 'bg-orange-400 text-white';
    return 'bg-green-500 text-white';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => !isUpdating && setIsOpen(!isOpen)}
        disabled={isUpdating}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
          isUpdating ? 'opacity-50' : ''
        } ${getPriorityColor(currentPriority)}`}
      >
        {isUpdating ? '...' : currentPriority}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-[9999]">
          {['High', 'Medium', 'Low'].map((p) => (
            <button
              key={p}
              onClick={() => handleUpdate(p)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                currentPriority === p ? 'font-bold bg-blue-50' : ''
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ queryId, currentStatus, onRefresh }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleUpdate = async (newStatus) => {
    setIsUpdating(true);
    setIsOpen(false);
    try {
      await updateQuery(queryId, { status: newStatus });
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'Open') return 'bg-red-100 text-red-700';
    if (status === 'In Progress') return 'bg-orange-100 text-orange-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => !isUpdating && setIsOpen(!isOpen)}
        disabled={isUpdating}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
          isUpdating ? 'opacity-50' : ''
        } ${getStatusColor(currentStatus)}`}
      >
        {isUpdating ? '...' : currentStatus}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-[9999]">
          {['Open', 'In Progress', 'Closed'].map((s) => (
            <button
              key={s}
              onClick={() => handleUpdate(s)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                currentStatus === s ? 'font-bold bg-blue-50' : ''
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Assignee Dropdown Component
const AssigneeDropdown = ({ queryId, currentAssignee, profiles, onRefresh }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleUpdate = async (profileId) => {
    setIsUpdating(true);
    setIsOpen(false);
    try {
      await updateQuery(queryId, { assigned_to: profileId });
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Failed to update assignee');
    } finally {
      setIsUpdating(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => !isUpdating && setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 w-full bg-gray-50 border border-gray-200 rounded-lg hover:border-[#2F4156] transition-all text-sm"
      >
        <div className="w-6 h-6 rounded-full bg-[#2F4156] text-white flex items-center justify-center text-xs font-bold shrink-0">
          {getInitials(currentAssignee?.full_name)}
        </div>
        <span className="truncate flex-1 text-left text-gray-700">
          {isUpdating ? '...' : (currentAssignee?.full_name || 'Unassigned')}
        </span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M19 9l-7 7-7-7" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-[9999] max-h-64 overflow-y-auto">
          <button
            onClick={() => handleUpdate(null)}
            className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-50"
          >
            Unassigned
          </button>
          <div className="border-t border-gray-100 my-1"></div>
          {profiles.map((p) => (
            <button
              key={p.id}
              onClick={() => handleUpdate(p.id)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                currentAssignee?.id === p.id ? 'bg-blue-50 font-semibold' : ''
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-[#567C8D] text-white flex items-center justify-center text-xs font-bold">
                {getInitials(p.full_name)}
              </div>
              {p.full_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Main EnquiryList Component
const EnquiryList = ({ queries, profiles = [], loading, onReply, onRefresh }) => {
  const handleToggleReplied = async (queryId, isChecked) => {
    try {
      const repliedAtValue = isChecked ? new Date().toISOString() : null;
      await updateQuery(queryId, { replied_at: repliedAtValue });
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Failed to toggle replied status", error);
      alert("Error updating status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-500">Loading queries...</div>
      </div>
    );
  }

  const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    return isValid(d) ? format(d, 'MMM dd, yyyy') : '-';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Message</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">Priority</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Assigned</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">Reply</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">Replied</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {queries.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                  No queries found
                </td>
              </tr>
            ) : (
              queries.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                  {/* Customer */}
                  <td className="px-4 py-3">
                    <div className="font-medium text-sm text-gray-900">{q.customer?.full_name || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{q.customer?.email_id}</div>
                  </td>

                  {/* Subject */}
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-700 font-medium max-w-[200px] truncate">{q.subject}</div>
                  </td>

                  {/* Message */}
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-600 max-w-[250px] truncate italic">"{q.message}"</div>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(q.created_at)}
                  </td>

                  {/* Priority */}
                  <td className="px-4 py-3 text-center">
                    <PriorityBadge
                      queryId={q.id}
                      currentPriority={q.priority}
                      onRefresh={onRefresh}
                    />
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 text-center">
                    <StatusBadge
                      queryId={q.id}
                      currentStatus={q.status}
                      onRefresh={onRefresh}
                    />
                  </td>

                  {/* Assigned */}
                  <td className="px-4 py-3 min-w-[180px]">
                    <AssigneeDropdown
                      queryId={q.id}
                      currentAssignee={q.assigned_member}
                      profiles={profiles}
                      onRefresh={onRefresh}
                    />
                  </td>

                  {/* Reply Button */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => onReply(q)}
                      className="inline-flex items-center gap-1 text-[#2F4156] hover:text-[#567C8D] font-medium text-sm transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                      Reply
                    </button>
                  </td>

                  {/* Replied Checkbox */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <input
                        type="checkbox"
                        checked={!!q.replied_at}
                        onChange={(e) => handleToggleReplied(q.id, e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-[#2F4156] focus:ring-[#2F4156] cursor-pointer"
                      />
                      {q.replied_at && (
                        <span className="text-xs text-gray-400 font-medium">
                          {format(new Date(q.replied_at), 'MM/dd')}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnquiryList;