import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import EnquiryList from './EnquiryList';
import ReplyModal from './ReplyModal';

export default function QueriesPage() {
  const [replyTarget, setReplyTarget]   = useState(null);
  const [markRepliedFn, setMarkReplied] = useState(null);
  const { searchQuery = '' } = useOutletContext() || {};

  // EnquiryList passes both the query AND a callback to mark it replied
  const handleOpenReply = (query, markFn) => {
    setReplyTarget(query);
    // Store the function using the functional form so React doesn't call it immediately
    setMarkReplied(() => markFn);
  };

  const handleClose = () => {
    setReplyTarget(null);
    setMarkReplied(null);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden w-full min-w-0">
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0 w-full min-w-0">
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">Query Management</h1>
          <p className="text-gray-500 text-xs mt-0.5">Manage and respond to customer queries</p>
        </div>
        <EnquiryList searchQuery={searchQuery} onReply={handleOpenReply} />
      </div>

      {replyTarget && (
        <ReplyModal
          query={replyTarget}
          onClose={handleClose}
          onReplied={() => {
            // Mark the query as replied in EnquiryList's state
            if (markRepliedFn) markRepliedFn(replyTarget.id);
            handleClose();
          }}
        />
      )}
    </div>
  );
}