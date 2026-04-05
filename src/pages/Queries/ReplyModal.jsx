import { useState } from 'react';

/**
 * Props:
 *   query      — the query object
 *   onClose    — close without sending
 *   onReplied  — called when Send is hit WITH "Mark as Replied" checked;
 *                marks the query replied and closes the modal
 */
export default function ReplyModal({ query, onClose, onReplied }) {
  const [reply, setReply]      = useState('');
  const [markReplied, setMark] = useState(false);

  const handleSend = () => {
    if (!reply.trim()) return;
    console.log('Reply sent:', {
      to: query.customer,
      subject: query.subject,
      message: reply,
      markReplied,
    });
    if (markReplied && onReplied) {
      onReplied(); // marks query replied + closes modal
    } else {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.35)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#F5EFEB] rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8dfd8]">
          <h2 className="text-base font-semibold text-[#2F4156]">Reply to {query.customer}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">

          {/* Original message */}
          <div className="bg-white rounded-xl px-4 py-3 border border-[#e8dfd8]">
            <p className="text-sm font-semibold text-[#2F4156] mb-1">{query.subject}</p>
            <p className="text-sm text-gray-500 leading-relaxed">{query.message}</p>
          </div>

          {/* Textarea */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#2F4156]">Your Reply</label>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your reply here…"
              rows={5}
              className="w-full border border-[#e8dfd8] rounded-xl px-4 py-3 text-sm text-gray-700 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[#567C8D]/30 focus:border-[#567C8D] transition-colors"
            />
          </div>

          {/* Mark as replied toggle */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <button
              type="button"
              onClick={() => setMark(!markReplied)}
              className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                markReplied ? 'bg-[#567C8D] border-[#567C8D]' : 'border-gray-300 bg-white hover:border-[#567C8D]'
              }`}
            >
              {markReplied && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <span className="text-sm text-gray-700">Mark as Replied</span>
          </label>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg border border-transparent hover:border-[#e8dfd8] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSend}
              disabled={!reply.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-[#567C8D] hover:bg-[#2F4156] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}