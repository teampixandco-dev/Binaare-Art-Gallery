"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ExpandableDescription({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 250;

  return (
    <div style={{ marginBottom: "2.5rem" }}>
      <div 
        className="section-text" 
        style={{ 
          maxWidth: "36rem",
          position: "relative",
          whiteSpace: "pre-line",
          lineHeight: 1.8,
          fontSize: "1.05rem",
          color: "var(--fg-muted)",
        }}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key="content"
            initial={false}
            animate={{ height: expanded || !isLong ? "auto" : "9rem" }}
            style={{ overflow: "hidden" }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            {text}
          </motion.div>
        </AnimatePresence>
        
        {!expanded && isLong && (
          <div 
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "4rem",
              background: "linear-gradient(transparent, var(--bg))",
              pointerEvents: "none"
            }} 
          />
        )}
      </div>
      
      {isLong && (
        <button 
          onClick={() => setExpanded(!expanded)}
          style={{
            background: "none",
            border: "none",
            color: "var(--accent)",
            fontWeight: 500,
            fontSize: "0.85rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            cursor: "pointer",
            marginTop: "1rem",
            padding: "0.5rem 0",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            transition: "opacity 0.2s"
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.7")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
        >
          {expanded ? "Read Less" : "Read More"}
          <svg 
            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      )}
    </div>
  );
}
