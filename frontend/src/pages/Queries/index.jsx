import React, { useState, useEffect } from 'react';
import { getQueries } from '../../api/queries'; // Ensure this matches your API file export
import EnquiryList from './EnquiryList';
import ReplyModal from './ReplyModal';

const QueriesPage = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);

  // Initial load
  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      // FIXED: Changed getAllQueries to getQueries
      const data = await getQueries(); 
      setQueries(data);
    } catch (error) {
      console.error('Error fetching queries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReply = (query) => {
    setSelectedQuery(query);
    setShowReplyModal(true);
  };

  const handleReplySuccess = (updatedQuery) => {
    setShowReplyModal(false);
    // Optimistically update the single query in the list instead of a full refresh
    setQueries(prev => prev.map(q => q.id === updatedQuery.id ? updatedQuery : q));
  };

  return (
    <div className="p-6 bg-[#FDFCFB] min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2F4156]">Query Management</h1>
        <p className="text-gray-500 text-sm">Manage and respond to customer queries</p>
      </div>

      {/* Note: EnquiryList handles its own Search/Filters internally 
          based on the code you provided earlier.
      */}
      <EnquiryList
        queries={queries}
        loading={loading}
        onReply={handleOpenReply}
        onRefresh={fetchQueries}
      />

      {/* Reply Modal */}
      {showReplyModal && selectedQuery && (
        <ReplyModal
          query={selectedQuery}
          onClose={() => setShowReplyModal(false)}
          onReplied={handleReplySuccess}
        />
      )}
    </div>
  );
};

export default QueriesPage;