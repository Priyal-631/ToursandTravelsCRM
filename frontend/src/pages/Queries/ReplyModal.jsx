import { useState } from 'react';
import { X } from 'lucide-react';
import { sendReply } from '../../api/queries';

const ReplyModal = ({ query, onClose, onSuccess }) => {
  const [reply, setReply] = useState(query.reply || '');
  const [status, setStatus] = useState(query.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isViewMode = !!query.reply;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reply.trim()) {
      setError('Please enter a reply message');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Call the sendReply endpoint which handles Resend email
      await sendReply(query.id, reply, status);
      
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Error sending reply:', err);
      setError(err.message || 'Failed to send reply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {isViewMode ? 'View Reply' : 'Reply to Query'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          
          {/* Customer Info Card */}
          <div className="bg-gray-50 rounded-lg p-4 mb-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Customer</p>
                <p className="text-sm font-bold text-gray-900">{query.customer?.full_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email</p>
                <p className="text-sm text-gray-700">{query.customer?.email_id || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                <p className="text-sm text-gray-700">{query.customer?.contact_number || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Priority</p>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                  query.priority === 'High' ? 'bg-red-100 text-red-700' :
                  query.priority === 'Medium' ? 'bg-orange-100 text-orange-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {query.priority}
                </span>
              </div>
            </div>
          </div>

          {/* Query Details */}
          <div className="space-y-4 mb-5">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Subject</p>
              <p className="text-sm text-gray-900 font-medium">{query.subject}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Message</p>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-sm text-gray-800 leading-relaxed">{query.message}</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Reply Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Reply Textarea */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Reply {!isViewMode && <span className="text-red-500">*</span>}
              </label>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={6}
                disabled={isViewMode || loading}
                placeholder="Type your reply here. This will be sent via email to the customer..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F4156] focus:border-transparent resize-none text-sm disabled:bg-gray-50 disabled:text-gray-600"
                required
              />
            </div>

            {/* Status Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={isViewMode || loading}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F4156] focus:border-transparent text-sm disabled:bg-gray-50 disabled:text-gray-600"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* Replied At Info */}
            {query.replied_at && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  <span className="font-semibold">Replied on:</span>{' '}
                  {new Date(query.replied_at).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </p>
              </div>
            )}

          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isViewMode ? 'Close' : 'Cancel'}
          </button>
          
          {!isViewMode && (
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading || !reply.trim()}
              className="px-6 py-2.5 bg-[#2F4156] text-white rounded-lg text-sm font-semibold hover:bg-[#253548] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Reply
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default ReplyModal;