import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Map, Info, CheckCircle, Leaf, Droplet, Zap, Trash2, Star, Save } from 'lucide-react';

function Nav() {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <div className="bg-green-100 p-2 rounded-full">
          <Leaf className="text-green-700 h-6 w-6" />
        </div>
        <span className="text-xl font-bold text-green-800">
         Ozone Guard
        </span>
      </div>
      <ul className="flex space-x-6 text-sm font-medium text-gray-700">
        <li>
          <Link
            to="/home"
            className="hover:text-green-600 transition-colors duration-200"
          >
            Carbon Tracker
          </Link>
        </li>
        <li>
          <Link
            to="/CarbonSustainabilityApp"
            className="hover:text-green-600 transition-colors duration-200"
          >
            Seasonal Reminders
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default function CarbonSustainabilityApp() {
  // State management
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [location, setLocation] = useState(null);
  const [tips, setTips] = useState([]);
  const [savedTips, setSavedTips] = useState([]);
  const [activeTab, setActiveTab] = useState('tips');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [activeSection, setActiveSection] = useState('sustainability');
  const [activeVideo, setActiveVideo] = useState(null);

  // Video data for the education section
  const videos = [
    {
      id: "bYb7YLsXvzg",
      title: "What Is A Carbon Footprint?",
      description: "Learn about carbon footprints and how your daily activities impact the environment."
    },
    {
      id: "Mvp97__BP84", 
      title: "How to Reduce Your Carbon Footprint",
      description: "Practical ways to reduce your personal carbon footprint and live more sustainably."
    },
    {
      id: "Flo-4KaY9XY",
      title: "Understanding Carbon Offsetting",
      description: "An explanation of carbon offsetting and how it can help mitigate climate change."
    },
    {
      id: "a9yO-K8mwL0",
      title: "The Carbon Footprint of Foods",
      description: "Discover the environmental impact of different foods and how to make sustainable choices."
    },
    {
      id: "eJHEMFd61bs",
      title: "Global Carbon Cycle",
      description: "An overview of the global carbon cycle and its role in climate systems."
    }
  ];

  // Simulate fetching location data
  useEffect(() => {
    // Mock geolocation data
    setTimeout(() => {
      setLocation({
        lat: 37.7749,
        lng: -122.4194
      });
    }, 1000);
  }, []);

  // Update tips based on month
  useEffect(() => {
    fetchSeasonalTips();
  }, [currentMonth]);

  const fetchSeasonalTips = () => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    
    const currentMonthName = monthNames[currentMonth];
    let simulatedTips = [];

    if (currentMonth >= 2 && currentMonth <= 4) {
      simulatedTips = [
        {
          id: 1,
          title: "Spring Gardening",
          description: "Plant native species to support local ecosystems and reduce water usage.",
          category: "Gardening",
          priority: "High",
          icon: "Leaf"
        },
        {
          id: 2,
          title: "Energy Savings",
          description: "Open windows for natural ventilation instead of using AC as temperatures rise.",
          category: "Energy",
          priority: "Medium",
          icon: "Zap"
        },
        {
          id: 3,
          title: "Spring Cleaning",
          description: "Use eco-friendly cleaning products to protect waterways and indoor air quality.",
          category: "Home",
          priority: "Medium",
          icon: "Droplet"
        }
      ];
    } else if (currentMonth >= 5 && currentMonth <= 7) {
      simulatedTips = [
        {
          id: 1,
          title: "Water Conservation",
          description: "Water your garden early morning or late evening to reduce evaporation.",
          category: "Water",
          priority: "High",
          icon: "Droplet"
        },
        {
          id: 2,
          title: "Cooling Efficiency",
          description: "Set your thermostat to 78°F (26°C) when home and higher when away.",
          category: "Energy",
          priority: "High",
          icon: "Zap"
        },
        {
          id: 3,
          title: "Summer Garden Care",
          description: "Use mulch around plants to retain moisture and reduce water needs.",
          category: "Gardening",
          priority: "Medium",
          icon: "Leaf"
        }
      ];
    } else if (currentMonth >= 8 && currentMonth <= 10) {
      simulatedTips = [
        {
          id: 1,
          title: "Leaf Management",
          description: "Compost fallen leaves instead of burning or bagging them.",
          category: "Waste",
          priority: "Medium",
          icon: "Trash2"
        },
        {
          id: 2,
          title: "Home Insulation",
          description: "Check your home's insulation before winter to reduce heating needs.",
          category: "Energy",
          priority: "High",
          icon: "Zap"
        },
        {
          id: 3,
          title: "Fall Garden Prep",
          description: "Plant cover crops to improve soil health and prevent erosion.",
          category: "Gardening",
          priority: "Medium",
          icon: "Leaf"
        }
      ];
    } else {
      simulatedTips = [
        {
          id: 1,
          title: "Efficient Heating",
          description: "Lower your thermostat by a few degrees and wear warmer clothes indoors.",
          category: "Energy",
          priority: "High",
          icon: "Zap"
        },
        {
          id: 2,
          title: "Holiday Sustainability",
          description: "Use LED lights for decorations and consider eco-friendly gifts.",
          category: "Shopping",
          priority: "Medium",
          icon: "Star"
        },
        {
          id: 3,
          title: "Winter Water Savings",
          description: "Insulate water pipes to prevent heat loss and reduce energy use.",
          category: "Water",
          priority: "Medium",
          icon: "Droplet"
        }
      ];
    }

    setTips(simulatedTips);
  };

  const handleMonthChange = (e) => {
    setCurrentMonth(parseInt(e.target.value));
  };

  const saveTip = (tip) => {
    if (!savedTips.some(savedTip => savedTip.id === tip.id)) {
      setSavedTips([...savedTips, tip]);
      setToastMessage('Tip added to your plan!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const removeTip = (tipId) => {
    setSavedTips(savedTips.filter(tip => tip.id !== tipId));
    setToastMessage('Tip removed from your plan');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleVideoSelect = (index) => {
    setActiveVideo(index);
  };

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'Leaf': return <Leaf className="h-6 w-6 text-green-600" />;
      case 'Droplet': return <Droplet className="h-6 w-6 text-blue-600" />;
      case 'Zap': return <Zap className="h-6 w-6 text-yellow-600" />;
      case 'Trash2': return <Trash2 className="h-6 w-6 text-gray-600" />;
      case 'Star': return <Star className="h-6 w-6 text-purple-600" />;
      default: return <Info className="h-6 w-6 text-gray-600" />;
    }
  };

  return (
    <div className="bg-gradient-to-b from-green-50 to-blue-50 min-h-screen">
      {/* Navigation */}
      <Nav />
      
      {/* Toast notification */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            <p>{toastMessage}</p>
          </div>
        </div>
      )}

      <header className="mb-8 pt-8 text-center">
        <h1 className="text-3xl font-bold text-green-800 mb-2">Ozone Guard</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Your personal guide to sustainable living and reducing your carbon footprint.
        </p>
        
        {/* Main navigation */}
        <div className="flex justify-center mt-6 space-x-4">
          <button 
            className={`px-4 py-2 rounded-full ${activeSection === 'sustainability' ? 'bg-green-600 text-white' : 'bg-white text-green-600 hover:bg-green-50'}`}
            onClick={() => setActiveSection('sustainability')}
          >
            Seasonal Tips
          </button>
          <button 
            className={`px-4 py-2 rounded-full ${activeSection === 'education' ? 'bg-green-600 text-white' : 'bg-white text-green-600 hover:bg-green-50'}`}
            onClick={() => setActiveSection('education')}
          >
            Carbon Education
          </button>
        </div>
      </header>

      {/* Sustainability Section */}
      {activeSection === 'sustainability' && (
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <div className="card bg-white shadow-md rounded-lg p-6 mb-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Calendar className="h-5 w-5 text-green-700" />
                    <h2 className="text-xl font-semibold text-green-700">Month</h2>
                  </div>
                  <select
                    value={currentMonth}
                    onChange={handleMonthChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i}>
                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="card bg-white shadow-md rounded-lg p-6 mb-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Map className="h-5 w-5 text-green-700" />
                    <h2 className="text-xl font-semibold text-green-700">Your Location</h2>
                  </div>
                  {location ? (
                    <div>
                      <p className="text-gray-700 mb-2">Showing tips customized for:</p>
                      <p className="font-medium">{location.lat.toFixed(2)}°N, {location.lng.toFixed(2)}°W</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-500 mb-3">Detecting your location...</p>
                      <div className="animate-pulse flex space-x-4">
                        <div className="flex-1 space-y-4 py-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="card bg-white shadow-md rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-green-700 mb-4">Seasonal Resources</h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg transition-transform hover:scale-105">
                      <h3 className="font-medium text-blue-800">Seasonal Food Guide</h3>
                      <p className="text-sm text-blue-600 mt-1">Find what produce is in season in your area.</p>
                      <button className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center">
                        View Guide <span className="ml-1">→</span>  <span className='text-red-500 ml-2.5'>Coming soon..</span>
                      </button>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg transition-transform hover:scale-105">
                      <h3 className="font-medium text-green-800">Energy Saving Calendar</h3>
                      <p className="text-sm text-green-600 mt-1">Monthly checklist for home energy efficiency.</p>
                      <button className="mt-2 text-sm text-green-600 hover:text-green-800 flex items-center">
                        Download PDF <span className="ml-1">→</span> <span className='text-red-500 ml-2.5'>Coming soon..</span>
                      </button>
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-lg transition-transform hover:scale-105">
                      <h3 className="font-medium text-yellow-800">Local Events</h3>
                      <p className="text-sm text-yellow-600 mt-1">Find sustainability events in your community.</p>
                      <button className="mt-2 text-sm text-yellow-600 hover:text-yellow-800 flex items-center">
                        Browse Events <span className="ml-1">→</span> <span className='text-red-500 ml-2.5'>Coming soon..</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="lg:col-span-3">
              <div className="card bg-white shadow-md rounded-lg p-6">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                  <button
                    className={`py-2 px-4 font-medium text-sm ${activeTab === 'tips' ? 'border-b-2 border-green-500 text-green-700' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('tips')}
                  >
                    Seasonal Tips
                  </button>
                  <button
                    className={`py-2 px-4 font-medium text-sm ${activeTab === 'saved' ? 'border-b-2 border-green-500 text-green-700' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('saved')}
                  >
                    My Plan {savedTips.length > 0 && `(${savedTips.length})`}
                  </button>
                </div>

                {/* Tips tab */}
                {activeTab === 'tips' && (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-semibold text-green-700">
                        {new Date(0, currentMonth).toLocaleString('default', { month: 'long' })} Tips
                      </h2>
                      <div className="text-sm text-gray-500">
                        {location ? "Localized for your area" : "General tips"}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tips.map(tip => (
                        <div 
                          key={tip.id} 
                          className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white"
                        >
                          <div className="flex items-start">
                            <div className="mr-4">
                              {getIconComponent(tip.icon)}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h3 className="text-lg font-medium text-gray-800">{tip.title}</h3>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  tip.priority === 'High' ? 'bg-red-100 text-red-800' :
                                  tip.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {tip.priority}
                                </span>
                              </div>
                              <p className="text-gray-600 mt-2">{tip.description}</p>
                              <div className="mt-4 flex justify-between items-center">
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {tip.category}
                                </span>
                                <button 
                                  onClick={() => saveTip(tip)}
                                  className="flex items-center text-sm font-medium text-green-600 hover:text-green-800 focus:outline-none"
                                  disabled={savedTips.some(savedTip => savedTip.id === tip.id)}
                                >
                                  <Save className="h-4 w-4 mr-1" />
                                  {savedTips.some(savedTip => savedTip.id === tip.id) ? 'Saved' : 'Save to Plan'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Saved tips tab */}
                {activeTab === 'saved' && (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-semibold text-green-700">My Sustainability Plan</h2>
                    </div>

                    {savedTips.length === 0 ? (
                      <div className="bg-gray-50 p-8 rounded-lg text-center">
                        <div className="mx-auto h-12 w-12 text-gray-400">
                          <Save className="h-12 w-12" />
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No saved tips yet</h3>
                        <p className="mt-2 text-gray-500 max-w-md mx-auto">
                          Add tips to your plan by clicking "Save to Plan" on any seasonal tip that interests you.
                        </p>
                        <button 
                          onClick={() => setActiveTab('tips')} 
                          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          Browse Tips
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {savedTips.map(tip => (
                          <div 
                            key={tip.id} 
                            className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white"
                          >
                            <div className="flex items-start">
                              <div className="mr-4">
                                {getIconComponent(tip.icon)}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <h3 className="text-lg font-medium text-gray-800">{tip.title}</h3>
                                  <button 
                                    onClick={() => removeTip(tip.id)}
                                    className="text-gray-400 hover:text-red-500"
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </button>
                                </div>
                                <p className="text-gray-600 mt-2">{tip.description}</p>
                                <div className="mt-4 flex justify-between items-center">
                                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {tip.category}
                                  </span>
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    tip.priority === 'High' ? 'bg-red-100 text-red-800' :
                                    tip.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {tip.priority}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <div className="pt-4 flex justify-end">
                          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                            Export My Plan
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Education Section */}
      {activeSection === 'education' && (
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <header className="mb-6 text-center">
              <h1 className="text-3xl font-bold text-green-800 mb-2">Understanding Carbon Footprints</h1>
              <p className="text-gray-600">Expand your knowledge with these educational resources on carbon footprints and sustainability</p>
            </header>
            
            {/* Featured Video Player with YouTube iframe */}
            {activeVideo !== null && (
              <div className="mb-6 rounded-lg overflow-hidden shadow-lg bg-white p-4">
                <div className="relative pt-0 pb-0 h-0 overflow-hidden rounded-lg" style={{paddingBottom: "56.25%"}}>
                  {/* YouTube iframe */}
                  <iframe 
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${videos[activeVideo].id}`}
                    title={videos[activeVideo].title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="pt-4">
                  <h3 className="font-bold text-green-700 text-xl">{videos[activeVideo].title}</h3>
                  <p className="text-gray-600">{videos[activeVideo].description}</p>
                </div>
              </div>
            )}
            
            {/* Video Selection Grid with YouTube Thumbnails */}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 ${activeVideo === null ? 'mt-4' : ''}`}>
              {videos.map((video, index) => (
                <div 
                  key={video.id}
                  className={`cursor-pointer rounded-lg overflow-hidden shadow-md transition-all ${
                    activeVideo === index ? 'ring-2 ring-green-500' : 'hover:shadow-lg'
                  }`}
                  onClick={() => handleVideoSelect(index)}
                >
                  <div className="relative pb-0 h-0 overflow-hidden" style={{paddingBottom: "56.25%"}}>
                    {/* YouTube thumbnail */}
                    <img 
                      src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} 
                      alt={video.title}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-30 transition-opacity">
                      <div className="bg-black bg-opacity-50 rounded-full p-3">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-white">
                    <h4 className="font-medium text-sm md:text-base truncate">{video.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{video.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Initial prompt when no video is selected */}
            {activeVideo === null && (
              <div className="text-center p-6 bg-white rounded-lg shadow-md mb-6">
                <div className="text-green-600 mb-3">
                  <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-18c4.411 0 8 3.589 8 8s-3.589 8-8 8-8-3.589-8-8 3.589-8 8-8zm-1 11V9l4.5 3-4.5 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800">Start Your Carbon Footprint Education</h3>
                <p className="text-gray-600 mt-2">Select any video from the collection to begin learning</p>
              </div>
            )}
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-bold text-green-800 mb-4">Why Understanding Carbon Footprints Matters</h2>
              <p className="text-gray-700 mb-3">
                A carbon footprint represents the total greenhouse gas emissions caused by an individual, event, organization, service, or product. 
                By understanding your own carbon footprint, you can make informed decisions that help combat climate change.
              </p>
              <p className="text-gray-700">
                The videos in this collection provide valuable insights into carbon footprints, sustainability practices, and how small changes 
                in your daily life can contribute to a healthier planet for future generations.
              </p>
            </div>
          </div>
        </div>
      )}

      <footer className="text-center text-sm text-gray-500 py-6">
        <p>© 2025 Diba Elite Team - Your Partner in Sustainable Living</p>
      </footer>
    </div>
  );
}