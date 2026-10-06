import React, { useState } from 'react';
import {
  User,
  Shield,
  KeyRound,
  CheckCircle,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Phone,
  ShieldCheck,
  UserCheck,
  UserX,
  X,
  Save,
  Sparkles,
  Building,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { StoreService } from '../../services/store';
import { AdminUser } from '../../types';

export const AdminUsersView: React.FC = () => {
  const { adminUsers, currentUser } = useStore();

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // My Account (Self) edit state
  const [myEmail, setMyEmail] = useState(currentUser?.email || '');
  const [myName, setMyName] = useState(currentUser?.name || '');
  const [myPhone, setMyPhone] = useState(currentUser?.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showMyCurrentPass, setShowMyCurrentPass] = useState(false);
  const [showMyNewPass, setShowMyNewPass] = useState(false);
  const [selfFormError, setSelfFormError] = useState('');

  // Add new employee modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newRole, setNewRole] = useState<'Super Admin' | 'Manager' | 'Employee' | 'Sales Agent'>('Employee');
  const [newDept, setNewDept] = useState('Sales & Site Visits');
  const [newPhone, setNewPhone] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [addError, setAddError] = useState('');

  // Edit / Change Password modal for other users
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editPassInput, setEditPassInput] = useState('');
  const [showEditPass, setShowEditPass] = useState(false);
  const [editError, setEditError] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Generate a random secure password
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let res = '';
    for (let i = 0; i < 10; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };

  // 1. Handle updating logged-in admin's own profile / password
  const handleUpdateSelf = (e: React.FormEvent) => {
    e.preventDefault();
    setSelfFormError('');

    if (!currentUser) return;

    if (!myEmail.trim() || !myName.trim()) {
      setSelfFormError('Name and email address are required.');
      return;
    }

    // Verify current password
    if (currentPassword !== currentUser.password) {
      setSelfFormError('Current password is incorrect. Please verify your existing password.');
      return;
    }

    // If new password is provided, validate it
    let updatedPass = currentUser.password;
    if (newPassword.trim()) {
      if (newPassword.trim().length < 6) {
        setSelfFormError('New password must be at least 6 characters long.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setSelfFormError('New password and confirmation password do not match.');
        return;
      }
      updatedPass = newPassword.trim();
    }

    const updatedUser: AdminUser = {
      ...currentUser,
      name: myName.trim(),
      email: myEmail.trim(),
      phone: myPhone.trim(),
      password: updatedPass,
    };

    StoreService.saveAdminUser(updatedUser);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('✓ Your login details and password have been updated successfully!');
  };

  // 2. Handle creating a new authorized employee / admin
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');

    if (!newName.trim() || !newEmail.trim() || !newPass.trim()) {
      setAddError('Full name, email, and initial password are required.');
      return;
    }

    if (newPass.trim().length < 6) {
      setAddError('Password must be at least 6 characters.');
      return;
    }

    // Check if email already exists
    const cleanEmail = newEmail.trim().toLowerCase();
    const existing = adminUsers.find((u) => u.email.trim().toLowerCase() === cleanEmail);
    if (existing) {
      setAddError(`An account with email "${cleanEmail}" already exists.`);
      return;
    }

    const newUser: AdminUser = {
      id: `user-${Date.now()}`,
      name: newName.trim(),
      email: cleanEmail,
      password: newPass.trim(),
      role: newRole,
      department: newDept.trim() || 'General Operations',
      phone: newPhone.trim(),
      status: 'Active',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    StoreService.saveAdminUser(newUser);
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
    setNewPass('');
    setNewPhone('');
    showToast(`✓ New authorized employee "${newUser.name}" added successfully!`);
  };

  // 3. Handle saving edited employee / changing their password
  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    setEditError('');

    if (!editingUser) return;

    if (!editingUser.name.trim() || !editingUser.email.trim()) {
      setEditError('Name and email are required.');
      return;
    }

    let finalPass = editingUser.password;
    if (editPassInput.trim()) {
      if (editPassInput.trim().length < 6) {
        setEditError('New password must be at least 6 characters.');
        return;
      }
      finalPass = editPassInput.trim();
    }

    const updated: AdminUser = {
      ...editingUser,
      password: finalPass,
      email: editingUser.email.trim().toLowerCase(),
    };

    StoreService.saveAdminUser(updated);
    setEditingUser(null);
    setEditPassInput('');
    showToast(`✓ Account details for "${updated.name}" updated successfully!`);
  };

  // 4. Toggle employee active / suspended status
  const handleToggleStatus = (user: AdminUser) => {
    if (user.id === currentUser?.id) {
      alert('You cannot suspend your own active administrator session.');
      return;
    }
    const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    StoreService.saveAdminUser({
      ...user,
      status: newStatus,
    });
    showToast(`Account "${user.name}" status changed to ${newStatus}.`);
  };

  // 5. Delete an authorized account
  const handleDeleteUser = (id: string, name: string) => {
    if (id === currentUser?.id) {
      alert('You cannot delete your own logged-in account.');
      return;
    }

    if (window.confirm(`Are you sure you want to revoke access and delete account for "${name}"? This person will no longer be able to access the admin panel.`)) {
      const res = StoreService.deleteAdminUser(id);
      if (res.success) {
        showToast(res.message);
      } else {
        alert(res.message);
      }
    }
  };

  // Factory reset demo data
  const handleReset = () => {
    if (
      window.confirm(
        'Reset all demo data (projects, gallery, leads, CMS) to initial factory defaults? Default admin logins (velora2026 / employee2026) will be restored.'
      )
    ) {
      StoreService.resetAll();
      showToast('System data and default accounts restored.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-[#00291E] border-2 border-[#C9A24A] text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-[#C9A24A] shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-serif text-2xl text-[#00291E]">Admin Users & Security</h2>
            <span className="bg-[#00291E] text-[#C9A24A] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#C9A24A]/40">
              Access Control
            </span>
          </div>
          <p className="text-xs text-[#26342D]/70 font-light mt-0.5">
            Configure passwords, change login credentials, and manage authorized employee accounts so only you or your staff can access the admin panel.
          </p>
        </div>

        <button
          onClick={() => {
            setShowAddModal(true);
            setNewPass(generateRandomPassword());
            setAddError('');
          }}
          className="bg-gradient-to-r from-[#C9A24A] via-[#DDB75C] to-[#C9A24A] hover:brightness-105 active:scale-[0.98] text-[#00291E] font-bold text-xs tracking-wider uppercase px-4 py-2.5 rounded shadow flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee / Admin</span>
        </button>
      </div>

      {/* SECTION 1: MY ACCOUNT LOGIN & PASSWORD SETTINGS */}
      <div className="bg-[#FFF8E7] rounded-xl p-6 border-2 border-[#C9A24A]/40 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#C9A24A]/20 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#00291E] text-[#C9A24A] font-bold text-sm flex items-center justify-center shadow">
              {currentUser?.name
                ? currentUser.name
                    .split(' ')
                    .filter(Boolean)
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()
                : 'ME'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg text-[#00291E] font-medium">
                  My Login Credentials & Password
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#C9A24A] text-[#00291E] uppercase">
                  {currentUser?.role || 'Super Admin'}
                </span>
              </div>
              <p className="text-xs text-[#26342D]/60 font-light">
                Logged in as <strong className="text-[#00291E]">{currentUser?.email}</strong>
              </p>
            </div>
          </div>

          <span className="text-[11px] text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full font-medium flex items-center gap-1 self-start sm:self-auto">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Active Session Verified
          </span>
        </div>

        {selfFormError && (
          <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{selfFormError}</span>
          </div>
        )}

        <form onSubmit={handleUpdateSelf} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[#00291E] font-semibold mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                required
                value={myName}
                onChange={(e) => setMyName(e.target.value)}
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/40 focus:border-[#00291E] rounded px-3 py-2 text-[#00291E] outline-none"
              />
            </div>

            <div>
              <label className="block text-[#00291E] font-semibold mb-1">
                Login Email Address (Login ID) *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#C9A24A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={myEmail}
                  onChange={(e) => setMyEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#F8F0D8] border border-[#C9A24A]/40 focus:border-[#00291E] rounded text-[#00291E] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#00291E] font-semibold mb-1">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#C9A24A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={myPhone}
                  onChange={(e) => setMyPhone(e.target.value)}
                  placeholder="+91 93221 33592"
                  className="w-full pl-9 pr-3 py-2 bg-[#F8F0D8] border border-[#C9A24A]/40 focus:border-[#00291E] rounded text-[#00291E] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#F8F0D8] rounded-xl border border-[#C9A24A]/30 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00291E] flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-[#C9A24A]" />
              Change Login Password
            </span>
            <p className="text-[11px] text-[#26342D]/70 font-light">
              Enter your current password to authorize changes. If you leave New Password blank, only your name and email will be updated.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="block text-[#00291E] font-semibold mb-1">
                  Current Password *
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-[#C9A24A] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showMyCurrentPass ? 'text' : 'password'}
                    required
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 bg-white border border-[#C9A24A]/40 focus:border-[#00291E] rounded text-[#00291E] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMyCurrentPass(!showMyCurrentPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                  >
                    {showMyCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#00291E] font-semibold mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-[#C9A24A] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showMyNewPass ? 'text' : 'password'}
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 bg-white border border-[#C9A24A]/40 focus:border-[#00291E] rounded text-[#00291E] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMyNewPass(!showMyNewPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                  >
                    {showMyNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#00291E] font-semibold mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-[#C9A24A] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#C9A24A]/40 focus:border-[#00291E] rounded text-[#00291E] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="bg-[#00291E] hover:bg-[#003D2B] text-white font-semibold text-xs uppercase tracking-wider px-6 py-2.5 rounded shadow transition-all flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5 text-[#C9A24A]" />
              <span>Update My Login Details & Password</span>
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 2: AUTHORIZED EMPLOYEES & ADMINISTRATOR ACCOUNTS */}
      <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/30 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#C9A24A]/20 pb-3">
          <div>
            <h3 className="font-serif text-lg text-[#00291E] font-medium flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#C9A24A]" />
              <span>Authorized Team & Employee Accounts ({adminUsers.length})</span>
            </h3>
            <p className="text-xs text-[#26342D]/70 font-light mt-0.5">
              Only personnel listed here with "Active" status can access the admin panel. You can change their passwords or suspend their login at any time.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {adminUsers.map((user) => {
            const isSelf = user.id === currentUser?.id;
            const initials = user.name
              ? user.name
                  .split(' ')
                  .filter(Boolean)
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()
              : 'US';

            return (
              <div
                key={user.id}
                className={`p-5 rounded-xl border transition-all ${
                  user.status === 'Suspended'
                    ? 'bg-red-50/50 border-red-200 opacity-75'
                    : isSelf
                    ? 'bg-[#F8F0D8] border-[#C9A24A] shadow-sm'
                    : 'bg-[#FFFDF7] border-[#C9A24A]/25'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                        user.role === 'Super Admin'
                          ? 'bg-[#00291E] text-[#C9A24A]'
                          : 'bg-[#C9A24A] text-[#00291E]'
                      }`}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-serif text-sm font-semibold text-[#00291E] truncate">
                          {user.name}
                        </span>
                        {isSelf && (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-1.5 py-0.2 rounded">
                            You
                          </span>
                        )}
                        <span
                          className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            user.role === 'Super Admin'
                              ? 'bg-[#00291E] text-[#C9A24A]'
                              : 'bg-[#C9A24A]/20 text-[#00291E] border border-[#C9A24A]/40'
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>
                      <p className="text-xs text-[#00291E] font-mono truncate mt-0.5">{user.email}</p>
                      {user.department && (
                        <p className="text-[10px] text-[#26342D]/60 flex items-center gap-1 mt-0.5">
                          <Building className="w-3 h-3 text-[#C9A24A]" />
                          <span>{user.department}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${
                      user.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-red-100 text-red-800 border border-red-300'
                    }`}
                  >
                    {user.status === 'Active' ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                    <span>{user.status}</span>
                  </span>
                </div>

                {/* Password & Credentials line */}
                <div className="mt-4 pt-3 border-t border-[#C9A24A]/15 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#26342D]/70 font-mono text-[11px]">
                    <Lock className="w-3.5 h-3.5 text-[#C9A24A]" />
                    <span>Password:</span>
                    <span className="bg-black/5 px-2 py-0.5 rounded text-[#00291E] font-mono tracking-widest">
                      ••••••••
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingUser(JSON.parse(JSON.stringify(user)));
                        setEditPassInput('');
                        setEditError('');
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-[#F8F0D8] border border-[#C9A24A]/40 text-[#00291E] rounded text-[11px] font-semibold flex items-center gap-1 transition-colors"
                      title="Change password or login details for this user"
                    >
                      <KeyRound className="w-3 h-3 text-[#C9A24A]" />
                      <span>Change Password</span>
                    </button>

                    {!isSelf && (
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(user)}
                        className={`px-2 py-1 rounded text-[11px] border font-medium transition-colors ${
                          user.status === 'Active'
                            ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900'
                            : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-900'
                        }`}
                        title={user.status === 'Active' ? 'Suspend access' : 'Activate access'}
                      >
                        {user.status === 'Active' ? 'Suspend' : 'Activate'}
                      </button>
                    )}

                    {!isSelf && !user.isOwner && (
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        className="p-1 hover:bg-red-100 text-red-700 rounded transition-colors"
                        title="Remove user"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-2 text-[10px] text-[#26342D]/50 flex items-center justify-between">
                  <span>Created: {user.createdAt}</span>
                  <span>Last login: {user.lastLogin || 'Never'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: SECURITY POLICY & ACCESS CONTROLS INFO */}
      <div className="bg-[#001D15] rounded-xl p-6 text-white border border-[#C9A24A]/30 space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#C9A24A]" />
          <h3 className="font-serif text-base text-[#F8F0D8]">Access Security & Portal Rules</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-white/80 font-light pt-1">
          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <span className="font-semibold text-[#C9A24A] block mb-1">Strict Credentials Guard</span>
            <p className="text-[11px] leading-relaxed text-white/70">
              Only employees or administrators whose email addresses and passwords are registered in this tab can sign in to the portal.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <span className="font-semibold text-[#C9A24A] block mb-1">Instant Session Termination</span>
            <p className="text-[11px] leading-relaxed text-white/70">
              Setting any user account to "Suspended" immediately prevents them from logging in, ideal when an employee leaves or changes role.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <span className="font-semibold text-[#C9A24A] block mb-1">Independent Passwords</span>
            <p className="text-[11px] leading-relaxed text-white/70">
              Each team member has their own separate password. The Super Admin can reset or reassign employee passwords anytime.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 4: SYSTEM RESET SECTION */}
      <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/25 shadow-sm space-y-3">
        <h3 className="font-serif text-lg text-[#00291E] font-medium border-b border-[#C9A24A]/20 pb-2 flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-[#C9A24A]" />
          <span>Database & Factory State Reset</span>
        </h3>

        <p className="text-xs text-[#26342D]/80 leading-relaxed font-light">
          If you need to restore all showcase projects (Amrutvan, Green Opulence), gallery photos, lead inquiries, and default logins to the factory state, click below:
        </p>

        <div>
          <button
            onClick={handleReset}
            className="px-5 py-2.5 bg-[#00291E] hover:bg-[#003D2B] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#C9A24A]" />
            <span>Reset Demo Data to Factory Defaults</span>
          </button>
        </div>
      </div>

      {/* MODAL 1: ADD NEW EMPLOYEE / ADMIN */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#001D15] text-white rounded-2xl max-w-lg w-full border border-[#C9A24A]/40 shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-serif text-lg text-[#F8F0D8]">Add Authorized Employee / Admin</h3>
                <p className="text-[11px] text-white/60">
                  Create credentials for a team member to access the admin panel.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addError && (
              <div className="p-3 bg-red-950/80 border border-red-500/40 text-red-200 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{addError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/80 font-semibold mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kulkarni"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#00291E] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-white/80 font-semibold mb-1">
                  Employee Login Email (Login ID) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ramesh@veloradevelopers.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-[#00291E] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-white/80 font-semibold">
                    Login Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewPass(generateRandomPassword())}
                    className="text-[10px] text-[#C9A24A] hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate Strong Password</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    placeholder="Enter password (min 6 characters)"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full bg-[#00291E] border border-white/20 focus:border-[#C9A24A] rounded pl-3 pr-9 py-2 text-white outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/80 font-semibold mb-1">
                    Role & Permissions
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full bg-[#00291E] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                  >
                    <option value="Employee">Employee (Standard Access)</option>
                    <option value="Sales Agent">Sales Agent (Leads & Site Visits)</option>
                    <option value="Manager">Manager (Projects & Content)</option>
                    <option value="Super Admin">Super Admin (Full Access)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 font-semibold mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sales, Site Office, Marketing"
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full bg-[#00291E] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 font-semibold mb-1">
                  Contact Phone (Optional)
                </label>
                <input
                  type="text"
                  placeholder="+91 ..."
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-[#00291E] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#C9A24A] via-[#DDB75C] to-[#C9A24A] text-[#00291E] font-bold rounded uppercase tracking-wider shadow hover:brightness-105"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT EMPLOYEE / CHANGE PASSWORD */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#001D15] text-white rounded-2xl max-w-lg w-full border border-[#C9A24A]/40 shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-serif text-lg text-[#F8F0D8]">
                  Edit Login Details for {editingUser.name}
                </h3>
                <p className="text-[11px] text-white/60">
                  Update employee password, email address, role, or access status.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="p-3 bg-red-950/80 border border-red-500/40 text-red-200 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEditUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/80 font-semibold mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full bg-[#00291E] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-white/80 font-semibold mb-1">
                  Login Email Address
                </label>
                <input
                  type="email"
                  required
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full bg-[#00291E] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                />
              </div>

              {/* Password change box */}
              <div className="p-3.5 bg-[#00291E] rounded-lg border border-[#C9A24A]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-white/90 font-semibold flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#C9A24A]" />
                    <span>Set New Password</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditPassInput(generateRandomPassword())}
                    className="text-[10px] text-[#C9A24A] hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate Password</span>
                  </button>
                </div>
                <p className="text-[10px] text-white/60">
                  Leave blank to keep existing password, or enter a new password below:
                </p>

                <div className="relative">
                  <input
                    type={showEditPass ? 'text' : 'password'}
                    placeholder="Enter new password (optional)"
                    value={editPassInput}
                    onChange={(e) => setEditPassInput(e.target.value)}
                    className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded pl-3 pr-9 py-2 text-white outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPass(!showEditPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    {showEditPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/80 font-semibold mb-1">
                    Role
                  </label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                    className="w-full bg-[#00291E] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                  >
                    <option value="Employee">Employee</option>
                    <option value="Sales Agent">Sales Agent</option>
                    <option value="Manager">Manager</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 font-semibold mb-1">
                    Status
                  </label>
                  <select
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as any })}
                    className="w-full bg-[#00291E] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                  >
                    <option value="Active">Active (Can Log In)</option>
                    <option value="Suspended">Suspended (Blocked)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/80 font-semibold mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={editingUser.department || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                  className="w-full bg-[#00291E] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#C9A24A] via-[#DDB75C] to-[#C9A24A] text-[#00291E] font-bold rounded uppercase tracking-wider shadow hover:brightness-105"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
