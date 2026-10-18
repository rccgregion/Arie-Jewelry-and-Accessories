import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Server, 
  RefreshCw,
  Eye,
  EyeOff,
  Database,
  Copy,
  Check,
  ExternalLink,
  UploadCloud
} from 'lucide-react';
import { AuditLogEntry } from '../../types/admin';
import { adminFetch } from '../../utils/adminAuth';

export const AdminSettings: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Supabase State
  const [supabaseStatus, setSupabaseStatus] = useState<any>(null);
  const [isCheckingSupabase, setIsCheckingSupabase] = useState(false);
  const [isSyncingSupabase, setIsSyncingSupabase] = useState(false);
  const [supabaseSyncMessage, setSupabaseSyncMessage] = useState<string | null>(null);
  const [isCopiedSchema, setIsCopiedSchema] = useState(false);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);

  const fetchSupabaseStatus = async () => {
    setIsCheckingSupabase(true);
    try {
      const res = await adminFetch('/api/admin/supabase-status');
      const data = await res.json();
      if (data.success) {
        setSupabaseStatus(data.status);
      }
    } catch (err) {
      console.error('Failed to fetch Supabase status:', err);
    } finally {
      setIsCheckingSupabase(false);
    }
  };

  const handleSyncSupabase = async () => {
    setIsSyncingSupabase(true);
    setSupabaseSyncMessage(null);
    try {
      const res = await adminFetch('/api/admin/supabase-sync', { method: 'POST' });
      const data = await res.json();
      setSupabaseSyncMessage(data.message || (data.success ? 'Sync completed successfully!' : 'Sync failed.'));
      fetchSupabaseStatus();
    } catch (err: any) {
      setSupabaseSyncMessage('Network error triggering Supabase sync.');
    } finally {
      setIsSyncingSupabase(false);
    }
  };

  const handleCopySchema = async () => {
    try {
      const res = await fetch('/api/supabase-schema.sql');
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setIsCopiedSchema(true);
      setTimeout(() => setIsCopiedSchema(false), 3000);
    } catch (err) {
      console.error('Failed to copy schema:', err);
    }
  };

  const fetchLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const res = await adminFetch('/api/admin/audit-logs');
      const data = await res.json();
      if (data.success) {
        setAuditLogs(data.logs);
      }
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchSupabaseStatus();
  }, []);

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(null);
    setPasswordError(null);

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    if (newPassword.length < 10) {
      setPasswordError('Password must be at least 10 characters long.');
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setPasswordError('Password must contain at least one uppercase letter.');
      return;
    }
    if (!/[a-z]/.test(newPassword)) {
      setPasswordError('Password must contain at least one lowercase letter.');
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      setPasswordError('Password must contain at least one digit.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await adminFetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error || 'Failed to change password.');
      } else {
        setPasswordSuccess('Password successfully updated with Bcrypt cost factor 12.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        fetchLogs();
      }
    } catch (err) {
      setPasswordError('Network error changing password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div className="pb-2 border-b border-stone-200 dark:border-stone-800">
        <h1 className="font-cinzel text-xl sm:text-2xl font-bold text-stone-900 dark:text-[#f5f2eb] tracking-wide">
          SECURITY &amp; ADMIN SETTINGS
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          Manage credentials, view real-time security audit trails, and review compliance status
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Change Password */}
        <div className="bg-white dark:bg-[#121110] border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <KeyRound className="w-5 h-5 text-[#d4af37]" />
            <h2 className="font-cinzel text-sm font-bold tracking-wider text-stone-900 dark:text-[#f5f2eb]">
              CHANGE ADMIN PASSWORD
            </h2>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-6">
            Requires your current password and enforces strict password policy (10+ characters with mixed case and digits).
          </p>

          {passwordSuccess && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleChangePasswordSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-cinzel uppercase mb-1">
                Current Password *
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-9 bg-stone-50 dark:bg-black/50 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-white outline-none focus:border-[#d4af37]"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
                >
                  {showCurrent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-cinzel uppercase mb-1">
                New Strong Password *
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-9 bg-stone-50 dark:bg-black/50 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-white outline-none focus:border-[#d4af37]"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
                >
                  {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-cinzel uppercase mb-1">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-black/50 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-white outline-none focus:border-[#d4af37]"
              />
            </div>

            <button
              type="submit"
              disabled={isChangingPassword}
              className="w-full py-2.5 px-4 rounded-lg bg-[#d4af37] hover:bg-[#c5a059] text-black font-cinzel font-bold text-xs uppercase tracking-wider transition disabled:opacity-50"
            >
              {isChangingPassword ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Right Column: Security Hardening Checklist & Status */}
        <div className="lg:col-span-2 bg-white dark:bg-[#121110] border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="font-cinzel text-sm font-bold tracking-wider text-stone-900 dark:text-[#f5f2eb]">
              SECURITY POSTURE &amp; COMPLIANCE
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-stone-50 dark:bg-black/40 border border-stone-200 dark:border-stone-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-900 dark:text-white block">Argon2id / Bcrypt-12 Hashes</span>
                <span className="text-stone-500 text-[11px]">Passphrases never stored in plaintext. Constant-time comparison active.</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-stone-50 dark:bg-black/40 border border-stone-200 dark:border-stone-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-900 dark:text-white block">Brute-Force Lockout Defense</span>
                <span className="text-stone-500 text-[11px]">5 failed attempts per 15 min triggers automatic account/IP freeze.</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-stone-50 dark:bg-black/40 border border-stone-200 dark:border-stone-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-900 dark:text-white block">HttpOnly SameSite Sessions</span>
                <span className="text-stone-500 text-[11px]">30 min idle timeout &amp; 12 hr absolute limit. Protected against XSS leakage.</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-stone-50 dark:bg-black/40 border border-stone-200 dark:border-stone-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-900 dark:text-white block">Server Price Recalculation</span>
                <span className="text-stone-500 text-[11px]">Tamper-proof cart. Ignores client prices and verifies stock on DB.</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-stone-50 dark:bg-black/40 border border-stone-200 dark:border-stone-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-900 dark:text-white block">Magic Bytes Image Upload</span>
                <span className="text-stone-500 text-[11px]">Signed upload, 5MB limit, header byte verification, randomized UUID.</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-stone-50 dark:bg-black/40 border border-stone-200 dark:border-stone-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-900 dark:text-white block">Robots Noindex &amp; CSP Headers</span>
                <span className="text-stone-500 text-[11px]">Admin routes hidden from crawlers with X-Robots-Tag: noindex.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Supabase Database & Table Synchronization Card */}
      <div className="bg-white dark:bg-[#121110] border border-[#d4af37]/30 rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-sm sm:text-base font-bold tracking-wider text-stone-900 dark:text-[#f5f2eb]">
                SUPABASE POSTGRESQL DATABASE &amp; SYNC
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Connected Project: <code className="text-[#d4af37] font-mono text-[11px]">https://ognbnevkisyvlpedyqwd.supabase.co</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchSupabaseStatus}
              disabled={isCheckingSupabase}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 hover:border-[#d4af37] text-xs text-stone-700 dark:text-stone-300 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCheckingSupabase ? 'animate-spin' : ''}`} />
              <span>Check Tables</span>
            </button>
            <a
              href="https://supabase.com/dashboard/project/ognbnevkisyvlpedyqwd/sql/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37]/40 text-xs text-[#d4af37] transition font-medium"
            >
              <span>Open Supabase SQL Editor</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Sync message alert */}
        {supabaseSyncMessage && (
          <div className="p-3.5 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/40 text-[#f5f2eb] text-xs flex items-center justify-between animate-in fade-in">
            <span>{supabaseSyncMessage}</span>
            <button onClick={() => setSupabaseSyncMessage(null)} className="text-stone-400 hover:text-white text-xs">✕</button>
          </div>
        )}

        {/* Status Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { name: 'products', label: 'Products', exists: supabaseStatus?.tables?.products },
            { name: 'admins', label: 'Admins', exists: supabaseStatus?.tables?.admins },
            { name: 'orders', label: 'Orders', exists: supabaseStatus?.tables?.orders },
            { name: 'audit_logs', label: 'Audit Logs', exists: supabaseStatus?.tables?.audit_logs },
            { name: 'site_traffic', label: 'Traffic', exists: supabaseStatus?.tables?.site_traffic },
          ].map(tbl => (
            <div key={tbl.name} className="p-3 rounded-lg bg-stone-50 dark:bg-black/40 border border-stone-200 dark:border-stone-800 text-center">
              <span className="block text-[11px] font-cinzel text-stone-400 uppercase mb-1">{tbl.label}</span>
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                tbl.exists ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              }`}>
                {tbl.exists ? '✓ Active in DB' : '⏳ Pending SQL'}
              </span>
            </div>
          ))}
        </div>

        {/* Setup & Quick Sync Guide */}
        <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 text-xs space-y-3">
          <div className="font-semibold text-stone-900 dark:text-stone-200 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#d4af37] text-black flex items-center justify-center text-[11px] font-bold">!</span>
            <span>Why tables aren't visible in Supabase yet &amp; 2-Minute Setup:</span>
          </div>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            In Supabase PostgreSQL, tables and Row-Level-Security (RLS) policies must be created by executing the SQL schema script in your Supabase project. We have generated the complete, ready-to-run schema file (<code className="text-[#d4af37]">supabase-schema.sql</code>).
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={handleCopySchema}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#d4af37] hover:bg-[#c5a059] text-black font-cinzel font-bold text-xs uppercase tracking-wider transition shadow"
            >
              {isCopiedSchema ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{isCopiedSchema ? 'SQL Schema Copied!' : '1-Click Copy SQL Schema'}</span>
            </button>

            <button
              onClick={handleSyncSupabase}
              disabled={isSyncingSupabase}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-white font-cinzel text-xs uppercase tracking-wider border border-stone-600 transition disabled:opacity-50"
            >
              <UploadCloud className={`w-4 h-4 ${isSyncingSupabase ? 'animate-bounce' : ''}`} />
              <span>{isSyncingSupabase ? 'Syncing...' : 'Sync Products to Supabase'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Audit Trail Table */}
      <div className="bg-white dark:bg-[#121110] border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-cinzel text-sm font-bold tracking-wider text-stone-900 dark:text-[#f5f2eb]">
              SECURITY AUDIT TRAIL LOGS
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Immutable server records of administrative actions, authentication attempts, and data modifications
            </p>
          </div>
          <button
            onClick={fetchLogs}
            className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-500 hover:text-[#d4af37] transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 font-cinzel text-[10px] uppercase">
                <th className="py-2.5 px-3 font-semibold">Timestamp</th>
                <th className="py-2.5 px-3 font-semibold">User</th>
                <th className="py-2.5 px-3 font-semibold">Action</th>
                <th className="py-2.5 px-3 font-semibold">IP Address</th>
                <th className="py-2.5 px-3 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 font-mono text-[11px]">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-stone-400">
                    No audit logs recorded yet.
                  </td>
                </tr>
              ) : (
                auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-stone-50/70 dark:hover:bg-white/[0.015] transition">
                    <td className="py-2.5 px-3 text-stone-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('en-GB', {
                        timeZone: 'Africa/Lagos',
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </td>
                    <td className="py-2.5 px-3 text-stone-800 dark:text-stone-200 font-sans font-medium">
                      {log.adminUsername}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        log.action.includes('SUCCESS') || log.action.includes('CREATED') ? 'bg-emerald-500/10 text-emerald-400' :
                        log.action.includes('FAILED') || log.action.includes('BLOCKED') ? 'bg-red-500/10 text-red-400' :
                        'bg-blue-500/10 text-blue-400'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-stone-400">
                      {log.ipAddress}
                    </td>
                    <td className="py-2.5 px-3 text-stone-600 dark:text-stone-300 font-sans">
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
