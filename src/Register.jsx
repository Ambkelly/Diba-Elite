import { useState } from 'react';
import { Leaf, Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import CarbonTracker from './CarbonTracker';

export default function AuthPages() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [redirectToCarbonTracker, setRedirectToCarbonTracker] = useState(false);

  // Add this function to handle navigation to CarbonTracker component
  const navigateToCarbonTracker = () => {
    setRedirectToCarbonTracker(true);
  };

  // Early return to redirect to CarbonTracker component
  if (redirectToCarbonTracker) {
    return <CarbonTracker />; // This will render your imported CarbonTracker component
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    
    // Simulate API call
    setTimeout(() => {
      if (email === 'test@example.com' && password === 'password') {
        setSuccessMessage(isLogin ? 'Login successful!' : 'Account created successfully!');
        // In a real app, you would redirect or update auth state here
        if (isLogin) {
          // Navigate to CarbonTracker component after successful login
          navigateToCarbonTracker();
        }
      } else if (isLogin) {
        setErrorMessage('Invalid email or password.');
      } else if (password.length < 8) {
        setErrorMessage('Password must be at least 8 characters long.');
      } else {
        setSuccessMessage('Account created successfully!');
      }
      setIsSubmitting(false);
    }, 1500);
  };
  
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white rounded-xl shadow-lg p-8 relative overflow-hidden">
        {/* Decorative leaf patterns */}
        <div className="absolute -top-10 -left-10 text-green-100">
          <Leaf size={120} />
        </div>
        <div className="absolute -bottom-10 -right-10 text-green-100 transform rotate-180">
          <Leaf size={120} />
        </div>
        
        {/* Content container with higher z-index */}
        <div className="relative z-10">
          {/* Logo and title */}
          <div className="text-center">
            <div className="mx-auto h-14 w-14 bg-green-100 text-white rounded-full flex items-center justify-center">
              <Leaf size={32} />
            </div>
            <h2 className="mt-4 text-3xl font-bold text-green-800">Ozone Guard</h2>
            <p className="mt-2 text-gray-600">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </p>
          </div>
          
          {/* Success message */}
          {successMessage && (
            <div className="mt-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 rounded flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <p>{successMessage}</p>
            </div>
          )}
          
          {/* Error message */}
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              {errorMessage}
            </div>
          )}
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              {/* Name field (signup only) */}
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}
              
              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="name@example.com"
                  />
                </div>
              </div>
              
              {/* Password field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder={isLogin ? "Your password" : "Create a password"}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                {!isLogin && (
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 8 characters long
                  </p>
                )}
              </div>
            </div>
            
            {/* Remember me & forgot password (login only) */}
            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                
                <div className="text-sm">
                  <a href="#" className="font-medium text-green-600 hover:text-green-500">
                    Forgot your password?
                  </a>
                </div>
              </div>
            )}
            
            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                {isSubmitting ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-r-transparent rounded-full" />
                ) : (
                  <>
                    {isLogin ? 'Sign in' : 'Create account'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>
          
          {/* Toggle between login and signup */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={toggleAuthMode}
                className="ml-1 font-medium text-green-600 hover:text-green-500 focus:outline-none"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
          
          {/* Alternative sign-in options */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-3 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Sign in with Google</span>
                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h4.92c-.18 1.16-.78 2.15-1.65 2.82v2.34h2.67c1.56-1.44 2.46-3.56 2.46-6.08 0-.58-.05-1.14-.15-1.68h-8.25z" fill="#4285F4"/>
                  <path d="M5.62 14.08c-.25-.72-.38-1.5-.38-2.3 0-.8.14-1.57.38-2.3v-2.38H2.9c-.8 1.37-1.25 2.95-1.25 4.67 0 1.72.45 3.3 1.25 4.67l2.72-2.36z" fill="#FBBC05"/>
                  <path d="M12.11 4.38c1.62 0 3.06.56 4.2 1.67l2.3-2.3c-1.9-1.76-4.38-2.85-7.1-2.85-4.12 0-7.7 2.3-9.52 5.7l2.72 2.36c.65-1.94 2.46-3.35 4.6-3.35z" fill="#EA4335"/>
                  <path d="M12.11 19.62c-2.15 0-3.96-1.4-4.6-3.35l-2.72 2.36c1.82 3.4 5.4 5.7 9.52 5.7 2.72 0 5.2-1.1 7.1-2.85l-2.67-2.33c-1.14 1.11-2.58 1.67-4.2 1.67z" fill="#34A853"/>
                </svg>
              </button>
              
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Sign in with Facebook</span>
                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" fill="#1877F2" />
                </svg>
              </button>
              
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Sign in with Apple</span>
                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.146 4.146a.5.5 0 01.708 0l3 3a.5.5 0 01-.708.708L13 5.707V15a1 1 0 11-2 0V5.707L8.854 7.854a.5.5 0 01-.708-.708l3-3zM8 19a1 1 0 100-2H5a1 1 0 01-1-1V5a1 1 0 011-1h3a1 1 0 100-2H5a3 3 0 00-3 3v11a3 3 0 003 3h3zm8 0a1 1 0 100-2h-3a1 1 0 100 2h3z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Privacy policy and terms of service */}
          <div className="mt-6 text-center text-xs text-gray-500">
            By continuing, you agree to Ozone Guard's{' '}
            <a href="#" className="text-green-600 hover:text-green-500">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="text-green-600 hover:text-green-500">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}