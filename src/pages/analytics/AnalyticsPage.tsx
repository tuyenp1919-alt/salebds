import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AnalyticsDashboard from '@/features/analytics/components/AnalyticsDashboard';
import { LoadingSpinner } from '@/components/common';

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [loading, setLoading] = useState(false);

  const handleTimeRangeChange = (range: 'week' | 'month' | 'quarter' | 'year') => {
    setTimeRange(range);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <AnalyticsDashboard
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
        />
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;