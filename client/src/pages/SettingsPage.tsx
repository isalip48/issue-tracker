// client/src/pages/SettingsPage.tsx
import {
  MdDarkMode,
  MdLightMode,
  MdLogout,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useUIStore } from "../store/uiStore";
import { useAuthStore } from "../store/authStore";
import { SHORTCUT_DEFINITIONS } from "../hooks/useKeyboardShortcuts";

// ── Reusable section wrapper ──────────────────────────────────────────────────
const Section = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div className="bg-card border border-border rounded-xl overflow-hidden">
    <div className="px-6 py-4 border-b border-border">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// ── Setting row ───────────────────────────────────────────────────────────────
const SettingRow = ({
  icon,
  label,
  description,
  action,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  action: React.ReactNode;
}) => (
  <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
    <div className="ml-4 shrink-0">{action}</div>
  </div>
);

// ── Toggle Switch ─────────────────────────────────────────────────────────────
const Toggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => (
  <button
    onClick={onChange}
    className={`
      relative w-11 h-6 rounded-full transition-colors duration-200
      ${checked ? "bg-brand-500" : "bg-secondary border border-border"}
    `}
  >
    <span
      className={`
        absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm
        transition-transform duration-200
        ${checked ? "translate-x-5" : "translate-x-0"}
      `}
    />
  </button>
);

export const SettingsPage = () => {
  const { isDarkMode, toggleDarkMode } = useUIStore();
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-up">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account and application preferences
        </p>
      </div>

      {/* ── Profile Section ─────────────────────────────────────── */}
      <Section title="Profile" description="Your account information">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-full bg-brand-500 text-white flex items-center justify-center text-xl font-bold shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-brand-500/10 text-brand-500 border border-brand-500/20 capitalize">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Appearance Section ───────────────────────────────────── */}
      <Section title="Appearance" description="Customize how IssueTrack looks">
        <SettingRow
          icon={
            isDarkMode ? (
              <MdDarkMode className="text-muted-foreground" size={16} />
            ) : (
              <MdLightMode className="text-muted-foreground" size={16} />
            )
          }
          label="Dark Mode"
          description="Toggle between light and dark theme"
          action={<Toggle checked={isDarkMode} onChange={toggleDarkMode} />}
        />
      </Section>

      {/* ── Keyboard Shortcuts Section ───────────────────────────── */}
      <Section
        title="Keyboard Shortcuts"
        description="Navigate faster with these shortcuts"
      >
        <div className="space-y-0">
          {SHORTCUT_DEFINITIONS.map((shortcut) => (
            <div
              key={shortcut.description}
              className="flex items-center justify-between py-2.5 border-b border-border last:border-0"
            >
              <span className="text-sm text-muted-foreground">
                {shortcut.description}
              </span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key) => (
                  <kbd
                    key={key}
                    className="px-2 py-1 rounded-md text-[11px] font-mono font-medium bg-secondary border border-border text-foreground"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <div className="p-6">
        <SettingRow
          icon={<MdLogout className="text-red-500" size={16} />}
          label="Sign Out"
          description="Sign out of your account on this device"
          action={
            <button
              onClick={handleLogout}
              className="
                  px-4 py-2 rounded-lg text-sm font-medium
                  text-red-500 border border-red-500/30
                  hover:bg-red-500/10 transition-colors
                "
            >
              Sign out
            </button>
          }
        />
      </div>

      {/* Version badge */}
      <div className="flex items-center justify-center pb-4">
        <span className="text-xs text-muted-foreground font-mono">
          FutureForge v1.0.0 · Built with React + Express + MongoDB
        </span>
      </div>
    </div>
  );
};
