import { useNavigate } from "react-router-dom";
import { MdBugReport, MdArrowBack, MdDashboard } from "react-icons/md";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center max-w-md animate-fade-up">
        <div className="w-20 h-20 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-6">
          <MdBugReport className="text-brand-500" size={36} />
        </div>

        <h1 className="text-7xl font-black text-foreground mb-2 tracking-tight">
          404
        </h1>
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Page not found
        </h2>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground border border-border hover:bg-secondary transition-colors"
          >
            <MdArrowBack size={16} />
            Go back
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-brand-500 text-white hover:bg-brand-600 transition-colors"
          >
            <MdDashboard size={16} />
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
