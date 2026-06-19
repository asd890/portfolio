"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("https://formspree.io/f/mqeoryoj", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.errors?.[0]?.message ?? "Submission failed.");
      setStatus("sent");
      setName(""); setEmail(""); setMessage("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const inputClass = "w-full bg-transparent border-b border-[#f5f4f0]/15 py-3 font-[family-name:var(--font-inter)] text-sm text-[#f5f4f0] placeholder-[#f5f4f0]/25 focus:outline-none focus:border-[#f5f4f0]/50 transition-colors duration-200";

  return (
    <section
      ref={ref}
      className="relative px-5 md:px-8 py-40 overflow-hidden"
      style={{ backgroundColor: "#0a0a0a" }}
      data-cursor-theme="dark"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 max-w-6xl">

        {/* Left — headline + direct contact */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#f5f4f0]/30 mb-8"
          >
            Get in Touch
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,6vw,6rem)] leading-[0.95] text-[#f5f4f0] mb-12"
          >
            Let&apos;s build something
            <br />
            <em>meaningful.</em>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="space-y-4"
          >
            <p className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#f5f4f0]/30 mb-5">
              Or reach me directly
            </p>
            {[
              { label: "Email", href: "mailto:admin@ahmednaik.com", text: "admin@ahmednaik.com" },
              { label: "LinkedIn", href: "#", text: "linkedin.com/in/yourname" },
              { label: "Behance", href: "#", text: "behance.net/yourname" },
              { label: "Dribbble", href: "#", text: "dribbble.com/yourname" },
            ].map(({ label, href, text }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="group flex items-center justify-between py-3 border-b border-[#f5f4f0]/10 hover:border-[#f5f4f0]/30 transition-colors duration-300"
              >
                <span className="font-[family-name:var(--font-inter)] text-[0.6rem] tracking-widest uppercase text-[#f5f4f0]/30">
                  {label}
                </span>
                <span className="font-[family-name:var(--font-inter)] text-sm text-[#f5f4f0]/60 group-hover:text-[#f5f4f0] transition-colors duration-300">
                  {text} <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">↗</span>
                </span>
              </a>
            ))}
          </motion.div>
        </div>

        {/* Right — contact form */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <p className="font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#f5f4f0]/30 mb-8">
            Send a message
          </p>

          <AnimatePresence mode="wait">
            {status === "sent" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-4 py-12"
              >
                <p className="font-[family-name:var(--font-playfair)] italic text-[#f5f4f0] text-3xl">
                  Message sent.
                </p>
                <p className="font-[family-name:var(--font-inter)] text-sm text-[#f5f4f0]/40">
                  Thanks for reaching out — I&apos;ll get back to you soon.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="self-start font-[family-name:var(--font-inter)] text-xs tracking-widest uppercase text-[#f5f4f0]/40 hover:text-[#f5f4f0] transition-colors duration-200 mt-4 cursor-none"
                >
                  Send another →
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-8"
              >
                <div>
                  <label className="block font-[family-name:var(--font-inter)] text-[0.6rem] tracking-widest uppercase text-[#f5f4f0]/30 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block font-[family-name:var(--font-inter)] text-[0.6rem] tracking-widest uppercase text-[#f5f4f0]/30 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block font-[family-name:var(--font-inter)] text-[0.6rem] tracking-widest uppercase text-[#f5f4f0]/30 mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Tell me about your project..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {status === "error" && (
                  <p className="font-[family-name:var(--font-inter)] text-xs text-red-400">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="self-start group flex items-center gap-3 font-[family-name:var(--font-inter)] text-sm tracking-widest uppercase text-[#0a0a0a] bg-[#f5f4f0] px-8 py-4 rounded-full hover:bg-[#f5f4f0]/80 disabled:opacity-50 transition-all duration-300 cursor-none"
                >
                  <span>{status === "sending" ? "Sending…" : "Send message"}</span>
                  {status !== "sending" && (
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Decorative text */}
      <div className="absolute bottom-0 right-8 pointer-events-none select-none overflow-hidden">
        <p className="font-[family-name:var(--font-playfair)] italic text-[clamp(4rem,14vw,16rem)] text-[#f5f4f0]/[0.04] leading-none">
          Hello
        </p>
      </div>
    </section>
  );
}
