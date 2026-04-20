import { MdSearchOff } from "react-icons/md";

interface NotFoundProps {
  message?: string;
  onBack: () => void;
}

export const NotFoundState = ({ 
  message = "Found nothing here", 
  onBack 
}: NotFoundProps) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 animate-fade-in p-8">
    <div className="w-16 h-16 rounded-3xl bg-secondary/30 flex items-center justify-center border border-border/50 shadow-[0_0_40px_rgba(0,0,0,0.1)]">
      <MdSearchOff size={32} className="text-muted-foreground/50" />
    </div>
    <div className="text-center space-y-1.5">
      <h3 className="text-xl font-bold tracking-tight text-foreground">Uh oh</h3>
      <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">{message}</p>
    </div>
    <button
      onClick={onBack}
      className="mt-2 px-6 py-2.5 rounded-xl bg-secondary/80 text-sm font-semibold hover:bg-secondary border border-border/50 transition-all shadow-sm"
    >
      Go back
    </button>
  </div>
);
