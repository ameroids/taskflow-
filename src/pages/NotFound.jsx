import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleHome = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate(user.role === 'admin' ? '/admin' : '/app');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 text-slate-800 antialiased font-sans relative overflow-hidden">
      {/* Elegant modern decorative background glow & subtle grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-70 pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-100/60 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-indigo-100/60 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fadeIn text-center">
        {/* Main Crisp White Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-11 border border-slate-200/80 shadow-[0_20px_50px_rgba(15,23,42,0.06)] backdrop-blur-sm">
          
          {/* Subtle Icon Badge */}
          <div className="mx-auto w-20 h-20 mb-6 rounded-2xl bg-gradient-to-b from-blue-50 to-blue-100/80 border border-blue-200/70 flex items-center justify-center shadow-inner text-blue-600">
            <FileQuestion size={38} strokeWidth={1.8} />
          </div>

          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[12px] font-semibold tracking-wider uppercase mb-3">
            Error 404
          </div>

          <h1 className="text-[24px] sm:text-[26px] font-bold text-slate-900 tracking-tight">
            Page Not Found
          </h1>

          <p className="text-[14px] text-slate-500 mt-2.5 leading-relaxed">
            The page you're looking for doesn't exist or may have been relocated.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-7">
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-medium text-[13.5px] border border-slate-200/80 flex items-center justify-center gap-2 transition-all"
            >
              <ArrowLeft size={15} />
              <span>Go Back</span>
            </button>
            <button
              onClick={handleHome}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-[13.5px] shadow-sm shadow-blue-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Home size={15} />
              <span>Dashboard</span>
            </button>
          </div>
        </div>

        {/* Clean Modern Footer */}
        <div className="flex items-center justify-center gap-2 mt-5 text-[12.5px] text-slate-400 font-medium">
          <span className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
            TF
          </span>
          <span>TaskFlow Workspace</span>
        </div>
      </div>
    </div>
  );
}
