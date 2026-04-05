const MOCK_TIMELINE = [
  { id: 1, message: 'Query received via website form.', time: 'Feb 13, 2026 · 10:22 AM' },
  { id: 2, message: 'Assigned to Sunita for follow-up.', time: 'Feb 13, 2026 · 11:05 AM' },
  { id: 3, message: 'Sunita called and left voicemail.', time: 'Feb 13, 2026 · 02:30 PM' },
  { id: 4, message: 'Customer confirmed interest via WhatsApp.', time: 'Feb 14, 2026 · 09:15 AM' },
];

export default function LeadDetail({ query, onReply, onClose }) {
  if (!query) return null;

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="flex-1 bg-black/30" onClick={onClose} />
      <div className="w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#F5EFEB]">
          <div>
            <h2 className="text-lg font-bold text-[#2F4156]">{query.customer}</h2>
            <p className="text-xs text-gray-500">{query.subject}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
        </div>

        <div className="px-6 py-4 space-y-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Enquiry Details</h3>
          {[
            ['Priority', query.priority], ['Status', query.status],
            ['Assigned To', query.assigned || 'Unassigned'], ['Date', query.date],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-gray-500">{label}</span>
              <span className="font-medium text-[#2F4156]">{val}</span>
            </div>
          ))}
          <div className="pt-2">
            <p className="text-xs text-gray-500 mb-1">Message</p>
            <p className="text-sm text-gray-700 bg-[#F5EFEB] rounded-lg p-3">{query.message}</p>
          </div>
        </div>

        <div className="px-6 py-4 flex-1">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Follow-up Timeline</h3>
          <div className="relative space-y-4">
            {MOCK_TIMELINE.map((item, idx) => (
              <div key={item.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#567C8D] mt-1 flex-shrink-0" />
                  {idx < MOCK_TIMELINE.length - 1 && <div className="w-px flex-1 bg-gray-200 mt-1" />}
                </div>
                <div className="pb-4">
                  <p className="text-sm text-gray-700">{item.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100">
          <button
            onClick={() => onReply(query)}
            className="w-full py-2.5 bg-[#2F4156] text-white rounded-lg text-sm font-medium hover:bg-[#3a5068] transition-colors"
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}