import { useState, useRef, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { getStoredEnquiries } from '../../api/enquiryStorage';

const MOCK_QUERIES = [
  {
    id: 1,
    customer: 'Divya Nair',
    subject: 'Travel Insurance',
    message: 'Do you offer travel insurance for solo travelers going to Europe?',
    date: 'Feb 13, 2026',
    priority: 'Medium',
    status: 'Contacted',
    assigned: 'Sunita',
    replied: false,
  },
  {
    id: 2,
    customer: 'Ananya Reddy',
    subject: 'Itinerary Change',
    message: 'Can we add Munnar to the itinerary for our Kerala trip?',
    date: 'Feb 12, 2026',
    priority: 'High',
    status: 'In Progress',
    assigned: 'Ravi',
    replied: false,
  },
  {
    id: 3,
    customer: 'Vikram Singh',
    subject: 'Activity Add-on',
    message: 'I want to add paragliding to the Manali package.',
    date: 'Feb 11, 2026',
    priority: 'Medium',
    status: 'Closed',
    assigned: 'Sunita',
    replied: true,
  },
  {
    id: 4,
    customer: 'Rahul Sharma',
    subject: 'Booking Confirmation',
    message: 'I have not received my booking confirmation email yet.',
    date: 'Feb 10, 2026',
    priority: 'High',
    status: 'Closed',
    assigned: 'Anil',
    replied: true,
  },
  {
    id: 5,
    customer: 'Priya Menon',
    subject: 'Honeymoon Package',
    message: 'Looking for a romantic honeymoon package to Maldives for two people.',
    date: 'Feb 09, 2026',
    priority: 'High',
    status: 'Contacted',
    assigned: 'Priya',
    replied: false,
  },
  {
    id: 6,
    customer: 'Arjun Mehta',
    subject: 'Group Discount',
    message: 'We are 15 people planning a Rajasthan trip. Any group discounts available?',
    date: 'Feb 08, 2026',
    priority: 'Low',
    status: 'In Progress',
    assigned: 'Amit',
    replied: false,
  },
  {
    id: 7,
    customer: 'Sneha Kulkarni',
    subject: 'Flight Inclusion',
    message: 'Can you include return flights in the Bali package price?',
    date: 'Feb 07, 2026',
    priority: 'Low',
    status: 'Contacted',
    assigned: 'Ravi',
    replied: false,
  },
  {
    id: 8,
    customer: 'Karan Patel',
    subject: 'Visa Assistance',
    message: 'Do you provide visa assistance for Thailand trips? What documents are needed?',
    date: 'Feb 06, 2026',
    priority: 'High',
    status: 'Closed',
    assigned: 'Anil',
    replied: true,
  },
  {
    id: 9,
    customer: 'Meera Iyer',
    subject: 'Hotel Upgrade',
    message: 'Is it possible to upgrade to a sea-facing room in the Goa package?',
    date: 'Feb 05, 2026',
    priority: 'Low',
    status: 'In Progress',
    assigned: 'Sunita',
    replied: false,
  },
  {
    id: 10,
    customer: 'Rohan Desai',
    subject: 'Cancellation Policy',
    message: 'What is the cancellation policy for the Kerala backwaters package?',
    date: 'Feb 04, 2026',
    priority: 'Medium',
    status: 'Contacted',
    assigned: 'Priya',
    replied: false,
  },
  {
    id: 11,
    customer: 'Nisha Tiwari',
    subject: 'Child Pricing',
    message: 'What is the pricing for a 6-year-old child on the Shimla family trip?',
    date: 'Feb 03, 2026',
    priority: 'Low',
    status: 'Closed',
    assigned: 'Amit',
    replied: true,
  },
  {
    id: 12,
    customer: 'Sameer Joshi',
    subject: 'Custom Itinerary',
    message: 'Can you build a custom 10-day itinerary for a Europe trip in summer?',
    date: 'Feb 02, 2026',
    priority: 'High',
    status: 'In Progress',
    assigned: 'Ravi',
    replied: false,
  },
  {
    id: 13,
    customer: 'Lakshmi Rao',
    subject: 'Senior Citizen Discount',
    message: 'Do you offer any discounts for senior citizens above 65 years of age?',
    date: 'Feb 01, 2026',
    priority: 'Medium',
    status: 'Closed',
    assigned: 'Sunita',
    replied: true,
  },
  {
    id: 14,
    customer: 'Aditya Kumar',
    subject: 'Adventure Package',
    message: 'Looking for a trekking and camping package in Himachal Pradesh for 5 days.',
    date: 'Jan 31, 2026',
    priority: 'High',
    status: 'Contacted',
    assigned: 'Anil',
    replied: false,
  },
  {
    id: 15,
    customer: 'Pooja Bhatt',
    subject: 'Payment Issue',
    message: 'My payment was deducted but booking is still showing as pending on the portal.',
    date: 'Jan 30, 2026',
    priority: 'High',
    status: 'In Progress',
    assigned: 'Priya',
    replied: true,
  },
  {
    id: 16,
    customer: 'Nikhil Verma',
    subject: 'Domestic Tour Query',
    message: 'What are the best domestic tour packages available for April and May 2026?',
    date: 'Jan 29, 2026',
    priority: 'Low',
    status: 'Contacted',
    assigned: 'Amit',
    replied: false,
  },
  {
    id: 17,
    customer: 'Fatima Sheikh',
    subject: 'Halal Food Options',
    message: 'Can you confirm if halal food options are available on the Turkey package?',
    date: 'Jan 28, 2026',
    priority: 'Medium',
    status: 'In Progress',
    assigned: 'Ravi',
    replied: false,
  },
  {
    id: 18,
    customer: 'Deepak Nair',
    subject: 'Refund Status',
    message: 'I cancelled my booking 10 days ago. When will I receive my refund?',
    date: 'Jan 27, 2026',
    priority: 'High',
    status: 'Closed',
    assigned: 'Anil',
    replied: true,
  },
];

const MEMBERS = ['Unassigned', 'Sunita', 'Ravi', 'Anil', 'Priya', 'Amit'];

const PRIORITY_COLORS = {
  High:   'bg-red-500 text-white',
  Medium: 'bg-orange-400 text-white',
  Low:    'bg-gray-400 text-white',
};

const STATUS_COLORS = {
  Contacted:     'text-red-500 border border-red-200 bg-red-50',
  'In Progress': 'text-orange-500 border border-orange-200 bg-orange-50',
  Closed:        'text-green-600 border border-green-200 bg-green-50',
};

function StatusDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const colorClass = STATUS_COLORS[value] || 'text-gray-500 border border-gray-200 bg-gray-50';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}
      >
        {value}
        <svg className="w-2.5 h-2.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg py-1 min-w-[140px]">
          {['Contacted', 'In Progress', 'Closed'].map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 flex items-center gap-2 ${opt === value ? 'bg-blue-50 font-semibold text-[#2F4156]' : 'text-gray-700'}`}
            >
              {opt === value && <span className="text-[#567C8D]">✓</span>}
              {opt !== value && <span className="w-4" />}
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AssignedDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-[#F5EFEB] text-[#2F4156] border border-[#ddd4cc] hover:border-[#567C8D]"
      >
        {value || 'Unassigned'}
        <svg className="w-2.5 h-2.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg py-1 min-w-[130px]">
          {MEMBERS.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 flex items-center gap-2 ${opt === value ? 'bg-blue-50 font-semibold text-[#2F4156]' : 'text-gray-700'}`}
            >
              {opt === value && <span className="text-[#567C8D]">✓</span>}
              {opt !== value && <span className="w-4" />}
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PriorityBadge({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${PRIORITY_COLORS[value]}`}
      >
        {value}
        <svg className="w-3 h-3 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg py-1 min-w-[120px]">
          {['High', 'Medium', 'Low'].map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 flex items-center gap-2 ${opt === value ? 'bg-blue-50 font-semibold text-[#2F4156]' : 'text-gray-700'}`}
            >
              {opt === value && <span className="text-[#567C8D]">✓</span>}
              {opt !== value && <span className="w-4" />}
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm text-gray-700 hover:border-gray-300 min-w-[130px] justify-between"
      >
        <span>{value || label}</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg py-1 min-w-[160px]">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 flex items-center gap-2 ${opt === value ? 'bg-blue-50 font-semibold text-[#2F4156]' : 'text-gray-700'}`}
            >
              {opt === value && <span className="text-[#567C8D]">✓</span>}
              {opt !== value && <span className="w-4" />}
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Message cell with a click-to-expand modal (no z-index tooltip clipping issues) ──
function MessageCell({ message }) {
  const [open, setOpen] = useState(false);
  const short = message.length > 30 ? message.slice(0, 30) + '…' : message;

  return (
    <>
      <div
        className="text-sm text-gray-500 cursor-pointer hover:text-[#567C8D] transition-colors"
        onClick={() => message.length > 30 && setOpen(true)}
        title={message.length > 30 ? 'Click to read full message' : ''}
      >
        {short}
      </div>

      {/* Full-message overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#2F4156]">Full Message</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-lg font-bold leading-none">✕</button>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{message}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default function EnquiryList({ onReply, searchQuery = '' }) {
  const [queries, setQueries] = useState(() => [
    ...getStoredEnquiries(),
    ...MOCK_QUERIES,
  ]);
  const [filterPriority, setFilterPriority] = useState('All Priority');
  const [filterStatus, setFilterStatus]     = useState('All Status');
  const [filterMember, setFilterMember]     = useState('All Members');

  const updateQuery = (id, field, val) => {
    setQueries(prev => prev.map(q => q.id === id ? { ...q, [field]: val } : q));
  };

  // Called from ReplyModal when "Mark as Replied" is checked and Send is hit
  const markReplied = (queryId) => {
    updateQuery(queryId, 'replied', true);
  };

  // Expose markReplied through onReply so parent (index.jsx) can pass it down to ReplyModal
  const handleReply = (q) => {
    if (q.replied) return; // already replied — block
    onReply(q, markReplied);
  };

  const filtered = queries.filter(q => {
    const search = searchQuery.trim().toLowerCase();

    if (search) {
      const haystack = [q.customer, q.subject, q.message, q.email, q.phone]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(search)) return false;
    }

    if (filterPriority !== 'All Priority' && q.priority !== filterPriority) return false;
    if (filterStatus !== 'All Status' && q.status !== filterStatus) return false;
    if (filterMember !== 'All Members' && q.assigned !== filterMember) return false;
    return true;
  });

  const th = "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";

  return (
    <div className="space-y-4">

      {/* Filter Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <FilterDropdown
          label="All Priority"
          options={['All Priority', 'High', 'Medium', 'Low']}
          value={filterPriority}
          onChange={setFilterPriority}
        />
        <FilterDropdown
          label="All Status"
          options={['All Status', 'Contacted', 'In Progress', 'Closed']}
          value={filterStatus}
          onChange={setFilterStatus}
        />
        <FilterDropdown
          label="All Members"
          options={['All Members', 'Sunita', 'Ravi', 'Anil', 'Priya', 'Amit']}
          value={filterMember}
          onChange={setFilterMember}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className={th}>Customer</th>
              <th className={th}>Subject</th>
              <th className={th}>Message</th>
              <th className={th}>Date</th>
              <th className={th}>Priority</th>
              <th className={th}>Status</th>
              <th className={th}>Assigned</th>
              <th className={th}>Reply</th>
              <th className={th}>Replied</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((q) => (
              <tr key={q.id} className="hover:bg-gray-50/50 transition-colors">

                {/* Customer */}
                <td className="px-4 py-4">
                  <span className="font-semibold text-[#2F4156] text-sm">{q.customer}</span>
                </td>

                {/* Subject */}
                <td className="px-4 py-4 text-sm text-gray-700">{q.subject}</td>

                {/* Message — click-to-expand modal (no tooltip z-index issues) */}
                <td className="px-4 py-4 max-w-[200px]">
                  <MessageCell message={q.message} />
                </td>

                {/* Date */}
                <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">{q.date}</td>

                {/* Priority */}
                <td className="px-4 py-4">
                  <PriorityBadge
                    value={q.priority}
                    onChange={(val) => updateQuery(q.id, 'priority', val)}
                  />
                </td>

                {/* Status */}
                <td className="px-4 py-4">
                  <StatusDropdown
                    value={q.status}
                    onChange={(val) => updateQuery(q.id, 'status', val)}
                  />
                </td>

                {/* Assigned */}
                <td className="px-4 py-4">
                  <AssignedDropdown
                    value={q.assigned}
                    onChange={(val) => updateQuery(q.id, 'assigned', val)}
                  />
                </td>

                {/* Reply button — disabled when already replied */}
                <td className="px-4 py-4">
                  {q.replied ? (
                    <span className="flex items-center gap-1.5 text-sm text-gray-300 cursor-not-allowed select-none">
                      <MessageSquare className="w-4 h-4" />
                      <span>Reply</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleReply(q)}
                      className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#567C8D] transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Reply</span>
                    </button>
                  )}
                </td>

                {/* Replied indicator */}
                <td className="px-4 py-4 text-center">
                  {q.replied ? (
                    <span className="w-5 h-5 rounded-full bg-[#567C8D] flex items-center justify-center mx-auto">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full border-2 border-gray-300 flex mx-auto" />
                  )}
                </td>

              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center text-gray-400 text-sm">
                  No queries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}