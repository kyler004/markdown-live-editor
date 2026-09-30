import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { LogOut, KeyRound, User } from "lucide-react";
import type { PublicUser } from "../api/auth";
import { AuthApiError } from "../api/auth";

interface ProfileMenuProps {
  user: PublicUser;
  hasPassword: boolean;
  oauthProviders: string[];
  onSignOut: () => void | Promise<void>;
  onUpdateName: (name: string) => Promise<void>;
  onChangePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
}

export default function ProfileMenu({
  user,
  hasPassword,
  oauthProviders,
  onSignOut,
  onUpdateName,
  onChangePassword,
}: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(user.name);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNameValue(user.name);
  }, [user.name]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setShowPassword(false);
        setEditingName(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const initials =
    user.name
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "?";

  const saveName = async () => {
    const trimmed = nameValue.trim();
    if (!trimmed || trimmed === user.name) {
      setEditingName(false);
      setNameValue(user.name);
      return;
    }
    setBusy(true);
    setError("");
    try {
      await onUpdateName(trimmed);
      setEditingName(false);
    } catch (err) {
      setError(err instanceof AuthApiError ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  };

  const submitPassword = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onChangePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setShowPassword(false);
    } catch (err) {
      setError(err instanceof AuthApiError ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-sm border border-surface-dim px-2 py-0.5 hover:border-neon-dim transition-colors"
        aria-expanded={open}
        aria-haspopup="menu"
        title="Profile"
      >
        {user.image ? (
          <img
            src={user.image}
            alt=""
            className="w-6 h-6 rounded-full object-cover"
          />
        ) : (
          <span className="w-6 h-6 rounded-full bg-neon-dim text-neon text-[0.65rem] font-bold flex items-center justify-center">
            {initials}
          </span>
        )}
        <span className="text-main max-w-[120px] truncate hidden sm:inline">
          {user.name}
        </span>
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed z-[9999] w-72 rounded-lg border border-surface-dim bg-sidebar shadow-2xl overflow-hidden"
            style={{
              top: (btnRef.current?.getBoundingClientRect().bottom ?? 40) + 6,
              right:
                window.innerWidth -
                (btnRef.current?.getBoundingClientRect().right ?? 0),
            }}
            role="menu"
          >
            <div className="px-4 py-3 border-b border-surface-dim flex items-center gap-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
              ) : (
                <span className="w-10 h-10 rounded-full bg-neon-dim text-neon text-sm font-bold flex items-center justify-center shrink-0">
                  {initials}
                </span>
              )}
              <div className="min-w-0">
                <p className="font-semibold text-heading truncate">{user.name}</p>
                <p className="text-xs text-dimmed truncate">{user.email}</p>
              </div>
            </div>

            {oauthProviders.length > 0 && (
              <p className="px-4 py-2 text-[0.65rem] text-inactive font-mono border-b border-surface-dim">
                Linked: {oauthProviders.join(", ")}
              </p>
            )}

            {error && (
              <p className="mx-3 mt-2 text-red-400 text-xs font-mono px-2 py-1.5 rounded border border-red-400/30 bg-red-400/10">
                {error}
              </p>
            )}

            <div className="py-1">
              {editingName ? (
                <div className="px-3 py-2 flex gap-2">
                  <input
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    className="flex-1 bg-input-bg border border-surface-dim text-main rounded-sm py-1 px-2 font-mono text-xs outline-none focus:ring-1 focus:ring-neon-dim"
                    autoFocus
                  />
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void saveName()}
                    className="text-neon text-xs font-mono px-2 hover:underline disabled:opacity-50"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setEditingName(true);
                    setError("");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-main hover:bg-neon-bg hover:text-neon transition-colors"
                >
                  <User size={15} className="text-dimmed shrink-0" />
                  Edit name
                </button>
              )}

              {hasPassword ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowPassword((s) => !s);
                    setError("");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-main hover:bg-neon-bg hover:text-neon transition-colors"
                >
                  <KeyRound size={15} className="text-dimmed shrink-0" />
                  Change password
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setShowPassword((s) => !s);
                    setError("");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-main hover:bg-neon-bg hover:text-neon transition-colors"
                >
                  <KeyRound size={15} className="text-dimmed shrink-0" />
                  Set password
                </button>
              )}
            </div>

            {showPassword && (
              <form
                onSubmit={(e) => void submitPassword(e)}
                className="px-3 pb-3 space-y-2 border-t border-surface-dim pt-2"
              >
                {hasPassword && (
                  <input
                    type="password"
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full bg-input-bg border border-surface-dim text-main rounded-sm py-1.5 px-2 font-mono text-xs outline-none focus:ring-1 focus:ring-neon-dim"
                  />
                )}
                <input
                  type="password"
                  placeholder="New password (8+ chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full bg-input-bg border border-surface-dim text-main rounded-sm py-1.5 px-2 font-mono text-xs outline-none focus:ring-1 focus:ring-neon-dim"
                />
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full py-1.5 rounded-sm bg-neon text-black font-mono text-xs font-semibold uppercase disabled:opacity-50"
                >
                  {busy ? "Saving…" : hasPassword ? "Update password" : "Set password"}
                </button>
              </form>
            )}

            <div className="border-t border-surface-dim">
              <button
                type="button"
                onClick={() => void onSignOut()}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/10 transition-colors"
              >
                <LogOut size={15} className="shrink-0" />
                Sign out
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
