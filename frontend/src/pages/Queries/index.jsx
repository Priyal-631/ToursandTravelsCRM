import { useState, useEffect } from 'react';
import { getQueries, getProfiles } from '../../api/queries';
import EnquiryList from './EnquiryList';
import QueriesFilterBar from './QueriesFilterBar';
import ReplyModal from './ReplyModal';

const QueriesPage = () => {
  const [queries, setQueries] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [filters, setFilters] = useState({
    priority: '',
    status: '',
    assigned_to: ''
  });

  // Initial load
  useEffect(() => {
    Promise.all([
      fetchQueries(),
      fetchProfiles()
    ]);
  }, []);

  const fetchQueries = async (filterParams = {}) => {
    try {
      setLoading(true);
      const data = await getQueries(filterParams);
      setQueries(data);
    } catch (error) {
      console.error('Error fetching queries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfiles = async () => {
    try {
      const data = await getProfiles();
      setProfiles(data);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchQueries(newFilters);
  };

  const handleOpenReply = (query) => {
    setSelectedQuery(query);
    setShowReplyModal(true);
  };

  const handleReplySuccess = () => {
    setShowReplyModal(false);
    fetchQueries(filters); // Refresh with current filters
  };

  return (
    <div className="flex flex-col h-full overflow-hidden w-full min-w-0">
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0 w-full min-w-0">
        
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">Query Management</h1>
          <p className="text-gray-500 text-xs mt-0.5">Manage and respond to customer queries</p>
        </div>

        {/* Filter Bar */}
        <QueriesFilterBar
          onFilterChange={handleFilterChange}
          profiles={profiles}
        />

        {/* Queries Table */}
        <EnquiryList
          queries={queries}
          profiles={profiles}
          loading={loading}
          onReply={handleOpenReply}
          onRefresh={() => fetchQueries(filters)}
        />

      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedQuery && (
        <ReplyModal
          query={selectedQuery}
          onClose={() => setShowReplyModal(false)}
          onSuccess={handleReplySuccess}
        />
      )}
    </div>
  );
};

export default QueriesPage;