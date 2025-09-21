import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Bot, Zap, X } from 'lucide-react';
import AIChatbot from './AIChatbot';

interface AIFloatingButtonProps {
  customerId?: string;
  propertyId?: string;
}

const AIFloatingButton: React.FC<AIFloatingButtonProps> = ({
  customerId,
  propertyId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(true);

  const handleOpenChatbot = () => {
    setIsOpen(true);
    setHasNewMessage(false);
  };

  const handleCloseChatbot = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 300, damping: 25 }}
      >
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenChatbot}
              className="relative w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
            >
              {/* Pulse Animation */}
              <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>
              
              {/* Main Icon */}
              <div className="relative z-10">
                <Bot className="w-7 h-7 transition-transform group-hover:scale-110" />
              </div>

              {/* New Message Indicator */}
              {hasNewMessage && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold"
                >
                  <Zap className="w-3 h-3" />
                </motion.div>
              )}

              {/* Tooltip */}
              <div className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                AI Assistant - Hỗ trợ 24/7
                <div className="absolute top-1/2 left-full transform -translate-y-1/2">
                  <div className="w-0 h-0 border-l-4 border-l-gray-900 border-y-4 border-y-transparent"></div>
                </div>
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Quick Action Hints */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 4 }}
              className="absolute bottom-20 right-0 bg-white rounded-lg shadow-lg border border-gray-200 p-3 w-64"
            >
              <div className="flex items-center space-x-2 mb-2">
                <Bot className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">
                  AI Assistant có thể giúp bạn:
                </span>
                <button
                  onClick={() => setHasNewMessage(false)}
                  className="ml-auto text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Tìm kiếm bất động sản phù hợp</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>Tư vấn đầu tư và tài chính</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span>Phân tích thị trường BĐS</span>
                </div>
              </div>

              <button
                onClick={handleOpenChatbot}
                className="w-full mt-3 bg-blue-600 text-white text-xs py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Bắt đầu trò chuyện
              </button>

              {/* Arrow pointing to button */}
              <div className="absolute -bottom-2 right-6">
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Chatbot */}
      <AnimatePresence>
        {isOpen && (
          <AIChatbot
            isOpen={isOpen}
            onClose={handleCloseChatbot}
            customerId={customerId}
            propertyId={propertyId}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AIFloatingButton;