import React, { useState, useRef, useEffect } from 'react';
import { format, isValid } from 'date-fns';
import { updateQuery } from '../../api/queries';

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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => !isUpdating && setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1.5 w-full bg-white border border-gray-200 rounded hover:border-[#567C8D] transition-all text-xs"
      >
        <div className="w-5 h-5 rounded-full bg-[#567C8D] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
          {currentAssignee ? currentAssignee.full_name.charAt(0) : '?'}
        </div>
        <span className="truncate flex-1 text-gray-700 text-left">
          {isUpdating ? '...' : (currentAssignee?.full_name || 'Unassigned')}
        </span>
        <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke="currentColor" strokeWidth="2" /></svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-[9999]">
          <div className="px-4 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Team Members</div>
          <button onClick={() => handleUpdate(null)} className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50 border-b border-gray-50">Unassign Member</button>
          <div className="max-h-60 overflow-y-auto">
            {profiles.map((p) => (
              <button
                key={p.id}
                onClick={() => handleUpdate(p.id)}
                className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 ${currentAssignee?.id === p.id ? 'text-[#567C8D] font-bold bg-blue-50' : ''}`}
              >
                {p.full_name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

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

  if (loading) return <div className="p-10 text-center text-gray-500">Loading queries...</div>;

  const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    return isValid(d) ? format(d, 'MMM dd, yyyy') : '-';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-visible">
      <div className="overflow-x-auto overflow-y-visible">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              <th className="px-4 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Subject</th>
              <th className="px-4 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Message</th>
              <th className="px-4 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Priority</th>
              <th className="px-4 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
              <th className="px-4 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Assigned</th>
              <th className="px-4 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Replied</th>
              <th className="px-4 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {queries.map((q) => (
              <tr key={q.id} className="hover:bg-gray-50/50 transition-colors">
                {/* Customer */}
                <td className="px-4 py-4">
                  <div className="font-bold text-xs text-gray-900">{q.customer?.full_name || 'N/A'}</div>
                  <div className="text-[10px] text-gray-400">{q.customer?.email_id}</div>
                </td>

                {/* Subject */}
                <td className="px-4 py-4">
                  <div className="text-xs font-semibold text-gray-700 truncate w-32">{q.subject}</div>
                </td>

                {/* Message */}
                <td className="px-4 py-4">
                  <div className="text-xs text-gray-500 truncate w-48 italic">"{q.message}"</div>
                </td>

                {/* Date */}
                <td className="px-4 py-4 whitespace-nowrap text-[11px] text-gray-500 tabular-nums">
                  {formatDate(q.created_at)}
                </td>

                {/* Priority */}
                <td className="px-4 py-4 text-center">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
                    q.priority === 'High' ? 'bg-red-50 text-red-600 border-red-100' : 
                    q.priority === 'Medium' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                    'bg-green-50 text-green-600 border-green-100'
                  }`}>
                    {q.priority}
                  </span>
                </td>

                {/* Status */}
                <td className="px-4 py-4 text-center">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    q.status === 'Open' ? 'bg-blue-50 text-blue-600' : 
                    q.status === 'In Progress' ? 'bg-purple-50 text-purple-600' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {q.status}
                  </span>
                </td>

                {/* Assigned Dropdown */}
                <td className="px-4 py-4 min-w-[180px]">
                  <AssigneeDropdown 
                    queryId={q.id}
                    currentAssignee={q.assigned_member}
                    profiles={profiles}
                    onRefresh={onRefresh}
                  />
                </td>

                {/* Manual Replied Checkbox */}
                <td className="px-4 py-4 text-center">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <input 
                      type="checkbox" 
                      checked={!!q.replied_at} 
                      onChange={(e) => handleToggleReplied(q.id, e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-[#567C8D] focus:ring-[#567C8D] cursor-pointer"
                    />
                    {q.replied_at && (
                      <span className="text-[9px] text-gray-400 font-medium">
                        {format(new Date(q.replied_at), 'MM/dd')}
                      </span>
                    )}
                  </div>
                </td>

                {/* Action Button */}
                <td className="px-4 py-4 text-center">
                  <button
                    onClick={() => onReply(q)}
                    className="text-[#567C8D] font-bold text-xs hover:underline decoration-2 underline-offset-4"
                  >
                    {q.replied_at ? 'View' : 'Reply'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnquiryList;