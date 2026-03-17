// src/components/BentoCard.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { mediaUrl } from "../lib/media";

export default function BentoCard({ title, subtitle, to, photo }) {
  const bg = mediaUrl(photo);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="group"
    >
      <Link
        to={to}
        className={[
          "relative block overflow-hidden rounded-3xl",
          "border border-zinc-200/70 dark:border-zinc-800/70",
          "bg-white/60 dark:bg-zinc-900/40 backdrop-blur",
          "shadow-[0_10px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.35)]",
          "transition",
        ].join(" ")}
      >
        {/* cover */}
        <div className="relative h-44">
          {bg ? (
            <>
              <div
                className="absolute inset-0 bg-center bg-cover"
                style={{ backgroundImage: `url("${bg}")` }}
              />
              {/* soft overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-200/70 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800" />
          )}

          {/* “shine” */}
          <div className="absolute -inset-20 opacity-0 group-hover:opacity-100 transition duration-500">
            <div className="absolute inset-0 rotate-12 bg-gradient-to-r from-transparent via-white/25 to-transparent blur-2xl" />
          </div>

          {/* chip */}
          <div className="absolute top-3 left-3 inline-flex items-center gap-2 rounded-2xl px-3 py-1.5 text-xs font-medium
                          bg-white/70 text-zinc-900 border border-white/40
                          dark:bg-zinc-950/60 dark:text-zinc-100 dark:border-zinc-800/60">
            Premium
            <span className="opacity-60">•</span>
            Catalog
          </div>
        </div>

        {/* body */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-lg font-semibold tracking-tight">{title}</div>
              <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                {subtitle}
              </div>
            </div>

            <div className="shrink-0 inline-flex items-center justify-center rounded-2xl px-3 py-2 text-sm
                            border border-zinc-200 dark:border-zinc-800
                            bg-white/60 dark:bg-zinc-950/30">
              →
            </div>
          </div>

          <div className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
            Открыть каталог
            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
