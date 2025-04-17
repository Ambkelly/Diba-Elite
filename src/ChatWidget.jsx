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

  // List of models to try in order of preference
  const MODELS_TO_TRY = [
    'anthropic/claude-3-haiku',
    'openai/gpt-3.5-turbo',
    'google/gemini-pro',
    'anthropic/claude-2.0'
  ];

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

  // Function to call OpenRouter API with fallback models
  const callOpenRouterAPI = async (messageHistory) => {
    const formattedMessages = messageHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));
    
    console.log('Formatted messages for API:', formattedMessages);
    
    // Try each model in sequence until one works
    for (const model of MODELS_TO_TRY) {
      try {
        console.log(`Attempting to use model: ${model}`);
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': window.location.origin, // Required by OpenRouter
            'X-Title': 'Carbon Footprint Assistant' // Optional - name of your app
          },
          body: JSON.stringify({
            model: model,
            messages: formattedMessages,
            max_tokens: 1000,
            temperature: 0.7,
            system: "You are a helpful AI assistant specialized in environmental sustainability and carbon footprint reduction. Provide concise, accurate information about climate change, sustainability practices, and ways to reduce carbon emissions. Your responses should be informative, practical, and optimistic about climate action."
          })
        });

        const data = await response.json();
        
        if (!response.ok) {
          console.error(`OpenRouter API error with model ${model}:`, data);
          // Continue to next model if this one fails
          continue;
        }

        console.log(`Successful response from model ${model}:`, data);
        
        // Check if the expected data structure is present
        if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
          console.error('Unexpected API response format:', data);
          continue; // Try next model
        }

        console.log(`Successfully got response from model: ${model}`);
        return data.choices[0].message.content;
      } catch (error) {
        console.error(`Error with model ${model}:`, error);
        // Continue to next model on error
      }
    }
    
    // If we get here, all models failed
    console.error('All models failed to respond properly');
    return "Sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.";
  };

  // Fallback responses for when API is down
  const FALLBACK_RESPONSES = [
    "To reduce your carbon footprint, consider using public transportation, biking, or walking instead of driving alone.",
    "One simple way to reduce emissions is to eat more plant-based meals and less meat, especially beef.",
    "Reducing food waste can significantly lower your carbon footprint. Try meal planning and composting leftovers.",
    "Energy efficiency at home matters - switching to LED bulbs, improving insulation, and using smart thermostats can all help.",
    "Consider the carbon footprint of your purchases by buying less, choosing used items, and selecting products with minimal packaging."
  ];

  const getFallbackResponse = (userMessage) => {
    // Simple keyword matching to provide somewhat relevant responses
    const message = userMessage.toLowerCase();
    
    if (message.includes('transport') || message.includes('car') || message.includes('travel')) {
      return FALLBACK_RESPONSES[0];
    } else if (message.includes('food') || message.includes('eat') || message.includes('diet')) {
      return FALLBACK_RESPONSES[1];
    } else if (message.includes('waste') || message.includes('trash') || message.includes('garbage')) {
      return FALLBACK_RESPONSES[2];
    } else if (message.includes('energy') || message.includes('electricity') || message.includes('power')) {
      return FALLBACK_RESPONSES[3];
    } else {
      // Default or random response if no keywords match
      return FALLBACK_RESPONSES[4];
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
    
    try {
      // Create message history for context
      const messageHistory = [
        ...messages,
        userMessage
      ];
      
      // Try API call with retries on different models
      let botResponse;
      
      try {
        // Set a timeout of 10 seconds for the API call
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('API request timed out')), 10000)
        );
        
        // Race between API call and timeout
        botResponse = await Promise.race([
          callOpenRouterAPI(messageHistory),
          timeoutPromise
        ]);
      } catch (apiError) {
        console.error('API error or timeout:', apiError);
        // Use fallback if API completely fails or times out
        botResponse = getFallbackResponse(userMessage.text) + 
                     "\n\n(Note: I'm currently using offline mode due to connectivity issues.)";
      }
      
      // Add bot response
      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot'
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error in chat flow:', error);
      // Add an error message with a helpful fallback response
      const errorMessage = {
        id: messages.length + 2,
        text: getFallbackResponse(userMessage.text) + 
              "\n\n(I'm currently experiencing connection issues but I'm still here to help with basic information.)",
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      // Hide typing indicator
      setIsTyping(false);
    }
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