import { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { saveAs } from 'file-saver';

Chart.register(...registerables);

const CarbonTracker = () => {
  const [formData, setFormData] = useState({
    transportationType: 'car',
    distance: '',
    fuelType: 'gasoline',
    electricityUsage: '',
    meatConsumption: 'low',
    dairyConsumption: 'low',
    wasteRecycled: 'some',
    flightHours: '',
    shoppingHabits: 'moderate'
  });
  
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedCalculations, setSavedCalculations] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [comparisonData, setComparisonData] = useState(null);

  useEffect(() => {
    // Load saved calculations from localStorage
    const saved = JSON.parse(localStorage.getItem('carbonCalculations')) || [];
    setSavedCalculations(saved);
    
    // Load average data for comparison
    const avgUS = 16.5; // metric tons CO2/year
    const avgEU = 6.4;
    const avgGlobal = 4.8;
    setComparisonData({ avgUS, avgEU, avgGlobal });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const saveCalculation = (calculation) => {
    const newSaved = [...savedCalculations, {
      ...calculation,
      date: new Date().toISOString()
    }];
    setSavedCalculations(newSaved);
    localStorage.setItem('carbonCalculations', JSON.stringify(newSaved));
  };

  const calculateEmissions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulated API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Calculate transport emissions
      let transportEmissions = 0;
      switch (formData.transportationType) {
        case 'car':
          transportEmissions = formData.distance * (formData.fuelType === 'gasoline' ? 0.12 : 0.1);
          break;
        case 'bus':
          transportEmissions = formData.distance * 0.05;
          break;
        case 'train':
          transportEmissions = formData.distance * 0.03;
          break;
        case 'flight':
          transportEmissions = formData.flightHours * 90; // kg CO2 per hour
          break;
        case 'bike':
        case 'walk':
          transportEmissions = 0;
          break;
        default:
          transportEmissions = formData.distance * 0.1;
      }
      
      // Calculate electricity emissions (kg CO2 per kWh)
      const electricityEmissions = formData.electricityUsage * 0.5;
      
      // Calculate food emissions
      let foodEmissions = 0;
      
      if (formData.meatConsumption === 'high') {
        foodEmissions += 4;
      } else if (formData.meatConsumption === 'medium') {
        foodEmissions += 2.5;
      } else if (formData.meatConsumption === 'low') {
        foodEmissions += 1;
      }
      
      if (formData.dairyConsumption === 'high') {
        foodEmissions += 1.5;
      } else if (formData.dairyConsumption === 'medium') {
        foodEmissions += 1;
      } else if (formData.dairyConsumption === 'low') {
        foodEmissions += 0.5;
      }
      
      // Calculate waste emissions
      let wasteEmissions = 1.2; // base value
      if (formData.wasteRecycled === 'most') {
        wasteEmissions = 0.4;
      } else if (formData.wasteRecycled === 'some') {
        wasteEmissions = 0.8;
      }
      
      // Calculate shopping emissions
      let shoppingEmissions = 0;
      if (formData.shoppingHabits === 'high') {
        shoppingEmissions = 3.5;
      } else if (formData.shoppingHabits === 'moderate') {
        shoppingEmissions = 2;
      } else {
        shoppingEmissions = 1;
      }
      
      // Total emissions (in kg CO2 equivalent)
      const totalEmissions = transportEmissions + electricityEmissions + 
                           foodEmissions + wasteEmissions + shoppingEmissions;
      
      // Generate recommendations
      const recommendations = [];
      
      if (transportEmissions > 5) {
        recommendations.push({
          text: "Consider carpooling, using public transport, or switching to an electric vehicle.",
          category: "Transportation",
          impact: "High",
          resources: [
            { title: "Public Transport Options", url: "#" },
            { title: "EV Buying Guide", url: "#" }
          ]
        });
      }
      
      if (electricityEmissions > 3) {
        recommendations.push({
          text: "Your electricity usage is high. Try energy-efficient appliances and turning off electronics.",
          category: "Energy",
          impact: "Medium",
          resources: [
            { title: "Energy Saving Tips", url: "#" },
            { title: "Solar Panel Information", url: "#" }
          ]
        });
      }
      
      if (foodEmissions > 3) {
        recommendations.push({
          text: "Consider reducing meat consumption and incorporating more plant-based meals.",
          category: "Food",
          impact: "High",
          resources: [
            { title: "Plant-Based Recipes", url: "#" },
            { title: "Sustainable Farming", url: "#" }
          ]
        });
      }
      
      if (wasteEmissions > 0.6) {
        recommendations.push({
          text: "Increase recycling and consider composting to reduce landfill waste.",
          category: "Waste",
          impact: "Medium",
          resources: [
            { title: "Composting Guide", url: "#" },
            { title: "Recycling Tips", url: "#" }
          ]
        });
      }
      
      if (shoppingEmissions > 2) {
        recommendations.push({
          text: "Consider buying second-hand or from sustainable brands to reduce your shopping footprint.",
          category: "Shopping",
          impact: "Medium",
          resources: [
            { title: "Sustainable Brands", url: "#" },
            { title: "Thrift Shopping Guide", url: "#" }
          ]
        });
      }
      
      if (recommendations.length === 0) {
        recommendations.push({
          text: "You're doing great! Keep up the eco-friendly lifestyle.",
          category: "General",
          impact: "Low",
          resources: []
        });
      }
      
      const result = {
        transportEmissions: parseFloat(transportEmissions.toFixed(2)),
        electricityEmissions: parseFloat(electricityEmissions.toFixed(2)),
        foodEmissions: parseFloat(foodEmissions.toFixed(2)),
        wasteEmissions: parseFloat(wasteEmissions.toFixed(2)),
        shoppingEmissions: parseFloat(shoppingEmissions.toFixed(2)),
        totalEmissions: parseFloat(totalEmissions.toFixed(2)),
        recommendations,
        date: new Date().toISOString()
      };
      
      setResults(result);
      saveCalculation(result);
      
    } catch (err) {
      setError('Failed to calculate carbon emissions. Please try again later.');
      console.error('Error calculating emissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateEmissions();
  };

  const exportToPDF = () => {
    const blob = new Blob([`Carbon Footprint Report\n\nTotal Emissions: ${results.totalEmissions} kg CO2\n\nBreakdown:\nTransport: ${results.transportEmissions}\nElectricity: ${results.electricityEmissions}\nFood: ${results.foodEmissions}\nWaste: ${results.wasteEmissions}\nShopping: ${results.shoppingEmissions}`], 
      { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'carbon-footprint-report.txt');
  };

  const emissionsData = {
    labels: ['Transport', 'Electricity', 'Food', 'Waste', 'Shopping'],
    datasets: [
      {
        label: 'Carbon Emissions (kg CO2)',
        data: results ? [
          results.transportEmissions,
          results.electricityEmissions,
          results.foodEmissions,
          results.wasteEmissions,
          results.shoppingEmissions
        ] : [],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-green-100 rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Carbon Footprint Calculator</h1>
          <p className="text-green-700">Calculate your environmental impact and discover ways to reduce it</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-green-700 mb-4">Enter Your Data</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Transportation Section */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-green-800 mb-3">Transportation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Primary Transportation</label>
                      <select
                        name="transportationType"
                        value={formData.transportationType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="car">Car</option>
                        <option value="bus">Bus</option>
                        <option value="train">Train</option>
                        <option value="flight">Flight</option>
                        <option value="bike">Bicycle</option>
                        <option value="walk">Walking</option>
                      </select>
                    </div>
                    
                    {formData.transportationType === 'car' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                        <select
                          name="fuelType"
                          value={formData.fuelType}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="gasoline">Gasoline</option>
                          <option value="diesel">Diesel</option>
                          <option value="hybrid">Hybrid</option>
                          <option value="electric">Electric</option>
                        </select>
                      </div>
                    )}
                    
                    {(formData.transportationType === 'car' || formData.transportationType === 'bus' || formData.transportationType === 'train') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Distance (km)
                        </label>
                        <input
                          type="number"
                          name="distance"
                          value={formData.distance}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                          placeholder="e.g. 20"
                        />
                      </div>
                    )}
                    
                    {formData.transportationType === 'flight' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Flight Hours
                        </label>
                        <input
                          type="number"
                          name="flightHours"
                          value={formData.flightHours}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                          placeholder="e.g. 2.5"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Home Energy Section */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-green-800 mb-3">Home Energy</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monthly Electricity Usage (kWh)
                    </label>
                    <input
                      type="number"
                      name="electricityUsage"
                      value={formData.electricityUsage}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g. 300"
                    />
                  </div>
                </div>
                
                {/* Food Section */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-green-800 mb-3">Food Consumption</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meat Consumption</label>
                      <select
                        name="meatConsumption"
                        value={formData.meatConsumption}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="high">High (Daily)</option>
                        <option value="medium">Medium (3-4 times/week)</option>
                        <option value="low">Low (1-2 times/week)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dairy Consumption</label>
                      <select
                        name="dairyConsumption"
                        value={formData.dairyConsumption}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="high">High (Daily)</option>
                        <option value="medium">Medium (3-4 times/week)</option>
                        <option value="low">Low (1-2 times/week)</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Waste Section */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-green-800 mb-3">Waste Management</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recycling Habits</label>
                    <select
                      name="wasteRecycled"
                      value={formData.wasteRecycled}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="most">Recycle most items</option>
                      <option value="some">Recycle some items</option>
                      <option value="little">Recycle little or nothing</option>
                    </select>
                  </div>
                </div>
                
                {/* Shopping Section */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-green-800 mb-3">Shopping Habits</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frequency of New Purchases</label>
                    <select
                      name="shoppingHabits"
                      value={formData.shoppingHabits}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="high">High (Frequent new purchases)</option>
                      <option value="moderate">Moderate (Occasional purchases)</option>
                      <option value="low">Low (Rarely buy new items)</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setShowHistory(!showHistory)}
                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    {showHistory ? 'Hide History' : 'View History'}
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Calculating...
                      </span>
                    ) : 'Calculate Footprint'}
                  </button>
                </div>
              </form>
            </div>
            
            {/* History Section */}
            {showHistory && (
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h2 className="text-xl font-semibold text-green-700 mb-4">Your Calculation History</h2>
                
                {savedCalculations.length === 0 ? (
                  <div className="bg-green-50 p-4 rounded-md text-center">
                    <p className="text-gray-600">No saved calculations yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Emissions</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {savedCalculations.map((calc, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(calc.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {calc.totalEmissions} kg CO2
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button 
                                onClick={() => setResults(calc)}
                                className="text-green-600 hover:text-green-800 mr-3"
                              >
                                View
                              </button>
                              <button 
                                onClick={() => {
                                  const newSaved = savedCalculations.filter((_, i) => i !== index);
                                  setSavedCalculations(newSaved);
                                  localStorage.setItem('carbonCalculations', JSON.stringify(newSaved));
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Results Sidebar */}
          <div className="lg:col-span-1">
            {loading && (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Calculating your carbon footprint...</p>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 rounded-lg shadow-md p-6 text-red-700">
                <p>{error}</p>
              </div>
            )}
            
            {results && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-green-700 mb-4">Your Carbon Footprint</h2>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Total: <span className="text-2xl font-bold text-green-600">{results.totalEmissions} kg CO2</span>
                    </h3>
                    
                    {comparisonData && (
                      <div className="bg-blue-50 p-4 rounded-md mb-4">
                        <h4 className="font-medium text-blue-800 mb-2">Comparison Data</h4>
                        <ul className="space-y-1 text-sm">
                          <li className="flex justify-between">
                            <span>US Average:</span>
                            <span>{comparisonData.avgUS * 1000} kg/year</span>
                          </li>
                          <li className="flex justify-between">
                            <span>EU Average:</span>
                            <span>{comparisonData.avgEU * 1000} kg/year</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Global Average:</span>
                            <span>{comparisonData.avgGlobal * 1000} kg/year</span>
                          </li>
                        </ul>
                        <p className="text-xs mt-2 text-blue-600">
                          Note: Your result is for a single calculation. Annualize by multiplying by 12 for monthly data.
                        </p>
                      </div>
                    )}
                    
                    <div className="h-64">
                      <Pie 
                        data={emissionsData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom'
                            },
                            tooltip: {
                              callbacks: {
                                label: function(context) {
                                  return `${context.label}: ${context.raw} kg CO2`;
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Breakdown</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between py-1 border-b border-gray-100">
                        <span>Transportation:</span>
                        <span className="font-medium">{results.transportEmissions} kg</span>
                      </li>
                      <li className="flex justify-between py-1 border-b border-gray-100">
                        <span>Electricity:</span>
                        <span className="font-medium">{results.electricityEmissions} kg</span>
                      </li>
                      <li className="flex justify-between py-1 border-b border-gray-100">
                        <span>Food:</span>
                        <span className="font-medium">{results.foodEmissions} kg</span>
                      </li>
                      <li className="flex justify-between py-1 border-b border-gray-100">
                        <span>Waste:</span>
                        <span className="font-medium">{results.wasteEmissions} kg</span>
                      </li>
                      <li className="flex justify-between py-1">
                        <span>Shopping:</span>
                        <span className="font-medium">{results.shoppingEmissions} kg</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      onClick={exportToPDF}
                      className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Export Report
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-green-700 mb-4">Recommendations</h2>
                  
                  <div className="space-y-4">
                    {results.recommendations.map((rec, index) => (
                      <div key={index} className="p-4 bg-green-50 rounded-md border-l-4 border-green-400">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            {rec.impact === 'High' && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                High Impact
                              </span>
                            )}
                            {rec.impact === 'Medium' && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Medium Impact
                              </span>
                            )}
                            {rec.impact === 'Low' && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Low Impact
                              </span>
                            )}
                          </div>
                          <div className="ml-3">
                            <h4 className="text-sm font-medium text-gray-800">{rec.category}</h4>
                            <p className="text-sm text-gray-600 mt-1">{rec.text}</p>
                            
                            {rec.resources.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs font-medium text-gray-500">Resources:</p>
                                <ul className="space-y-1 mt-1">
                                  {rec.resources.map((resource, i) => (
                                    <li key={i}>
                                      <a href={resource.url} className="text-xs text-blue-600 hover:underline">
                                        {resource.title}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!loading && !results && (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Calculate Your Footprint</h3>
                <p className="text-gray-600">Fill out the form to see your carbon emissions breakdown and personalized recommendations.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarbonTracker;