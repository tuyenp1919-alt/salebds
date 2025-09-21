import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceInputProps {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  maxDuration?: number; // in seconds
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onResult,
  onError,
  language = 'vi-VN',
  continuous = false,
  interimResults = true,
  className = '',
  placeholder = 'Nhấn để nói...',
  disabled = false,
  maxDuration = 60
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Check for speech recognition support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      // Configure recognition
      recognitionRef.current.continuous = continuous;
      recognitionRef.current.interimResults = interimResults;
      recognitionRef.current.lang = language;
      recognitionRef.current.maxAlternatives = 1;
      
      // Event handlers
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError(null);
        setTranscript('');
        setConfidence(0);
        setTimeLeft(maxDuration);
        
        // Start countdown
        intervalRef.current = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              stopListening();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      };
      
      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
            setConfidence(result[0].confidence);
          } else {
            interimTranscript += result[0].transcript;
          }
        }
        
        const currentTranscript = finalTranscript || interimTranscript;
        setTranscript(currentTranscript);
        onResult(currentTranscript, !!finalTranscript);
      };
      
      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        const errorMessage = getErrorMessage(event.error);
        setError(errorMessage);
        onError?.(errorMessage);
        setIsListening(false);
        clearTimers();
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
        clearTimers();
      };
      
      // Auto-stop after max duration
      timeoutRef.current = setTimeout(() => {
        if (recognitionRef.current && isListening) {
          recognitionRef.current.stop();
        }
      }, maxDuration * 1000);
    } else {
      setIsSupported(false);
    }
    
    return () => {
      clearTimers();
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
  }, [continuous, interimResults, language, maxDuration, isListening, onError, onResult]);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported || disabled || isListening) return;
    
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setError('Không thể bắt đầu ghi âm');
    }
  }, [isSupported, disabled, isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const getErrorMessage = (error: string): string => {
    switch (error) {
      case 'no-speech':
        return 'Không nghe thấy giọng nói. Vui lòng thử lại.';
      case 'audio-capture':
        return 'Không thể truy cập microphone.';
      case 'not-allowed':
        return 'Quyền truy cập microphone bị từ chối.';
      case 'network':
        return 'Lỗi kết nối mạng.';
      case 'service-not-allowed':
        return 'Dịch vụ nhận dạng giọng nói không khả dụng.';
      default:
        return 'Lỗi không xác định. Vui lòng thử lại.';
    }
  };

  if (!isSupported) {
    return (
      <div className={`p-4 bg-gray-100 rounded-lg text-center ${className}`}>
        <p className="text-gray-600 text-sm">
          Trình duyệt không hỗ trợ nhận dạng giọng nói
        </p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Voice Input Button */}
      <motion.button
        type="button"
        onClick={toggleListening}
        disabled={disabled}
        className={`
          relative w-full min-h-[3rem] px-4 py-2 
          border-2 rounded-lg font-medium transition-all duration-200
          flex items-center justify-center gap-3
          ${isListening 
            ? 'border-red-500 bg-red-50 text-red-700 hover:bg-red-100' 
            : 'border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        whileTap={{ scale: 0.98 }}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
      >
        {/* Microphone Icon */}
        <motion.div
          animate={isListening ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{ repeat: isListening ? Infinity : 0, duration: 1 }}
        >
          {isListening ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm0 6a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          )}
        </motion.div>

        {/* Button Text */}
        <span className="font-medium">
          {isListening ? `Đang nghe... (${timeLeft}s)` : placeholder}
        </span>

        {/* Audio Wave Animation */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-3 flex gap-1"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-current rounded-full"
                  animate={{
                    height: [8, 16, 8],
                    opacity: [0.4, 1, 0.4]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.8,
                    delay: i * 0.1
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Transcript Display */}
      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 p-3 bg-gray-50 border rounded-lg"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-gray-700">Đã nghe:</span>
              {confidence > 0 && (
                <span className="text-xs text-gray-500">
                  Độ tin cậy: {Math.round(confidence * 100)}%
                </span>
              )}
            </div>
            <p className="text-gray-800 leading-relaxed">{transcript}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Usage Tips */}
      {!isListening && !transcript && (
        <div className="mt-3 text-xs text-gray-500 space-y-1">
          <p>💡 Mẹo sử dụng:</p>
          <ul className="ml-4 space-y-0.5">
            <li>• Nói rõ ràng và chậm</li>
            <li>• Tránh tiếng ồn xung quanh</li>
            <li>• Có thể nói tiếng Việt hoặc tiếng Anh</li>
          </ul>
        </div>
      )}
    </div>
  );
};

// Hook for easy voice input integration
export const useVoiceInput = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleResult = useCallback((newTranscript: string, isFinal: boolean) => {
    setTranscript(newTranscript);
    
    if (isFinal) {
      setIsListening(false);
    }
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setIsListening(false);
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    error,
    handleResult,
    handleError,
    clearTranscript,
    setIsListening
  };
};

export default VoiceInput;