"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Set at build time from NEXT_PUBLIC_TURNSTILE_SITE_KEY. If it's not
// configured, the widget is skipped entirely so login still works in
// environments (like local dev) that haven't set up Turnstile yet.
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");

  const widgetContainerRef = useRef(null);
  const widgetIdRef = useRef(null);

  // Load Cloudflare's Turnstile script once and render the widget into
  // widgetContainerRef. Uses the explicit render API (rather than the
  // data-sitekey attribute + global callback) so React re-renders don't
  // fight with Turnstile's own DOM mutations.
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;

    let cancelled = false;

    function renderWidget() {
      if (cancelled || !window.turnstile || !widgetContainerRef.current) return;
      if (widgetIdRef.current !== null) return;
      widgetIdRef.current = window.turnstile.render(widgetContainerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token) => setCaptchaToken(token),
        "expired-callback": () => setCaptchaToken(""),
        "error-callback": () => setCaptchaToken(""),
      });
    }

    if (window.turnstile) {
      renderWidget();
    } else {
      const existing = document.querySelector('script[src*="turnstile/v0/api.js"]');
      if (existing) {
        existing.addEventListener("load", renderWidget);
      } else {
        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        script.async = true;
        script.defer = true;
        script.addEventListener("load", renderWidget);
        document.body.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      if (window.turnstile && widgetIdRef.current !== null) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  function resetCaptcha() {
    setCaptchaToken("");
    if (window.turnstile && widgetIdRef.current !== null) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (TURNSTILE_SITE_KEY && !captchaToken) {
      setError("Please complete the verification challenge.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, captchaToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed.");
        // Turnstile tokens are single-use — get a fresh one for the retry.
        resetCaptcha();
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      resetCaptcha();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-basilica-marbleDark/15 bg-white p-8 shadow-sm">
        <h1 className="font-display text-2xl font-bold text-basilica-marbleBlack">Admin Login</h1>
        <p className="mt-1 text-sm text-basilica-marbleBlack/60">Sign in to manage blog posts.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-basilica-marbleBlack mb-1">Username or Email</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-lg border border-basilica-marbleDark/25 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-basilica-marbleDark"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-basilica-marbleBlack mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-basilica-marbleDark/25 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-basilica-marbleDark"
            />
          </div>

          {TURNSTILE_SITE_KEY && <div ref={widgetContainerRef} />}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading || (Boolean(TURNSTILE_SITE_KEY) && !captchaToken)}
            className="w-full rounded-full bg-basilica-bronze px-4 py-2.5 text-sm font-bold text-white hover:bg-basilica-bronzeDark transition disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
