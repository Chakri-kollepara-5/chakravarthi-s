import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your AI disaster assistant. I can help you with safety guidelines, emergency procedures, and disaster preparedness. How can I help you today?',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('earthquake')) {
      return 'During an earthquake:\n\n🔸 Drop, Cover, and Hold On\n🔸 Get under a sturdy desk or table\n🔸 Stay away from windows and heavy objects\n🔸 If outdoors, move away from buildings\n🔸 After shaking stops, check for injuries and hazards\n🔸 Be prepared for aftershocks';
    }
    
    if (message.includes('flood')) {
      return 'During flood conditions:\n\n🔸 Move to higher ground immediately\n🔸 Avoid walking through moving water\n🔸 Just 6 inches of moving water can knock you down\n🔸 Never drive through flooded roads\n🔸 Stay away from downed power lines\n🔸 Listen to emergency broadcasts for updates';
    }
    
    if (message.includes('cyclone') || message.includes('hurricane')) {
      return 'During cyclone/hurricane:\n\n🔸 Stay indoors and away from windows\n🔸 Go to the lowest floor, away from the wind\n🔸 Avoid using elevators\n🔸 Keep battery-powered radio for updates\n🔸 Store drinking water and non-perishable food\n🔸 Don\'t go outside during the eye of the storm';
    }
    
    if (message.includes('fire') || message.includes('wildfire')) {
      return 'During wildfire:\n\n🔸 Evacuate immediately if advised\n🔸 Close all windows, doors, and vents\n🔸 Remove flammable materials from around house\n🔸 Have emergency kit ready\n🔸 Stay low if caught in smoke\n🔸 Call emergency services: 112 or 101';
    }
    
    if (message.includes('emergency') || message.includes('kit')) {
      return 'Emergency Kit Essentials:\n\n🔸 Water (1 gallon per person per day for 3 days)\n🔸 Non-perishable food for 3 days\n🔸 Battery-powered or hand-crank radio\n🔸 Flashlight and extra batteries\n🔸 First aid kit\n🔸 Whistle for signaling\n🔸 Local maps and emergency contact info';
    }
    
    if (message.includes('sos') || message.includes('help')) {
      return 'In case of emergency:\n\n🔸 Press the red SOS button in the app\n🔸 Call emergency services: 112 (India) or your local number\n🔸 Stay calm and provide your location\n🔸 Follow instructions from emergency responders\n🔸 Use whistle or signal for help if trapped\n🔸 Stay in one place if lost or injured';
    }
    
    if (message.includes('preparation') || message.includes('prepare')) {
      return 'Disaster Preparedness:\n\n🔸 Create a family emergency plan\n🔸 Identify safe spots in each room\n🔸 Practice evacuation routes\n🔸 Keep important documents in waterproof container\n🔸 Maintain emergency supplies\n🔸 Stay informed about local hazards\n🔸 Sign up for emergency alerts';
    }
    
    // Default responses for common patterns
    if (message.includes('hello') || message.includes('hi')) {
      return 'Hello! I\'m here to help you with disaster safety information. You can ask me about earthquakes, floods, cyclones, emergency kits, or any other disaster-related questions.';
    }
    
    if (message.includes('thank')) {
      return 'You\'re welcome! Stay safe and don\'t hesitate to ask if you need more help. Remember, in case of immediate emergency, call 112 or use the SOS button in the app.';
    }
    
    return 'I can help you with disaster safety information including:\n\n🔸 Earthquake safety procedures\n🔸 Flood emergency response\n🔸 Cyclone/Hurricane preparation\n🔸 Wildfire evacuation\n🔸 Emergency kit preparation\n🔸 SOS procedures\n\nWhat specific disaster information do you need?';
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: getAIResponse(inputMessage),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    'What to do during earthquake?',
    'How to prepare for floods?',
    'Emergency kit essentials',
    'Cyclone safety tips',
    'Wildfire evacuation steps'
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-24">
      <div className="bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
          <div className="text-center">
            <MessageCircle className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">AI Disaster Assistant</h1>
            <p className="text-green-100 text-sm sm:text-lg">Get instant safety guidance and emergency procedures</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-full flex items-center justify-center mr-3">
                <Bot className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">DisasterBot</h3>
                <p className="text-xs sm:text-sm text-gray-600">AI Safety Assistant • Online</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-80 sm:h-96 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-2 sm:space-x-3 ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' ? 'bg-blue-600' : 'bg-green-600'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                  ) : (
                    <Bot className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                  )}
                </div>
                <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block p-2 sm:p-3 rounded-lg max-w-xs sm:max-w-sm lg:max-w-md ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="whitespace-pre-line text-xs sm:text-sm">{message.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <Bot className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="bg-gray-100 p-2 sm:p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50">
              <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => setInputMessage(question)}
                    className="px-2 sm:px-3 py-1 bg-white border border-gray-300 rounded-full text-xs sm:text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about earthquake safety, flood preparedness..."
                className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Emergency Contact Info */}
        <div className="mt-6 sm:mt-8 bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
          <h3 className="font-semibold text-red-900 mb-3">🚨 Emergency Contacts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
            <div>
              <p className="font-medium text-red-800">All Emergencies</p>
              <p className="text-red-700">112 (India)</p>
            </div>
            <div>
              <p className="font-medium text-red-800">Fire Department</p>
              <p className="text-red-700">101</p>
            </div>
            <div>
              <p className="font-medium text-red-800">Medical Emergency</p>
              <p className="text-red-700">108</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;