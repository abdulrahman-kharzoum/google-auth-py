import { useState } from "react";
import { Mail, Lock, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import GoogleSignInButton from "./GoogleSignInButton";

interface SignInFormProps {
  onSwitchToSignUp: () => void;
  onSuccess: () => void;
}

export function SignInForm({ onSwitchToSignUp, onSuccess }: SignInFormProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      setLoading(false);
      onSuccess();
    }
  };

  return (
    <div className="w-full max-w-md animate-fade-in">
      {/* Header with gradient accent */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-indigo-500/50 animate-pulse-slow">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="text-gray-400 text-lg">
          Sign in to your AI Supply Guardian account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Alert with animation */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start space-x-3 animate-shake backdrop-blur-sm shadow-lg shadow-red-500/20">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5 animate-bounce" />
            <p className="text-sm text-red-400 font-medium">{error}</p>
          </div>
        )}

        {/* Email Field */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-300 mb-3 group-hover:text-indigo-400 transition-colors duration-200">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 group-hover:text-indigo-400 transition-colors duration-200 z-10" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gradient-to-br from-[#1a1f37] to-[#151929] border-2 border-gray-700/50 rounded-xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 hover:border-gray-600 transition-all duration-300 text-white placeholder-gray-500 shadow-lg hover:shadow-xl hover:shadow-indigo-500/10 focus:shadow-indigo-500/30"
              placeholder="you@example.com"
              disabled={loading}
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-indigo-500/5 transition-all duration-300 pointer-events-none"></div>
          </div>
        </div>

        {/* Password Field */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-300 mb-3 group-hover:text-indigo-400 transition-colors duration-200">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 group-hover:text-indigo-400 transition-colors duration-200 z-10" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gradient-to-br from-[#1a1f37] to-[#151929] border-2 border-gray-700/50 rounded-xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 hover:border-gray-600 transition-all duration-300 text-white placeholder-gray-500 shadow-lg hover:shadow-xl hover:shadow-indigo-500/10 focus:shadow-indigo-500/30"
              placeholder="Enter your password"
              disabled={loading}
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-indigo-500/5 transition-all duration-300 pointer-events-none"></div>
          </div>
        </div>

        {/* Submit Button with enhanced styling */}
        <button
          type="submit"
          disabled={loading}
          className="w-full relative group/btn overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 text-white px-6 py-4 rounded-xl transition-all duration-300 font-semibold text-lg shadow-xl shadow-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/60 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98] mt-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-center space-x-2">
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <Sparkles className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              </>
            )}
          </div>
        </button>

        {/* OR Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="w-full border-t border-gray-700/50"></div>
          <span className="absolute px-4 bg-[#1e2337] text-gray-400 text-sm">
            OR
          </span>
        </div>

        {/* Google Sign-In Button */}
        <GoogleSignInButton />
      </form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700/50"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[#1e2337] text-gray-400">
              Don't have an account?
            </span>
          </div>
        </div>
        <button
          onClick={onSwitchToSignUp}
          className="mt-4 text-indigo-400 hover:text-indigo-300 font-semibold transition-all duration-200 hover:scale-105 inline-flex items-center space-x-1"
        >
          <span>Create new account</span>
          <span className="text-xl">→</span>
        </button>
      </div>
    </div>
  );
}
