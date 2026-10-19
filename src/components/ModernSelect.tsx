"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  badge?: string;
  description?: string;
}

interface ModernSelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

export default function ModernSelect({
  label,
  placeholder = "Select an option",
  options,
  value,
  onChange,
  error,
  required,
}: ModernSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setIsOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      const currentIndex = options.findIndex((opt) => opt.value === value);
      const nextIndex =
        e.key === "ArrowDown"
          ? (currentIndex + 1) % options.length
          : (currentIndex - 1 + options.length) % options.length;
      onChange(options[nextIndex].value);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
  }

  return (
    <div className="modern-select-container" ref={containerRef}>
      {label && (
        <label htmlFor={id} className="modern-select-label">
          <span>{label}</span>
          {required && <span className="modern-required-star">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          id={id}
          ref={triggerRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          onKeyDown={handleKeyDown}
          className={`modern-select-trigger ${isOpen ? "open" : ""} ${error ? "has-error" : ""}`}
        >
          <div className="modern-select-value">
            {selectedOption ? (
              <div className="flex items-center gap-2.5">
                <span className="modern-select-dot" />
                <span className="modern-select-text font-medium text-foreground">
                  {selectedOption.label}
                </span>
                {selectedOption.badge && (
                  <span className="modern-select-badge">{selectedOption.badge}</span>
                )}
              </div>
            ) : (
              <span className="modern-select-placeholder">{placeholder}</span>
            )}
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="modern-select-chevron"
          >
            <ChevronDown size={18} />
          </motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.ul
              ref={listRef}
              role="listbox"
              initial={{ opacity: 0, y: -6, scale: 0.99 }}
              animate={{ opacity: 1, y: 4, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.99 }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="modern-select-dropdown"
            >
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      triggerRef.current?.focus();
                    }}
                    className={`modern-select-option ${isSelected ? "selected" : ""}`}
                  >
                    <div className="modern-option-content">
                      <div className="flex items-center gap-2">
                        <span className="modern-option-label">{opt.label}</span>
                        {opt.badge && <span className="modern-select-badge">{opt.badge}</span>}
                      </div>
                      {opt.description && (
                        <p className="modern-option-description">{opt.description}</p>
                      )}
                    </div>
                    {isSelected && (
                      <span className="modern-option-check">
                        <Check size={16} />
                      </span>
                    )}
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          className="modern-select-error"
          role="alert"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
