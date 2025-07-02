import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Minimize2 } from 'lucide-react';
import { sendMessage } from '../lib/ai';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  config: any;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onClose, config }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello! I'm ${config.name}, your AI assistant for ${config.brandName}. How can I help you today?`,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendMessage(inputValue, messages, config);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ 
          scale: 1, 
          opacity: 1, 
          y: 0,
          height: isMinimized ? 'auto' : '600px'
        }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        style={{
          position: 'fixed',
          bottom: '90px',
          right: '24px',
          zIndex: 2147483647,
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #e5e7eb',
          maxHeight: '90vh',
          pointerEvents: 'auto',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
          borderBottom: '1px solid #f3f4f6',
          background: 'linear-gradient(to right, #f8fafc, #f1f5f9)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="Testing widget" alt="Testing widget" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
            <div>
              <h3 style={{ fontWeight: '600', color: '#111827', margin: 0, fontSize: '14px' }}>${config.name}</h3>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>AI Assistant</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={() => setIsMinimized(!isMinimized)}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#9ca3af', 
                cursor: 'pointer', 
                padding: '4px',
                borderRadius: '4px'
              }}
            >
              <Minimize2 style={{ width: '16px', height: '16px' }} />
            </button>
            <button 
              onClick={onClose} 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#9ca3af', 
                cursor: 'pointer', 
                padding: '4px',
                borderRadius: '4px'
              }}
            >
              <X style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              backgroundColor: '#f9fafb',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex',
                    justifyContent: message.isUser ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    maxWidth: '75%',
                    flexDirection: message.isUser ? 'row-reverse' : 'row'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      backgroundColor: message.isUser ? '#3b82f6' : '#d1d5db'
                    }}>
                      {message.isUser ? (
                        <User style={{ width: '16px', height: '16px', color: 'white' }} />
                      ) : (
                        <Bot style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                      )}
                    </div>
                    <div
                      style={{
                        padding: '12px 16px',
                        borderRadius: '16px',
                        backgroundColor: message.isUser ? '#3b82f6' : 'white',
                        color: message.isUser ? 'white' : '#111827',
                        fontSize: '14px',
                        lineHeight: '1.4',
                        boxShadow: message.isUser ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                        border: message.isUser ? 'none' : '1px solid #e5e7eb',
                        borderBottomLeftRadius: message.isUser ? '16px' : '4px',
                        borderBottomRightRadius: message.isUser ? '4px' : '16px'
                      }}
                    >
                      {message.text}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', justifyContent: 'flex-start' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', maxWidth: '75%' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: '#d1d5db',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Bot style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                    </div>
                    <div style={{
                      backgroundColor: 'white',
                      padding: '12px 16px',
                      borderRadius: '16px',
                      borderBottomLeftRadius: '4px',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <div style={{ width: '8px', height: '8px', backgroundColor: '#9ca3af', borderRadius: '50%', animation: 'bounce 1.4s infinite' }}></div>
                        <div style={{ width: '8px', height: '8px', backgroundColor: '#9ca3af', borderRadius: '50%', animation: 'bounce 1.4s infinite 0.2s' }}></div>
                        <div style={{ width: '8px', height: '8px', backgroundColor: '#9ca3af', borderRadius: '50%', animation: 'bounce 1.4s infinite 0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{
              padding: '16px',
              borderTop: '1px solid #f3f4f6',
              backgroundColor: 'white'
            }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    border: '1px solid #d1d5db',
                    borderRadius: '24px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white'
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: inputValue.trim() && !isLoading ? 'pointer' : 'not-allowed',
                    opacity: inputValue.trim() && !isLoading ? 1 : 0.5
                  }}
                >
                  <Send style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};