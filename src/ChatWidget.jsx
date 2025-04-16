// ChatWidget.jsx
import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, ChevronDown } from 'lucide-react';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hi there! I'm your carbon footprint assistant. Ask me anything about reducing your carbon emissions, sustainability, or climate change!",
      sender: 'bot'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // OpenRouter API key
  const OPENROUTER_API_KEY = "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";

  // Auto-scroll to bottom of messages when new ones arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Function to call OpenRouter API
  const callOpenRouterAPI = async (messageHistory) => {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.origin, // Required by OpenRouter
          'X-Title': 'Carbon Footprint Assistant' // Optional - name of your app
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3-haiku', // You can change this to any model supported by OpenRouter
          messages: messageHistory.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          })),
          max_tokens: 1000,
          temperature: 0.7,
          system: "You are a helpful AI assistant specialized in environmental sustainability and carbon footprint reduction. Provide concise, accurate information about climate change, sustainability practices, and ways to reduce carbon emissions. Your responses should be informative, practical, and optimistic about climate action."
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      return "Sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Show typing indicator
    setIsTyping(true);
    
    // Create message history for context
    const messageHistory = [
      ...messages,
      userMessage
    ];
    
    // Call OpenRouter API
    const botResponse = await callOpenRouterAPI(messageHistory);
    
    // Hide typing indicator and add bot response
    setIsTyping(false);
    const botMessage = {
      id: messages.length + 2,
      text: botResponse,
      sender: 'bot'
    };
    
    setMessages(prev => [...prev, botMessage]);
  };

  // Click outside to close
  const chatRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && chatRef.current && !chatRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" ref={chatRef}>
      {/* Chat modal */}
      {isOpen && (
        <div className="mb-4 w-full max-w-sm bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 ease-in-out translate-y-0 opacity-100 scale-100">
          {/* Chat header */}
          <div className="bg-green-600 text-white p-4 flex justify-between items-center">
            <h3 className="font-medium text-lg">Carbon Footprint Assistant</h3>
            <button 
              onClick={toggleChat}
              className="p-1 rounded-full hover:bg-green-700 transition"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Chat messages */}
          <div className="p-4 h-72 overflow-y-auto bg-gray-50">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`mb-3 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div 
                  className={`inline-block px-4 py-2 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-green-500 text-white rounded-br-none' 
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="text-left mb-3">
                <div className="inline-block px-4 py-2 rounded-lg bg-gray-200 text-gray-800 rounded-bl-none">
                  <span className="flex space-x-1">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce delay-100">.</span>
                    <span className="animate-bounce delay-200">.</span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat input */}
          <form onSubmit={handleSubmit} className="border-t p-4">
            <div className="flex items-center">
              <input
                type="text"
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Ask about carbon footprint..."
                className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="bg-green-600 text-white p-2 rounded-r-lg hover:bg-green-700 transition"
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Floating action button */}
      <button
        onClick={toggleChat}
        className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 ease-in-out ${
          isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <ChevronDown size={24} className="text-white" /> : <MessageSquare size={24} className="text-white" />}
      </button>
    </div>
  );
};

export default ChatWidget;