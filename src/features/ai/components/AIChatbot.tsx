import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  Mic,
  MicOff,
  Image as ImageIcon,
  Paperclip,
  Bot,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Zap,
  MapPin,
  Home,
  DollarSign,
  Calculator,
} from 'lucide-react';
import { AIMessage, MessageSender, ConversationIntent } from '@/types/ai';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface AIChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  customerId?: string;
  propertyId?: string;
  initialIntent?: ConversationIntent;
}

const AIChatbot: React.FC<AIChatbotProps> = ({
  isOpen,
  onClose,
  customerId,
  propertyId,
  initialIntent,
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize conversation
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeConversation();
    }
  }, [isOpen]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chatbot opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeConversation = async () => {
    const welcomeMessage: AIMessage = {
      id: Date.now().toString(),
      conversationId: 'temp',
      sender: 'assistant',
      content: getWelcomeMessage(),
      type: 'text',
      timestamp: new Date(),
    };

    setMessages([welcomeMessage]);
    setConversationId(`conv_${Date.now()}`);

    // Add quick reply suggestions
    setTimeout(() => {
      const suggestionsMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        conversationId: 'temp',
        sender: 'assistant',
        content: '',
        type: 'quick_reply',
        metadata: {
          actions: getQuickReplies(),
        },
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, suggestionsMessage]);
    }, 1000);
  };

  const getWelcomeMessage = () => {
    if (initialIntent === 'property_search') {
      return '👋 Xin chào! Tôi là AI Assistant của SaleBDS. Tôi sẽ giúp bạn tìm kiếm bất động sản phù hợp. Bạn đang tìm loại bất động sản nào?';
    }
    
    if (propertyId) {
      return '👋 Xin chào! Tôi thấy bạn đang quan tâm đến một bất động sản cụ thể. Bạn có câu hỏi gì về căn này không?';
    }

    return '👋 Xin chào! Tôi là AI Assistant của SaleBDS - chuyên gia tư vấn bất động sản 24/7. Tôi có thể giúp bạn:\n\n• Tìm kiếm bất động sản\n• Tư vấn đầu tư\n• Phân tích thị trường\n• Tính toán tài chính\n• Hỗ trợ pháp lý\n\nBạn cần hỗ trợ gì hôm nay?';
  };

  const getQuickReplies = () => {
    const baseActions = [
      {
        id: 'search_property',
        type: 'property_search' as const,
        label: '🏠 Tìm bất động sản',
        description: 'Tìm kiếm bất động sản phù hợp',
      },
      {
        id: 'market_analysis',
        type: 'market_analysis' as const,
        label: '📊 Phân tích thị trường',
        description: 'Xem báo cáo thị trường mới nhất',
      },
      {
        id: 'investment_advice',
        type: 'investment_advice' as const,
        label: '💰 Tư vấn đầu tư',
        description: 'Nhận tư vấn đầu tư BĐS',
      },
      {
        id: 'mortgage_info',
        type: 'mortgage_info' as const,
        label: '🏧 Tính toán vay',
        description: 'Tính toán khoản vay mua nhà',
      },
    ];

    if (propertyId) {
      return [
        {
          id: 'property_details',
          type: 'general_info' as const,
          label: '📋 Thông tin chi tiết',
          description: 'Xem thông tin đầy đủ',
        },
        {
          id: 'schedule_viewing',
          type: 'viewing_request' as const,
          label: '👁️ Đặt lịch xem',
          description: 'Đặt lịch xem bất động sản',
        },
        {
          id: 'price_negotiation',
          type: 'price_inquiry' as const,
          label: '💵 Thương lượng giá',
          description: 'Thảo luận về giá cả',
        },
        ...baseActions.slice(1),
      ];
    }

    return baseActions;
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      conversationId: conversationId!,
      sender: 'user',
      content: input.trim(),
      type: 'text',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(async () => {
      const response = await generateAIResponse(input.trim());
      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        conversationId: conversationId!,
        sender: 'assistant',
        content: response.content,
        type: 'text',
        metadata: response.metadata,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickReply = (action: any) => {
    const message = action.label.replace(/[^\w\s]/gi, ''); // Remove emojis
    setInput(message);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const generateAIResponse = async (message: string): Promise<{
    content: string;
    metadata?: any;
  }> => {
    // Simple AI response simulation - in real app would call AI service
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('tìm') || lowerMessage.includes('search')) {
      return {
        content: '🔍 Tuyệt vời! Để tìm được bất động sản phù hợp nhất, bạn có thể cho tôi biết:\n\n• Loại bất động sản mong muốn (căn hộ, nhà phố, biệt thự...)\n• Ngân sách dự kiến\n• Khu vực ưa thích\n• Số phòng ngủ cần thiết\n\nHãy chia sẻ thông tin để tôi hỗ trợ bạn tốt hơn nhé!',
        metadata: {
          confidence: 0.95,
          intent: 'property_search',
          actions: [
            {
              id: 'property_filter',
              type: 'send_property_list',
              label: 'Xem danh sách BĐS',
              confidence: 0.9,
            },
          ],
        },
      };
    }

    if (lowerMessage.includes('giá') || lowerMessage.includes('price')) {
      return {
        content: '💰 Về vấn đề giá cả, tôi có thể giúp bạn:\n\n• Phân tích giá thị trường hiện tại\n• So sánh giá với các BĐS tương tự\n• Tư vấn chiến lược thương lượng\n• Đánh giá tiềm năng tăng giá\n\nBạn muốn tìm hiểu về giá của khu vực nào?',
        metadata: {
          confidence: 0.92,
          intent: 'price_inquiry',
        },
      };
    }

    if (lowerMessage.includes('vay') || lowerMessage.includes('loan') || lowerMessage.includes('mortgage')) {
      return {
        content: '🏦 Tôi có thể hỗ trợ bạn tính toán khoản vay:\n\n• Ước tính số tiền vay tối đa\n• Tính lãi suất và kỳ hạn\n• So sánh các gói vay ngân hàng\n• Tư vấn hồ sơ vay vốn\n\nBạn có thể cho tôi biết thu nhập hàng tháng và tỷ lệ vay mong muốn không?',
        metadata: {
          confidence: 0.94,
          intent: 'mortgage_info',
          actions: [
            {
              id: 'mortgage_calculator',
              type: 'calculate_mortgage',
              label: 'Máy tính vay',
              confidence: 0.95,
            },
          ],
        },
      };
    }

    if (lowerMessage.includes('thị trường') || lowerMessage.includes('market')) {
      return {
        content: '📈 Thị trường BĐS hiện tại:\n\n• Giá có xu hướng tăng nhẹ 2-5%/năm\n• Thanh khoản tốt ở các khu vực trung tâm\n• Nhiều dự án mới được triển khai\n• Chính sách hỗ trợ vay mua nhà\n\nBạn quan tâm đến phân khúc nào cụ thể?',
        metadata: {
          confidence: 0.88,
          intent: 'market_analysis',
        },
      };
    }

    if (lowerMessage.includes('xem') || lowerMessage.includes('visit')) {
      return {
        content: '👁️ Để đặt lịch xem BĐS, tôi cần một số thông tin:\n\n• Thời gian phù hợp (buổi sáng/chiều)\n• Ngày dự kiến\n• Số điện thoại liên hệ\n• Ghi chú đặc biệt (nếu có)\n\nTôi sẽ sắp xếp lịch xem phù hợp cho bạn!',
        metadata: {
          confidence: 0.91,
          intent: 'viewing_request',
          actions: [
            {
              id: 'schedule_viewing',
              type: 'schedule_viewing',
              label: 'Đặt lịch ngay',
              confidence: 0.93,
            },
          ],
        },
      };
    }

    // Default response
    return {
      content: '🤔 Tôi hiểu bạn đang quan tâm đến vấn đề này. Để hỗ trợ bạn tốt nhất, bạn có thể:\n\n• Đặt câu hỏi cụ thể hơn\n• Sử dụng các gợi ý nhanh bên dưới\n• Liên hệ trực tiếp với chuyên viên tư vấn\n\nTôi luôn sẵn sàng hỗ trợ bạn!',
      metadata: {
        confidence: 0.7,
        intent: 'general_info',
      },
    };
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    // Implement voice recognition here
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    // Could show toast notification
  };

  const handleRegenerateResponse = () => {
    // Regenerate last AI response
    if (messages.length >= 2) {
      const lastUserMessage = [...messages].reverse().find(m => m.sender === 'user');
      if (lastUserMessage) {
        setInput(lastUserMessage.content);
        setTimeout(handleSendMessage, 100);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">AI Assistant</h3>
            <p className="text-xs opacity-90">Chuyên gia BĐS 24/7</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onCopy={handleCopyMessage}
              onQuickReply={handleQuickReply}
            />
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 text-gray-500"
          >
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Nhập câu hỏi của bạn..."
              className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={handleVoiceToggle}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${
                isListening ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 hover:text-gray-700">
              <Paperclip className="w-3 h-3" />
              <span>File</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-gray-700">
              <ImageIcon className="w-3 h-3" />
              <span>Hình</span>
            </button>
          </div>

          <button
            onClick={handleRegenerateResponse}
            className="flex items-center space-x-1 hover:text-gray-700"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Tạo lại</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Message Bubble Component
interface MessageBubbleProps {
  message: AIMessage;
  onCopy: (content: string) => void;
  onQuickReply: (action: any) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onCopy, onQuickReply }) => {
  const isUser = message.sender === 'user';

  if (message.type === 'quick_reply') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-2 justify-start"
      >
        {message.metadata?.actions?.map((action: any) => (
          <button
            key={action.id}
            onClick={() => onQuickReply(action)}
            className="px-3 py-2 bg-blue-50 text-blue-600 rounded-full text-sm hover:bg-blue-100 transition-colors"
          >
            {action.label}
          </button>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex items-start space-x-2 max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
        }`}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>

        {/* Message Content */}
        <div className={`rounded-2xl px-4 py-2 ${
          isUser 
            ? 'bg-blue-600 text-white rounded-br-md' 
            : 'bg-gray-100 text-gray-900 rounded-bl-md'
        }`}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          
          {/* Message Actions */}
          {!isUser && (
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onCopy(message.content)}
                  className="p-1 hover:bg-gray-200 rounded text-gray-500"
                  title="Copy"
                >
                  <Copy className="w-3 h-3" />
                </button>
                <button
                  className="p-1 hover:bg-gray-200 rounded text-gray-500"
                  title="Helpful"
                >
                  <ThumbsUp className="w-3 h-3" />
                </button>
                <button
                  className="p-1 hover:bg-gray-200 rounded text-gray-500"
                  title="Not helpful"
                >
                  <ThumbsDown className="w-3 h-3" />
                </button>
              </div>

              {message.metadata?.confidence && (
                <div className="text-xs text-gray-500">
                  {Math.round(message.metadata.confidence * 100)}%
                </div>
              )}
            </div>
          )}

          {/* Suggested Actions */}
          {message.metadata?.actions && (
            <div className="flex flex-wrap gap-1 mt-2">
              {message.metadata.actions.map((action: any) => (
                <button
                  key={action.id}
                  onClick={() => onQuickReply(action)}
                  className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700 transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AIChatbot;