"use client";

import { useState } from "react";
import Icon from "@/components/Icon";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    // No email backend is wired up yet — this simply confirms the signup
    // visually. Connect this to your email provider (Mailchimp, Klaviyo, etc.)
    // when you're ready to start collecting real subscribers.
    setSubmitted(true);
    setEmail("");
  }

  return (
    <div className="rounded-2xl border border-basilica-marbleDark/15 bg-basilica-marble p-6">
      <h2 className="font-display text-lg font-bold text-basilica-marbleBlack">Park Güell Trip Tips</h2>
      <p className="mt-2 text-sm text-basilica-marbleBlack/70">
        Get ticket price alerts, crowd-timing tips, and new guides straight to your inbox.
      </p>

      {submitted ? (
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-basilica-marbleBlack">
          <Icon name="check" className="h-4 w-4 shrink-0 text-basilica-bronze" />
          You're on the list — thanks for subscribing!
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-full border border-basilica-marbleDark/25 bg-white px-4 py-2.5 text-sm text-basilica-marbleBlack placeholder:text-basilica-marbleBlack/40 focus:outline-none focus:ring-2 focus:ring-basilica-marbleDark/40"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-basilica-bronze px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-basilica-bronzeDark transition"
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}
