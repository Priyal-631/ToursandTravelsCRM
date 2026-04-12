import React, { useState } from 'react';
import { updateQuery } from '../../api/queries';

const ReplyModal = ({ query, onClose, onSuccess }) => {
  const [reply, setReply] = useState(query.reply || '');
  const [status, setStatus] = useState(query.status);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await updateQuery(query.id, {
        reply,
        status
      });
      onSuccess();
    } catch (error) {
      console.error('Error replying to query:', error);
      alert('Failed to send reply');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <h2 className="text-xl font-bold mb-4">
          {query.reply ? 'View Reply' : 'Reply to Query'}
        </h2>

        {/* Customer Info */}
        <div className="mb-4 p-4 bg-gray-50 rounded">
          <p className="font-semibold">{query.customer?.full_name}</p>
          <p className="text-sm text-gray-600">{query.customer?.email_id}</p>
          <p className="text-sm text-gray-600">{query.customer?.contact_number}</p>
        </div>

        {/* Query Details */}
        <div className="mb-4">
          <p className="font-semibold text-gray-700">Subject:</p>
          <p className="text-gray-900">{query.subject}</p>
        </div>

        <div className="mb-4">
          <p className="font-semibold text-gray-700">Message:</p>
          <p className="text-gray-900">{query.message}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Reply */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reply
            </label>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Type your reply here..."
              required
              disabled={!!query.reply} // Disable if already replied
            />
          </div>

          {/* Status */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              disabled={!!query.reply}
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {query.replied_at && (
            <div className="mb-4 text-sm text-gray-600">
              Replied on: {new Date(query.replied_at).toLocaleString()}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              {query.reply ? 'Close' : 'Cancel'}
            </button>
            {!query.reply && (
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reply'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReplyModal;