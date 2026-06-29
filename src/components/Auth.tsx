import React, { useState } from "react";
import { auth } from "../firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider 
} from "firebase/auth";

interface AuthProps {
  onGuestAccess: () => void;
}

export default function Auth({ onGuestAccess }: AuthProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Authentication failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (providerName: 'google' | 'github') => {
    setError("");
    setLoading(true);
    try {
      const provider = providerName === 'google' 
        ? new GoogleAuthProvider() 
        : new GithubAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error("Auth error:", err);
      if (
        err.code === "auth/popup-closed-by-user" || 
        (err.message && err.message.includes("popup-closed-by-user")) ||
        (err.message && err.message.includes("popup-blocked"))
      ) {
        setError(
          "The sign-in popup was closed or blocked. Because the app runs inside an iframe preview, browsers block popups by default. To log in with Google, please open the app in a new tab (click the 'Open in a new tab' button at the top-right of your preview screen), or select the 'Continue in Offline/Guest Developer Mode' option below."
        );
      } else {
        setError(`Social auth failed: ${err.message || "An error occurred."}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      {/* Background patterns */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#ac332a]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#2b9b92]/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-2xl mb-4">
            ⚡
          </div>
          <h1 className="font-sans text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Life Saver
          </h1>
          <p className="font-mono text-xs text-slate-500 uppercase tracking-widest mt-1">
            Digital Chief-of-Staff
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl text-sm font-sans">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-medium text-slate-500 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-slate-500 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-slate-950 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-950 rounded-xl font-sans font-bold tracking-tight shadow-md hover:shadow-lg transition-all active:scale-95 duration-100 flex items-center justify-center"
          >
            {loading ? "Processing..." : isSignUp ? "Create Secure Account" : "Access Mission Center"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm font-sans font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {isSignUp ? "Already have an account? Sign In" : "Need a secure workspace? Sign Up"}
          </button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-900 px-3 text-slate-500 font-mono">
              Or Social Sign In
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleSocialAuth('google')}
            disabled={loading}
            className="h-12 border border-slate-200 dark:border-slate-800 hover:border-slate-950 dark:hover:border-white rounded-xl font-sans font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all active:scale-95 duration-100"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.103C18.22 1.832 15.44 1 12.24 1 5.48 1 0 6.48 0 13s5.48 12 12.24 12c7.05 0 11.75-4.962 11.75-11.962 0-.808-.08-1.42-.19-1.753H12.24z"
              />
            </svg>
            Google
          </button>
          <button
            type="button"
            onClick={() => handleSocialAuth('github')}
            disabled={loading}
            className="h-12 border border-slate-200 dark:border-slate-800 hover:border-slate-950 dark:hover:border-white rounded-xl font-sans font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all active:scale-95 duration-100"
          >
            <svg className="w-5 h-5 fill-current text-slate-900 dark:text-white" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            GitHub
          </button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-sans">
              Developer Option
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onGuestAccess}
          className="w-full h-11 border border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-950 dark:hover:border-white rounded-xl font-mono text-xs text-slate-500 hover:text-slate-950 dark:hover:text-white transition-all duration-100"
        >
          Continue in Offline/Guest Developer Mode
        </button>
      </div>
    </div>
  );
}
