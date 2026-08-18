"use client";

import { useState } from "react";
import { ADMIN_PAGES } from "@/lib/admin-pages";
import { PASSWORD_HINT, getPasswordError } from "@/lib/password-policy";

export default function UserManagement({ initialUsers, currentUser }) {
  const [users, setUsers] = useState(initialUsers);
  const isAdmin = currentUser.role === "admin";

  const [showCreate, setShowCreate] = useState(false);
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createRole, setCreateRole] = useState("editor");
  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editPassword, setEditPassword] = useState("");
  const [editRole, setEditRole] = useState("editor");
  const [editError, setEditError] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  // Page-access popup — opens automatically right after a new (non-admin)
  // user is created, and can also be reopened later via the "Access" action.
  const [permUser, setPermUser] = useState(null);
  const [permSelected, setPermSelected] = useState([]);
  const [permError, setPermError] = useState("");
  const [permSaving, setPermSaving] = useState(false);

  function openPermissions(user) {
    setPermUser(user);
    setPermSelected(Array.isArray(user.permissions) ? user.permissions : []);
    setPermError("");
  }

  function closePermissions() {
    setPermUser(null);
    setPermError("");
  }

  function togglePermKey(key) {
    setPermSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  async function handleSavePermissions() {
    if (!permUser) return;
    setPermError("");
    setPermSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${permUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissions: permSelected }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPermError(data.error || "Failed to save page access.");
        return;
      }
      setUsers((prev) => prev.map((u) => (u.id === permUser.id ? data.user : u)));
      setPermUser(null);
    } catch {
      setPermError("Something went wrong. Please try again.");
    } finally {
      setPermSaving(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setCreateError("");

    const passwordError = getPasswordError(createPassword);
    if (passwordError) {
      setCreateError(passwordError);
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: createEmail, password: createPassword, role: createRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error || "Failed to create user.");
        return;
      }
      setUsers((prev) => [...prev, data.user]);
      setCreateEmail("");
      setCreatePassword("");
      setCreateRole("editor");
      setShowCreate(false);

      // Editors start with no page access — immediately prompt for it.
      // Admins always have full access, so there's nothing to grant.
      if (data.user.role !== "admin") {
        openPermissions(data.user);
      }
    } catch {
      setCreateError("Something went wrong. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  function startEdit(user) {
    setEditingId(user.id);
    setEditPassword("");
    setEditRole(user.role || "editor");
    setEditError("");
  }

  async function handleSaveEdit(user) {
    setEditError("");

    if (editPassword) {
      const passwordError = getPasswordError(editPassword);
      if (passwordError) {
        setEditError(passwordError);
        return;
      }
    }

    setSavingEdit(true);
    try {
      const payload = {};
      if (editPassword) payload.password = editPassword;
      // Admins can change other users' roles, but never their own — avoids
      // an admin accidentally demoting/locking themselves out mid-edit.
      if (isAdmin && user.id !== currentUser.id) payload.role = editRole;
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setEditError(data.error || "Failed to update user.");
        return;
      }
      setUsers((prev) => prev.map((u) => (u.id === user.id ? data.user : u)));
      setEditingId(null);
    } catch {
      setEditError("Something went wrong. Please try again.");
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDelete(user) {
    const label = user.email || user.username;
    if (!window.confirm(`Delete ${label}? This can't be undone.`)) return;

    setDeleteError("");
    setDeletingId(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setDeleteError(data.error || "Failed to delete user.");
        return;
      }
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch {
      setDeleteError("Something went wrong. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      {isAdmin && (
        <div className="mb-6">
          {!showCreate ? (
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center rounded-full bg-basilica-bronze px-5 py-2 text-sm font-bold text-white hover:bg-basilica-bronzeDark transition"
            >
              + New User
            </button>
          ) : (
            <form onSubmit={handleCreate} className="max-w-md rounded-2xl border border-basilica-marbleDark/15 bg-white p-5 space-y-4">
              <h2 className="font-display text-base font-bold text-basilica-marbleBlack">Create User</h2>

              <div>
                <label className="block text-sm font-medium text-basilica-marbleBlack mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                  className="w-full rounded-lg border border-basilica-marbleDark/25 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-basilica-marbleDark"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-basilica-marbleBlack mb-1">Password</label>
                <input
                  type="password"
                  required
                  minLength={9}
                  value={createPassword}
                  onChange={(e) => setCreatePassword(e.target.value)}
                  className="w-full rounded-lg border border-basilica-marbleDark/25 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-basilica-marbleDark"
                />
                <p className="mt-1 text-[11px] text-basilica-marbleBlack/40">{PASSWORD_HINT}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-basilica-marbleBlack mb-1">Role</label>
                <select
                  value={createRole}
                  onChange={(e) => setCreateRole(e.target.value)}
                  className="rounded-lg border border-basilica-marbleDark/25 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-basilica-marbleDark"
                >
                  <option value="editor">Editor — view &amp; edit content</option>
                  <option value="admin">Admin — full access</option>
                </select>
                <p className="mt-1 text-[11px] text-basilica-marbleBlack/40">
                  For Editors, you'll be asked which pages to grant access to right after creating them.
                </p>
              </div>

              {createError && <p className="text-sm text-red-600">{createError}</p>}

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={creating}
                  className="inline-flex items-center rounded-full bg-basilica-bronze px-5 py-2 text-sm font-bold text-white hover:bg-basilica-bronzeDark transition disabled:opacity-60"
                >
                  {creating ? "Creating…" : "Create User"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="text-sm font-semibold text-basilica-marbleBlack/60 hover:text-basilica-marbleBlack"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {deleteError && <p className="mb-4 text-sm text-red-600">{deleteError}</p>}

      <div className="overflow-x-auto rounded-2xl border border-basilica-marbleDark/15 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-basilica-marbleDark/15 text-left text-basilica-marbleBlack/60">
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Added</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const canEdit = isAdmin || user.id === currentUser.id;
              const isEditing = editingId === user.id;
              const isSelf = user.id === currentUser.id;
              return (
                <tr key={user.id} className="border-b border-basilica-marbleDark/10 last:border-0 align-top">
                  <td className="px-4 py-3 font-medium text-basilica-marbleBlack">
                    {user.email || user.username}
                    {user.id === currentUser.id && (
                      <span className="ml-2 inline-flex rounded-full bg-basilica-marbleDark/10 text-basilica-marbleBlack px-2.5 py-0.5 text-xs font-semibold">
                        You
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing && isAdmin && !isSelf ? (
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="rounded-lg border border-basilica-marbleDark/25 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-basilica-marbleDark"
                      >
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : isEditing && isSelf ? (
                      <span className="inline-flex rounded-full bg-basilica-bronze/10 text-basilica-bronze px-2.5 py-0.5 text-xs font-semibold">
                        {user.role === "admin" ? "Admin" : "Editor"}
                      </span>
                    ) : (
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          user.role === "admin" ? "bg-basilica-bronze/10 text-basilica-bronze" : "bg-basilica-marbleDark/10 text-basilica-marbleBlack"
                        }`}
                      >
                        {user.role === "admin" ? "Admin" : "Editor"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-basilica-marbleBlack/60">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <div className="flex flex-col items-end gap-2">
                        <input
                          type="password"
                          placeholder="New password (optional)"
                          minLength={9}
                          value={editPassword}
                          onChange={(e) => setEditPassword(e.target.value)}
                          className="w-48 rounded-lg border border-basilica-marbleDark/25 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-basilica-marbleDark"
                        />
                        {editPassword && !editError && (
                          <p className="w-48 text-[11px] text-basilica-marbleBlack/40">{PASSWORD_HINT}</p>
                        )}
                        {editError && <p className="w-48 text-xs text-red-600">{editError}</p>}
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            disabled={savingEdit}
                            onClick={() => handleSaveEdit(user)}
                            className="text-xs font-semibold text-basilica-marbleDark hover:text-basilica-marbleBlack disabled:opacity-60"
                          >
                            {savingEdit ? "Saving…" : "Save"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="text-xs font-semibold text-basilica-marbleBlack/50 hover:text-basilica-marbleBlack"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-4">
                        {canEdit && (
                          <button
                            type="button"
                            onClick={() => startEdit(user)}
                            className="text-sm font-semibold text-basilica-marbleDark hover:text-basilica-marbleBlack"
                          >
                            Edit
                          </button>
                        )}
                        {isAdmin && user.role !== "admin" && (
                          <button
                            type="button"
                            onClick={() => openPermissions(user)}
                            className="text-sm font-semibold text-basilica-marbleBlack/70 hover:text-basilica-marbleBlack"
                          >
                            Access
                          </button>
                        )}
                        {isAdmin && user.id !== currentUser.id && (
                          <button
                            type="button"
                            onClick={() => handleDelete(user)}
                            disabled={deletingId === user.id}
                            className="text-sm font-semibold text-red-500 hover:text-red-700 disabled:opacity-60"
                          >
                            {deletingId === user.id ? "Deleting…" : "Delete"}
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {permUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={closePermissions} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="font-display text-lg font-bold text-basilica-marbleBlack">Page Access</h2>
            <p className="mt-1 text-sm text-basilica-marbleBlack/60">
              Choose which admin pages{" "}
              <strong className="text-basilica-marbleBlack">{permUser.email || permUser.username}</strong> can view and
              edit.
            </p>

            <div className="mt-5 flex flex-col gap-3">
              {ADMIN_PAGES.map((page) => (
                <label
                  key={page.key}
                  className="flex items-start gap-3 rounded-xl border border-basilica-marbleDark/15 p-3 cursor-pointer hover:bg-basilica-marbleDark/5 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={permSelected.includes(page.key)}
                    onChange={() => togglePermKey(page.key)}
                    className="mt-0.5 h-4 w-4 rounded border-basilica-marbleDark/40"
                  />
                  <div>
                    <div className="text-sm font-semibold text-basilica-marbleBlack">{page.label}</div>
                    <div className="text-xs text-basilica-marbleBlack/60">{page.description}</div>
                  </div>
                </label>
              ))}
            </div>

            {permError && <p className="mt-3 text-sm text-red-600">{permError}</p>}

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                disabled={permSaving}
                onClick={handleSavePermissions}
                className="inline-flex items-center rounded-full bg-basilica-bronze px-6 py-2.5 text-sm font-bold text-white hover:bg-basilica-bronzeDark transition disabled:opacity-60"
              >
                {permSaving ? "Saving…" : "Save Access"}
              </button>
              <button
                type="button"
                onClick={closePermissions}
                className="text-sm font-semibold text-basilica-marbleBlack/60 hover:text-basilica-marbleBlack"
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
