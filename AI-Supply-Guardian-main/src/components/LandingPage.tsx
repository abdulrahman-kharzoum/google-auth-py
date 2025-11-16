import {
  Shield,
  Bell,
  Mail,
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  ChevronUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import { AuthModal } from "./Auth/AuthModal";
import { useAuth } from "../contexts/AuthContext";

interface LandingPageProps {
  onNavigateToDashboard: () => void;
}

export function LandingPage({ onNavigateToDashboard }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { user } = useAuth();

  // Show scroll-to-top button when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSignIn = () => {
    setAuthMode("signin");
    setAuthModalOpen(true);
  };

  const handleSignUp = () => {
    setAuthMode("signup");
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    onNavigateToDashboard();
  };

  // Toggle this to test PNG background vs animated starfield
  const usePngBackground = true; // Set to false to use animated starfield

  return (
    <div className="min-h-screen bg-[#0a0e1a] relative overflow-hidden">
      {/* Animated Background with Stars (Original) */}
      {!usePngBackground && (
        <div className="fixed inset-0 z-0">
          {/* Nebula/Galaxy Background Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a] via-[#1a1f37] to-[#0f1629]"></div>

          {/* Animated Gradient Clouds */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute top-40 right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-float-delay-1"></div>
            <div className="absolute bottom-40 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-float-delay-2"></div>
            <div className="absolute bottom-20 right-1/3 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl animate-float-delay-3"></div>
          </div>

          {/* Stars Layer 1 - Small Stars */}
          <div className="stars-small"></div>

          {/* Stars Layer 2 - Medium Stars */}
          <div className="stars-medium"></div>

          {/* Stars Layer 3 - Large Stars */}
          <div className="stars-large"></div>
        </div>
      )}

      {/* PNG Background Image (Test) */}
      {usePngBackground && (
        <div className="fixed inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url("/background3.jpeg")',
              opacity: 0.6,
            }}
          ></div>
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/70 via-[#1a1f37]/80 to-[#0f1629]/70"></div>
        </div>
      )}

      {/* Content Wrapper with higher z-index */}
      <div className="relative z-10">
        <header className="fixed top-0 left-0 right-0 border-b border-indigo-500/20 z-50 shadow-lg shadow-indigo-500/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-indigo-500" />
                <span className="text-xl font-semibold text-white">
                  AI Supply Guardian
                </span>
              </div>

              <nav className="hidden md:flex items-center space-x-8">
                <a
                  href="#features"
                  className="text-gray-300 hover:text-white transition"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-gray-300 hover:text-white transition"
                >
                  How It Works
                </a>
                <a
                  href="#why-choose"
                  className="text-gray-300 hover:text-white transition"
                >
                  Why Choose Us
                </a>
                <a
                  href="#contact"
                  className="text-gray-300 hover:text-white transition"
                >
                  Contact
                </a>
              </nav>

              <div className="hidden md:flex items-center space-x-4">
                {user ? (
                  <button
                    onClick={onNavigateToDashboard}
                    className="gradient-button text-white px-6 py-2 rounded-lg transition shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 duration-300"
                  >
                    Dashboard
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSignIn}
                      className="text-gray-300 hover:text-white transition font-medium"
                    >
                      Login
                    </button>
                    <span className="text-gray-500">/</span>
                    <button
                      onClick={handleSignUp}
                      className="text-gray-300 hover:text-white transition font-medium"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>

              <button
                className="md:hidden text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t border-indigo-500/20 bg-[#0a0e1a]/60 backdrop-blur-xl">
              <div className="px-4 py-4 space-y-3">
                <a
                  href="#features"
                  className="block text-gray-300 hover:text-white"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="block text-gray-300 hover:text-white"
                >
                  How It Works
                </a>
                <a
                  href="#why-choose"
                  className="block text-gray-300 hover:text-white"
                >
                  Why Choose Us
                </a>
                <a
                  href="#contact"
                  className="block text-gray-300 hover:text-white"
                >
                  Contact
                </a>
                {user ? (
                  <button
                    onClick={onNavigateToDashboard}
                    className="block w-full gradient-button text-white px-6 py-2 rounded-lg transition shadow-lg shadow-indigo-500/30"
                  >
                    Dashboard
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={handleSignIn}
                        className="text-gray-300 hover:text-white font-medium"
                      >
                        Login
                      </button>
                      <span className="text-gray-500">/</span>
                      <button
                        onClick={handleSignUp}
                        className="text-gray-300 hover:text-white font-medium"
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </header>

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authMode}
          onSuccess={handleAuthSuccess}
        />

        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  <span className="text-blue-400">AI </span>
                  <span className="text-blue-300">Supply </span>
                  <span className="gradient-text">Guardian</span>
                </h1>
                <h2 className="text-2xl lg:text-3xl font-semibold text-white mb-6">
                  Smart Supply Chain Assistant
                </h2>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Get accurate risk alerts, supplier monitoring, and real-time
                  updates in one place. Navigate complex supply chain situations
                  with AI assistance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={user ? onNavigateToDashboard : handleSignUp}
                    className="gradient-button text-white px-8 py-4 rounded-lg transition text-lg font-medium flex items-center justify-center space-x-2 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 duration-300"
                  >
                    <span>
                      {user ? "Go to Dashboard" : "Start Your Supply Journey"}
                    </span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-[#2a2f4a] to-[#232840] rounded-2xl p-6 shadow-2xl border border-indigo-500/30 group-hover:border-indigo-500/50 transition-all duration-500">
                  <div className="bg-[#1e2337] rounded-xl shadow-2xl p-6 border border-gray-700/50 group-hover:border-gray-600/50 transition-all duration-500 group-hover:shadow-indigo-500/20">
                    <div className="flex items-center mb-4 group-hover:scale-[1.02] transition-transform duration-300">
                      <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center mr-2 group-hover:bg-indigo-500/30 transition-colors duration-300">
                        <Mail className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300" />
                      </div>
                      <h3 className="font-semibold text-white group-hover:text-gray-100 transition-colors duration-300">
                        My supplier mentioned a potential 2-week delay. Is this
                        risky?
                      </h3>
                    </div>

                    <div className="bg-gradient-to-br from-[#1a4d3a] to-[#15402f] rounded-lg p-4 mb-4 border border-green-500/30 shadow-lg hover:shadow-green-500/20 hover:border-green-500/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                      <div className="flex items-start space-x-2 mb-2">
                        <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-5 h-5 text-green-400 hover:text-green-300 transition-colors duration-300" />
                        </div>
                        <div>
                          <h4 className="text-green-300 font-semibold text-sm mb-1 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                            Answer
                          </h4>
                          <p className="text-green-100 text-sm leading-relaxed">
                            NO - This delay is manageable if you have a 3+ week
                            buffer. However, monitor for cascading delays from
                            their suppliers.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#1e3a52] to-[#193449] rounded-lg p-4 border border-blue-500/30 shadow-lg hover:shadow-blue-500/20 hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                      <div className="flex items-start space-x-2">
                        <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <ArrowRight className="w-5 h-5 text-blue-400 hover:text-blue-300 transition-colors duration-300" />
                        </div>
                        <div>
                          <h4 className="text-blue-300 font-semibold text-sm mb-1 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
                            Next Steps
                          </h4>
                          <p className="text-blue-100 text-sm leading-relaxed">
                            Contact backup suppliers for quotes within 48 hours
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="py-20 bg-transparent px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Powerful Features for Supply Chain Management
              </h2>
              <p className="text-xl text-gray-400">
                Everything you need to stay ahead of supply chain disruptions
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Real-time Risk Alerts - Red/Orange Theme */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500 group-hover:duration-300 animate-pulse"></div>
                <div className="relative bg-[#1e2337] rounded-xl p-8 shadow-2xl hover:shadow-red-500/25 transition-all duration-300 border border-red-500/20 hover:border-red-500/50 hover:-translate-y-2 cursor-pointer">
                  <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Bell className="w-6 h-6 text-red-400 group-hover:text-red-300 transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-red-300 transition-colors duration-300">
                    Real-time Risk Alerts
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    Get instant notifications when AI detects potential delays,
                    price spikes, or supplier issues.
                  </p>
                </div>
              </div>

              {/* AI Email Analysis - Purple Theme */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500 group-hover:duration-300 animate-pulse"></div>
                <div className="relative bg-[#1e2337] rounded-xl p-8 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 border border-purple-500/20 hover:border-purple-500/50 hover:-translate-y-2 cursor-pointer">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Mail className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">
                    AI Email Analysis
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    Paste supplier emails and let AI extract key information,
                    risks, and delivery updates automatically.
                  </p>
                </div>
              </div>

              {/* Smart Dashboard - Blue/Cyan Theme */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500 group-hover:duration-300 animate-pulse"></div>
                <div className="relative bg-[#1e2337] rounded-xl p-8 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 border border-blue-500/20 hover:border-blue-500/50 hover:-translate-y-2 cursor-pointer">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <BarChart3 className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
                    Smart Dashboard
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    Visualize your entire supply chain at a glance with
                    intuitive charts and risk indicators.
                  </p>
                </div>
              </div>

              {/* Supplier Management - Green/Emerald Theme */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500 group-hover:duration-300 animate-pulse"></div>
                <div className="relative bg-[#1e2337] rounded-xl p-8 shadow-2xl hover:shadow-green-500/25 transition-all duration-300 border border-green-500/20 hover:border-green-500/50 hover:-translate-y-2 cursor-pointer">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Users className="w-6 h-6 text-green-400 group-hover:text-green-300 transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-green-300 transition-colors duration-300">
                    Supplier Management
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    Track all your suppliers, orders, and delivery schedules in
                    one centralized platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="py-20 px-4 sm:px-6 lg:px-8 bg-transparent"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                See AI Supply Guardian in Action
              </h2>
              <p className="text-xl text-gray-400">
                Explore how our AI simplifies complex supply chain management
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left Side - Interactive Demo */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-[#1e2842] to-[#1a2235] rounded-2xl p-6 shadow-2xl border border-indigo-500/20">
                  {/* Browser-like window with macOS style buttons */}
                  <div className="bg-[#1a1f37] rounded-xl shadow-2xl overflow-hidden border border-gray-700/50">
                    <div className="bg-[#0f1419] px-4 py-3 flex items-center border-b border-gray-800/50">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="flex-1 text-center">
                        <span className="text-sm text-gray-400 font-medium">
                          AI Supply Guardian Assistant
                        </span>
                      </div>
                    </div>

                    {/* Chat Interface - Scrollable */}
                    <div className="p-6 space-y-4 h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500/50 scrollbar-track-gray-800/50">
                      {/* User Message 1 */}
                      <div className="flex items-start space-x-3 animate-fade-in">
                        <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div className="flex-1">
                          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl rounded-tl-none px-4 py-3 shadow-lg inline-block max-w-md">
                            <p className="text-sm">
                              My supplier mentioned a 2-week delay for
                              electronic components. Should I be worried?
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* AI Response 1 */}
                      <div className="flex items-start space-x-3 animate-fade-in-delay">
                        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Shield className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="bg-[#1e2337] rounded-2xl rounded-tl-none px-4 py-3 shadow-lg border border-gray-700/50">
                            <p className="text-gray-300 text-sm mb-2">
                              Based on your supply chain data, I can provide the
                              following analysis:
                            </p>
                          </div>

                          {/* Risk Assessment Card */}
                          <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-xl p-4 border border-green-500/30 shadow-lg hover:shadow-green-500/20 transition-all duration-300">
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              </div>
                              <div>
                                <h4 className="text-green-300 font-semibold text-sm mb-1 flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                  Risk Assessment
                                </h4>
                                <p className="text-green-100 text-xs leading-relaxed">
                                  <span className="font-semibold">
                                    LOW RISK
                                  </span>{" "}
                                  - You have a 4-week buffer in your production
                                  schedule. This delay is manageable.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Action Plan Card */}
                          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl p-4 border border-blue-500/30 shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <ArrowRight className="w-4 h-4 text-blue-400" />
                              </div>
                              <div>
                                <h4 className="text-blue-300 font-semibold text-sm mb-1 flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
                                  Recommended Actions
                                </h4>
                                <ul className="text-blue-100 text-xs space-y-1">
                                  <li>
                                    • Contact backup suppliers within 48 hours
                                  </li>
                                  <li>• Monitor for cascading delays</li>
                                  <li>• Set up price spike alerts</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* User Message 2 */}
                      <div className="flex items-start space-x-3 animate-fade-in pt-4">
                        <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div className="flex-1">
                          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl rounded-tl-none px-4 py-3 shadow-lg inline-block max-w-md">
                            <p className="text-sm">
                              Can you analyze this email from my supplier? "Due
                              to port congestion, shipment delayed 5 days. New
                              ETA: Dec 15."
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* AI Response 2 */}
                      <div className="flex items-start space-x-3 animate-fade-in-delay">
                        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Shield className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="bg-[#1e2337] rounded-2xl rounded-tl-none px-4 py-3 shadow-lg border border-gray-700/50">
                            <p className="text-gray-300 text-sm">
                              <span className="font-semibold text-indigo-300">
                                Email Analysis Complete:
                              </span>
                            </p>
                          </div>

                          {/* Extracted Info Card */}
                          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-xl p-4 border border-purple-500/30 shadow-lg">
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Mail className="w-4 h-4 text-purple-400" />
                              </div>
                              <div>
                                <h4 className="text-purple-300 font-semibold text-sm mb-2">
                                  Extracted Information
                                </h4>
                                <div className="text-purple-100 text-xs space-y-1">
                                  <p>
                                    •{" "}
                                    <span className="font-semibold">
                                      Delay:
                                    </span>{" "}
                                    5 days
                                  </p>
                                  <p>
                                    •{" "}
                                    <span className="font-semibold">
                                      Cause:
                                    </span>{" "}
                                    Port congestion
                                  </p>
                                  <p>
                                    •{" "}
                                    <span className="font-semibold">
                                      New ETA:
                                    </span>{" "}
                                    December 15, 2025
                                  </p>
                                  <p>
                                    •{" "}
                                    <span className="font-semibold">
                                      Status:
                                    </span>{" "}
                                    Updated automatically ✓
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Impact Assessment Card */}
                          <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 rounded-xl p-4 border border-yellow-500/30 shadow-lg">
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Bell className="w-4 h-4 text-yellow-400" />
                              </div>
                              <div>
                                <h4 className="text-yellow-300 font-semibold text-sm mb-1">
                                  Impact Assessment
                                </h4>
                                <p className="text-yellow-100 text-xs leading-relaxed">
                                  <span className="font-semibold">
                                    MEDIUM RISK
                                  </span>{" "}
                                  - This affects 2 customer orders. Consider
                                  expedited shipping or notifying customers.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* User Message 3 */}
                      <div className="flex items-start space-x-3 animate-fade-in pt-4">
                        <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div className="flex-1">
                          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl rounded-tl-none px-4 py-3 shadow-lg inline-block max-w-md">
                            <p className="text-sm">
                              Show me suppliers with delivery issues this month
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* AI Response 3 */}
                      <div className="flex items-start space-x-3 animate-fade-in-delay">
                        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Shield className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="bg-[#1e2337] rounded-2xl rounded-tl-none px-4 py-3 shadow-lg border border-gray-700/50">
                            <p className="text-gray-300 text-sm">
                              Found 3 suppliers with delivery issues in November
                              2025:
                            </p>
                          </div>

                          {/* Supplier List Card */}
                          <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 rounded-xl p-4 border border-red-500/30 shadow-lg">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between pb-2 border-b border-red-500/20">
                                <div>
                                  <p className="text-red-200 font-semibold text-xs">
                                    TechComponents Ltd
                                  </p>
                                  <p className="text-red-300/70 text-xs">
                                    2 delays (avg 6 days)
                                  </p>
                                </div>
                                <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs font-semibold">
                                  HIGH
                                </span>
                              </div>
                              <div className="flex items-center justify-between pb-2 border-b border-yellow-500/20">
                                <div>
                                  <p className="text-yellow-200 font-semibold text-xs">
                                    GlobalParts Inc
                                  </p>
                                  <p className="text-yellow-300/70 text-xs">
                                    1 delay (3 days)
                                  </p>
                                </div>
                                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs font-semibold">
                                  MED
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-orange-200 font-semibold text-xs">
                                    FastShip Logistics
                                  </p>
                                  <p className="text-orange-300/70 text-xs">
                                    1 delay (2 days)
                                  </p>
                                </div>
                                <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-xs font-semibold">
                                  LOW
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Scroll indicator at bottom */}
                      <div className="text-center py-2">
                        <p className="text-gray-500 text-xs italic">
                          Scroll to see more examples ↑↓
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Feature Cards */}
              <div className="space-y-6">
                {/* Real-time Analysis Card */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                  <div className="relative bg-[#1e2337] rounded-xl p-6 shadow-xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 cursor-pointer hover:-translate-y-1">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-all duration-300 group-hover:scale-110">
                        <Shield className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                          Real-time Risk Analysis
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                          AI analyzes your supply chain in real-time, providing
                          accurate risk assessments specific to your business
                          and current market conditions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Automated Document Processing Card */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                  <div className="relative bg-[#1e2337] rounded-xl p-6 shadow-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 cursor-pointer hover:-translate-y-1">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 transition-all duration-300 group-hover:scale-110">
                        <Mail className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                          Automated Email Processing
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                          Extract critical information from supplier emails
                          automatically. No more manual data entry or missed
                          updates.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step-by-Step Action Plans Card */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                  <div className="relative bg-[#1e2337] rounded-xl p-6 shadow-xl border border-green-500/20 hover:border-green-500/40 transition-all duration-300 cursor-pointer hover:-translate-y-1">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-all duration-300 group-hover:scale-110">
                        <TrendingUp className="w-6 h-6 text-green-400 group-hover:text-green-300 transition-colors duration-300" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-300 transition-colors duration-300">
                          Step-by-Step Action Plans
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                          Receive clear, actionable guidance with prioritized
                          steps to address your supply chain challenges
                          effectively and efficiently.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Smart Dashboard Insights Card */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                  <div className="relative bg-[#1e2337] rounded-xl p-6 shadow-xl border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 cursor-pointer hover:-translate-y-1">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-all duration-300 group-hover:scale-110">
                        <BarChart3 className="w-6 h-6 text-orange-400 group-hover:text-orange-300 transition-colors duration-300" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-orange-300 transition-colors duration-300">
                          Smart Dashboard Insights
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                          Visualize your entire supply chain at a glance with
                          intuitive charts, risk indicators, and predictive
                          analytics.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="why-choose"
          className="py-20 bg-transparent px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Why Choose AI Supply Guardian
              </h2>
              <p className="text-xl text-gray-400">
                Our vision for AI Supply Guardian's features and capabilities
              </p>
            </div>

            {/* Timeline Container */}
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 via-green-500 to-orange-500"></div>

              {/* Timeline Items */}
              <div className="space-y-3">
                {/* Item 1 - No ERP Needed (Blue) */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-12 text-right">
                    <div className="bg-[#1e2842]/80 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                      <div className="inline-block px-3 py-1 bg-blue-500/20 rounded-full text-blue-400 text-xs font-semibold mb-3">
                        PHASE 1
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">
                        No ERP Needed
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        Lightweight solution that works independently without
                        complex integrations, making it perfect for SMEs.
                      </p>
                    </div>
                  </div>
                  {/* Center Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-4 border-[#0a0e1a] z-10"></div>
                  <div className="w-1/2"></div>
                </div>

                {/* Item 2 - Accurate AI Detection (Purple) */}
                <div className="relative flex items-center">
                  <div className="w-1/2"></div>
                  {/* Center Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-purple-500 rounded-full border-4 border-[#0a0e1a] z-10"></div>
                  <div className="w-1/2 pl-12">
                    <div className="bg-[#1e2842]/80 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                      <div className="inline-block px-3 py-1 bg-purple-500/20 rounded-full text-purple-400 text-xs font-semibold mb-3">
                        PHASE 2
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">
                        Accurate AI Detection
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        Advanced algorithms identify risks with high precision
                        and minimal false positives, ensuring reliable alerts.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Item 3 - Saves Time & Money (Green) */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-12 text-right">
                    <div className="bg-[#1e2842]/80 backdrop-blur-sm rounded-xl p-6 border border-green-500/30 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
                      <div className="inline-block px-3 py-1 bg-green-500/20 rounded-full text-green-400 text-xs font-semibold mb-3">
                        PHASE 3
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">
                        Saves Time & Money
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        Prevent costly delays and make better purchasing
                        decisions with early warnings and predictive analytics.
                      </p>
                    </div>
                  </div>
                  {/* Center Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full border-4 border-[#0a0e1a] z-10"></div>
                  <div className="w-1/2"></div>
                </div>

                {/* Item 4 - Built for SMEs (Orange) */}
                <div className="relative flex items-center">
                  <div className="w-1/2"></div>
                  {/* Center Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-orange-500 rounded-full border-4 border-[#0a0e1a] z-10"></div>
                  <div className="w-1/2 pl-12">
                    <div className="bg-[#1e2842]/80 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20">
                      <div className="inline-block px-3 py-1 bg-orange-500/20 rounded-full text-orange-400 text-xs font-semibold mb-3">
                        PHASE 4
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">
                        Built for SMEs
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        Affordable, easy to use, and designed for businesses
                        without dedicated supply chain teams.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer
          id="contact"
          className="bg-transparent text-gray-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800/50"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center space-x-3 text-gray-400">
                <span className="text-sm">
                  ❤️ Built for AI Genesis Hackathon
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Shield className="w-6 h-6 text-indigo-400" />
                <span className="text-lg font-semibold text-white">
                  AI Supply Guardian
                </span>
              </div>

              <div className="flex items-center space-x-6">
                <a
                  href="https://github.com/abdullahxyz85/AI-Supply-Guardian"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition flex items-center space-x-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">GitHub</span>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition flex items-center space-x-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span className="text-sm">Docs</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-500/50 flex items-center justify-center transition-all duration-300 hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
