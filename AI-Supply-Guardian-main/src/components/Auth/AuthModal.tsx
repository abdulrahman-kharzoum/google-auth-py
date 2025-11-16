import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "signin" | "signup";
  onSuccess: () => void;
}

export function AuthModal({
  isOpen,
  onClose,
  initialMode = "signin",
  onSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);

  // Update mode when initialMode changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Background image matching landing page */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2013&auto=format&fit=crop")',
            opacity: 0.15,
          }}
        ></div>
      </div>

      {/* Modal with enhanced styling and hidden scrollbar */}
      <div className="relative bg-gradient-to-br from-[#1e2337]/95 via-[#1a1f37]/95 to-[#1e2337]/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-indigo-500/20 max-w-md w-full max-h-[90vh] overflow-y-auto animate-bounce-in scrollbar-hide">
        {/* Gradient border effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-3xl opacity-20 blur-lg"></div>

        <div className="relative">
          {/* Close Button with better styling */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-xl bg-[#151929]/80 hover:bg-red-500/20 hover:border-red-500/50 border border-gray-700/50 transition-all duration-300 text-gray-400 hover:text-red-400 z-10 group shadow-lg hover:shadow-red-500/20"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Content with padding */}
          <div className="p-10">
            {mode === "signin" ? (
              <SignInForm
                onSwitchToSignUp={() => setMode("signup")}
                onSuccess={onSuccess}
              />
            ) : (
              <SignUpForm onSwitchToSignIn={() => setMode("signin")} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
