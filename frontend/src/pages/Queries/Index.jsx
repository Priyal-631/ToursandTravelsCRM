import { useEffect, useMemo, useRef, useState } from 'react';
import { MessageSquare, Plus } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { getCustomers } from '@/api/customers';
import { createQuery, deleteQuery, getQueries, updateQuery } from '@/api/queries';
import { getProfiles } from '@/api/lookups';
import { useAuth } from '@/hooks/useAuth';

const PRIORITY_COLORS = { High: 'bg-red-500 text-white', Medium: 'bg-orange-400 text-white', Low: 'bg-gray-400 text-white' };
const STATUS_COLORS = { Open: 'text-blue-600 border border-blue-200 bg-blue-50', Contacted: 'text-red-500 border border-red-200 bg-red-50', 'In Progress': 'text-orange-500 border border-orange-200 bg-orange-50', Closed: 'text-green-600 border border-green-200 bg-green-50' };

function useClickAway(ref, onClose) {
  useEffect(() => {
    const handler = (event) => { if (ref.current && !ref.current.contains(event.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, onClose]);
}

// FIXED: Complete rewrite of Dropdown component
function Dropdown({ value, options, onChange, className }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickAway(ref, () => setOpen(false));
  
  return (
    <div className="relative" ref={ref}>
      <button 
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(!open);
        }} 
        className={className}
      >
        {value}
        <svg className="w-3 h-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 min-w-[140px] rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
          {options.map((option) => (
            <button 
              key={option}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange(option);
                setOpen(false);
              }} 
              className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-blue-50 ${option === value ? 'bg-blue-50 font-semibold text-[#2F4156]' : 'text-gray-700'}`}
            >
              {option === value ? <span className="text-[#567C8D]">✓</span> : <span className="w-4" />}
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// FIXED: MessageCell now properly handles state changes
function MessageCell({ message }) {
  const [expanded, setExpanded] = useState(false);
  const needsExpand = message && message.length > 60;
  const displayText = expanded ? message : (needsExpand ? message.slice(0, 60) + '...' : message);

  return (
    <div className="text-sm text-gray-600">
      <p className="whitespace-normal break-words">{displayText}</p>
      {needsExpand && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="text-xs text-blue-500 hover:text-blue-700 mt-1 font-medium"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
}

function ReplyModal({ query, saving, error, onClose, onSend }) {
  const [reply, setReply] = useState('');
  const [markReplied, setMarkReplied] = useState(true);
  useEffect(() => { if (query) { setReply(query.reply || ''); setMarkReplied(Boolean(query.replied) || true); } }, [query]);
  if (!query) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-[#F5EFEB] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#e8dfd8] px-6 py-4"><h2 className="text-base font-semibold text-[#2F4156]">Reply to {query.customer}</h2><button onClick={onClose} className="text-gray-400 hover:text-gray-600">×</button></div>
        <div className="space-y-4 px-6 py-5">
          {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
          <div className="rounded-xl border border-[#e8dfd8] bg-white px-4 py-3"><p className="text-sm font-semibold text-[#2F4156] mb-1">{query.subject}</p><p className="text-sm text-gray-500">{query.message}</p></div>
          <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={5} className="w-full rounded-xl border border-[#e8dfd8] bg-white px-4 py-3 text-sm text-gray-700 resize-none" placeholder="Type your reply here..." />
          <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={markReplied} onChange={(e) => setMarkReplied(e.target.checked)} className="accent-[#567C8D]" />Mark as Replied</label>
          <div className="flex justify-end gap-2"><button onClick={onClose} className="px-4 py-2 text-sm text-gray-600">Cancel</button><button onClick={() => onSend(reply, markReplied)} disabled={!reply.trim() || saving} className="rounded-xl bg-[#567C8D] px-5 py-2 text-sm font-medium text-white hover:bg-[#2F4156] disabled:opacity-40">Send Reply</button></div>
        </div>
      </div>
    </div>
  );
}

export default function QueriesPage() {
  const { searchQuery = '' } = useOutletContext() || {};
  const { isAdmin } = useAuth();
  const [queries, setQueries] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replyError, setReplyError] = useState('');
  const [saving, setSaving] = useState(false);
  const [replyTarget, setReplyTarget] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [filterPriority, setFilterPriority] = useState('All Priority');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [filterMember, setFilterMember] = useState('All Members');

  const normalize = (query) => ({ ...query, customer: query.customer?.full_name || 'Unknown customer', assigned: query.assignedTo?.full_name || 'Unassigned', date: query.created_at ? new Date(query.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '-' });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [queryData, customerData, profileData] = await Promise.all([getQueries(), getCustomers(), getProfiles()]);
        setQueries((queryData || []).map(normalize));
        setCustomers(customerData || []);
        setProfiles(profileData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => queries.filter((query) => {
    const search = searchQuery.trim().toLowerCase();
    if (search) {
      const haystack = [query.customer, query.subject, query.message].filter(Boolean).join(' ').toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    if (filterPriority !== 'All Priority' && query.priority !== filterPriority) return false;
    if (filterStatus !== 'All Status' && query.status !== filterStatus) return false;
    if (filterMember !== 'All Members' && query.assigned !== filterMember) return false;
    return true;
  }), [queries, searchQuery, filterPriority, filterStatus, filterMember]);

  const updateLocal = async (id, payload) => {
    const updated = await updateQuery(id, payload);
    setQueries((prev) => prev.map((query) => query.id === id ? normalize(updated) : query));
  };

  const assigneeId = (label) => label === 'Unassigned' ? null : profiles.find((profile) => (profile.full_name || profile.email) === label)?.id || null;

  const handleReply = async (reply, replied) => {
    try {
      setSaving(true);
      setReplyError('');
      await updateLocal(replyTarget.id, { reply, replied, status: replied ? 'Closed' : replyTarget.status });
      setReplyTarget(null);
    } catch (err) {
      setReplyError(err.message);
    } finally {
      setSaving(false);
    }
  };


  const th = 'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider';

  return (
    <div className="flex flex-col h-full overflow-hidden w-full min-w-0">
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0 w-full min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div><h1 className="text-xl font-bold text-gray-900 leading-tight">Query Management</h1><p className="text-gray-500 text-xs mt-0.5">Manage and respond to customer queries</p></div>
        </div>
        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        <div className="flex items-center gap-3 flex-wrap">
          <Dropdown value={filterPriority} options={['All Priority', 'High', 'Medium', 'Low']} onChange={setFilterPriority} className="flex min-w-[130px] items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 cursor-pointer hover:border-gray-300" />
          <Dropdown value={filterStatus} options={['All Status', 'Open', 'Contacted', 'In Progress', 'Closed']} onChange={setFilterStatus} className="flex min-w-[130px] items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 cursor-pointer hover:border-gray-300" />
          <Dropdown value={filterMember} options={['All Members', ...profiles.map((profile) => profile.full_name || profile.email)]} onChange={setFilterMember} className="flex min-w-[130px] items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 cursor-pointer hover:border-gray-300" />
          
          {/* ✅ NEW: Clear Filters Button */}
          {(filterPriority !== 'All Priority' || filterStatus !== 'All Status' || filterMember !== 'All Members') && (
            <button 
              onClick={() => {
                setFilterPriority('All Priority');
                setFilterStatus('All Status');
                setFilterMember('All Members');
              }} 
              className="text-sm font-medium text-gray-400 hover:text-red-500 transition-colors px-2 underline underline-offset-2"
            >
              Clear Filters
            </button>
          )}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-gray-100"><th className={th}>Customer</th><th className={th}>Subject</th><th className={th}>Message</th><th className={th}>Date</th><th className={th}>Priority</th><th className={th}>Status</th><th className={th}>Assigned</th><th className={th}>Reply</th><th className={th}>Replied</th>{isAdmin && <th className={th}>Delete</th>}</tr></thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? <tr><td colSpan={isAdmin ? 10 : 9} className="px-6 py-8 text-center text-gray-400 text-sm">Loading queries...</td></tr> : filtered.length === 0 ? <tr><td colSpan={isAdmin ? 10 : 9} className="px-6 py-8 text-center text-gray-400 text-sm">No queries found</td></tr> : filtered.map((query) => (
                <tr key={query.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-4"><span className="font-semibold text-[#2F4156] text-sm">{query.customer}</span></td>
                  <td className="px-4 py-4 text-sm text-gray-700">{query.subject}</td>
                  <td className="px-4 py-4 max-w-[250px]"><MessageCell message={query.message} /></td>
                  <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">{query.date}</td>
                  <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}><Dropdown value={query.priority} options={['High', 'Medium', 'Low']} onChange={(value) => updateLocal(query.id, { priority: value })} className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold cursor-pointer ${PRIORITY_COLORS[query.priority] || PRIORITY_COLORS.Medium}`} /></td>
                  <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}><Dropdown value={query.status} options={['Open', 'Contacted', 'In Progress', 'Closed']} onChange={(value) => updateLocal(query.id, { status: value })} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold cursor-pointer ${STATUS_COLORS[query.status] || 'text-gray-500 border border-gray-200 bg-gray-50'}`} /></td>
                  <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}><Dropdown value={query.assigned} options={['Unassigned', ...profiles.map((profile) => profile.full_name || profile.email)]} onChange={(label) => updateLocal(query.id, { assigned_to: assigneeId(label) })} className="flex items-center gap-1 rounded-full border border-[#ddd4cc] bg-[#F5EFEB] px-3 py-1 text-xs font-medium text-[#2F4156] cursor-pointer" /></td>
                  <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>{query.replied ? <span className="flex items-center gap-1.5 text-sm text-gray-300 cursor-not-allowed select-none"><MessageSquare className="w-4 h-4" /><span>Reply</span></span> : <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setReplyError(''); setReplyTarget(query); }} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#567C8D] transition-colors"><MessageSquare className="w-4 h-4" /><span>Reply</span></button>}</td>
                  <td className="px-4 py-4 text-center">{query.replied ? <span className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-[#567C8D] text-white text-xs">✓</span> : <span className="mx-auto flex h-5 w-5 rounded-full border-2 border-gray-300" />}</td>
                  {isAdmin && <td className="px-4 py-4"><button type="button" onClick={async () => { if (!window.confirm('Delete this query?')) return; try { await deleteQuery(query.id); setQueries((prev) => prev.filter((item) => item.id !== query.id)); } catch (err) { setError(err.message); } }} className="text-sm text-gray-600 hover:text-red-600">Delete</button></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ReplyModal query={replyTarget} saving={saving} error={replyError} onClose={() => setReplyTarget(null)} onSend={handleReply} />
    </div>
  );
}