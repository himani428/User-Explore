import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

type User = {
  id: number;
  name: string;
  email: string;
  username?: string;
  phone?: string;
  website?: string;
  address: { city: string; street?: string; suite?: string; zipcode?: string };
  company?: { name?: string; catchPhrase?: string };
};

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [showFavOnly, setShowFavOnly] = useState<boolean>(false);

  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("ue_favs") || "[]");
    } catch {
      return [];
    }
  });

  const [selected, setSelected] = useState<User | null>(null);

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<User[]>("https://jsonplaceholder.typicode.com/users", {
        timeout: 8000,
      });
      setUsers(res.data || []);
    } catch (err) {
      setError("Failed to load users. Please check your connection and retry.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Persist favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("ue_favs", JSON.stringify(favorites));
    } catch {
      // ignore localStorage errors (e.g., private mode)
    }
  }, [favorites]);

  // Toggle favorite
  const toggleFav = useCallback((id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  // Derived data
  const cities = useMemo(() => Array.from(new Set(users.map((u) => u.address.city))).sort(), [users]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchSearch = !s || u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
      const matchCity = !city || u.address.city === city;
      const matchFav = !showFavOnly || favorites.includes(u.id);
      return matchSearch && matchCity && matchFav;
    });
  }, [users, search, city, showFavOnly, favorites]);

  // Close modal on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelected(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isEmpty = !loading && !error && users.length === 0;
  const noResults = !loading && !error && users.length > 0 && filtered.length === 0;

  // Reset filters (does NOT clear saved favorites)
  const handleReset = () => {
    setSearch("");
    setCity("");
    setShowFavOnly(false);
  };

  return (
    <div>
      {/* Header */}
      <header className="header" role="banner">
        <h1>User Explorer</h1>
        <p className="muted">Discover people, uncover stories, and curate your favorites.</p>
      </header>

      {/* Toolbar */}
      <div className="toolbar" role="region" aria-label="search and filters">
        <input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search by name or email"
        />

        <select value={city} onChange={(e) => setCity(e.target.value)} aria-label="Filter by city">
          <option value="">All Cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button
          onClick={() => setShowFavOnly((p) => !p)}
          className={`view-btn ${showFavOnly ? "opacity-100" : "opacity-70"}`}
          aria-pressed={showFavOnly}
        >
          {showFavOnly ? "★ Showing Favorites" : "☆ Show Favorites"}
        </button>

        <div style={{ minWidth: 140, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ color: "#6b7280", fontSize: 13 }}>
            Favorites: <strong style={{ color: "#111827" }}>{favorites.length}</strong>
          </div>

          <button
            onClick={handleReset}
            className="view-btn"
            style={{ background: "#eef2ff", color: "#111827" }}
            aria-label="Reset filters"
            title="Reset search, city filter and favorites filter"
          >
            Reset
          </button>

          <button
            onClick={() => fetchUsers()}
            className="view-btn"
            style={{ background: "#fff7ed", color: "#92400e" }}
            title="Reload users"
          >
            Reload
          </button>
        </div>
      </div>

      {/* Loading / Error / Empty / No-results */}
      <div style={{ maxWidth: 1200, margin: "18px auto", padding: "0 16px" }}>
        {loading && (
          <div style={{ padding: 48, textAlign: "center" }}>
            <div role="status" aria-live="polite" style={{ display: "inline-flex", gap: 12, alignItems: "center" }}>
              <svg className="animate-spin" width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <circle cx="12" cy="12" r="10" stroke="#e6e9f0" strokeWidth="4"></circle>
                <path d="M22 12a10 10 0 00-10-10" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"></path>
              </svg>
              <div style={{ fontSize: 15, color: "#374151" }}>Loading users…</div>
            </div>
          </div>
        )}

        {error && (
          <div style={{ padding: 24, textAlign: "center" }}>
            <div style={{ color: "#ef4444", fontWeight: 700, marginBottom: 8 }}>{error}</div>
            <button onClick={() => fetchUsers()} className="view-btn" style={{ background: "#fff7f5", color: "#9f1239" }}>
              Retry
            </button>
          </div>
        )}

        {isEmpty && <div style={{ padding: 36, textAlign: "center", color: "#6b7280" }}>No users available from the API.</div>}
        {noResults && <div style={{ padding: 36, textAlign: "center", color: "#6b7280" }}>No users match your search or filters.</div>}
      </div>

      {/* Users grid (when there are results) */}
      {!loading && !error && filtered.length > 0 && (
        <section className="user-grid" role="region" aria-label="User cards">
          <AnimatePresence>
            {filtered.map((u, idx) => (
              <motion.article
                key={u.id}
                className="user-card"
                role="article"
                tabIndex={0}
                initial={{ opacity: 0, y: 12, scale: 0.995 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { delay: idx * 0.045, type: "spring", stiffness: 80, damping: 12 },
                }}
                exit={{ opacity: 0, y: 8, scale: 0.995 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="user-left">
                  <div className="avatar" aria-hidden>
                    {u.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>

                  <div className="user-info">
                    <h3>{u.name}</h3>
                    <div className="email">{u.email}</div>
                    <div className="meta">
                      {u.address.city} • {u.company?.name}
                    </div>
                  </div>
                </div>

                <div className="user-actions">
                  <motion.button
                    aria-label={favorites.includes(u.id) ? "Remove favorite" : "Add favorite"}
                    onClick={() => toggleFav(u.id)}
                    className={`star-btn ${favorites.includes(u.id) ? "active" : ""}`}
                    whileTap={{ scale: 0.86, rotate: favorites.includes(u.id) ? -12 : 12 }}
                    title={favorites.includes(u.id) ? "Remove favorite" : "Add favorite"}
                  >
                    {favorites.includes(u.id) ? (
                      <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        initial={{ scale: 0.92 }}
                        animate={{ scale: 1.0, rotate: [0, 18, -10, 0], transition: { duration: 0.45 } }}
                      >
                        <path fill="#f59e0b" d="M12 .587l3.668 7.429L24 9.748l-6 5.853 1.417 8.262L12 19.771l-7.417 4.092L6 15.601 0 9.748l8.332-1.732z" />
                      </motion.svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#9ca3af" strokeWidth="1.6" viewBox="0 0 24 24" width="20" height="20">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.68 5.165a1 1 0 00.95.69h5.408c.969 0 1.371 1.24.588 1.81l-4.377 3.176a1 1 0 00-.364 1.118l1.68 5.165c.3.921-.755 1.688-1.54 1.118l-4.377-3.176a1 1 0 00-1.175 0l-4.377 3.176c-.784.57-1.838-.197-1.539-1.118l1.68-5.165a1 1 0 00-.364-1.118L2.422 10.59c-.783-.57-.38-1.81.588-1.81h5.408a1 1 0 00.95-.69l1.68-5.165z" />
                      </svg>
                    )}
                  </motion.button>

                  <button onClick={() => setSelected(u)} className="view-btn" aria-label={`View details for ${u.name}`}>
                    View
                  </button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </section>
      )}

      {/* Footer note (updated) */}
      <div className="center-note" style={{ textAlign: "center", marginBottom: 36 }}>
        Your favorite people — remembered automatically in your browser.
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="modal-backdrop"
            onClick={() => setSelected(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${selected.name} details`}
          >
            <motion.div
              className="modal-panel"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.98, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0 }}
            >
              <div className="modal-header">
                <div>
                  <div className="modal-title">{selected.name}</div>
                  <div className="muted" style={{ marginTop: 6 }}>
                    {selected.username} • {selected.email}
                  </div>
                </div>

                <button onClick={() => setSelected(null)} aria-label="Close" className="star-btn" style={{ width: 36, height: 36 }}>
                  ✕
                </button>
              </div>

              <div className="modal-row" style={{ marginTop: 14 }}>
                <div><strong>Company:</strong> {selected.company?.name ?? "N/A"}</div>
                <div style={{ marginTop: 8 }}><strong>City:</strong> {selected.address.city}</div>
                <div style={{ marginTop: 8 }}><strong>Phone:</strong> {selected.phone ?? "N/A"}</div>
                <div style={{ marginTop: 8 }}><strong>Website:</strong> {selected.website ?? "N/A"}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
                <button onClick={() => setSelected(null)} className="view-btn" style={{ background: "#eef2ff", color: "#111827" }}>
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
