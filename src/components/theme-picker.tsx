"use client";

import { useEffect, useRef, useState } from "react";

type Theme = "indigo" | "ocean" | "forest" | "sunset";
const themes: { id: Theme; label: string; color: string }[] = [
  { id: "indigo", label: "Indigo", color: "#4338ca" },
  { id: "ocean", label: "Ocean", color: "#075c9a" },
  { id: "forest", label: "Forest", color: "#176a4a" },
  { id: "sunset", label: "Sunset", color: "#a14919" },
];
const storageKey = "skillsprint-color-theme-v1";

export function ThemePicker() {
  const [theme, setTheme] = useState<Theme>("indigo");
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const stored = window.localStorage.getItem(storageKey);
        if (themes.some((option) => option.id === stored)) {
          const selected = stored as Theme;
          setTheme(selected);
        }
      } catch { /* The default theme works without browser storage. */ }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.skillTheme = theme;
  }, [theme]);

  useEffect(() => {
    if (!open) return;
    function closeOnOutsideClick(event: PointerEvent) {
      if (!pickerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        pickerRef.current?.querySelector<HTMLButtonElement>(".theme-trigger")?.focus();
      }
    }
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  function choose(next: Theme) {
    setTheme(next);
    try { window.localStorage.setItem(storageKey, next); } catch { /* The visible choice still applies this visit. */ }
    setOpen(false);
    pickerRef.current?.querySelector<HTMLButtonElement>(".theme-trigger")?.focus();
  }

  return <div className="theme-picker" ref={pickerRef}>
    <button className="theme-trigger" type="button" aria-label={`Color theme: ${themes.find((item) => item.id === theme)?.label}. Choose color theme`} aria-expanded={open} aria-controls="theme-options" onClick={() => setOpen(!open)}><span className="theme-trigger-icon" aria-hidden="true">◐</span><span>Theme</span></button>
    {open && <div className="theme-popover" id="theme-options" role="group" aria-label="Color themes">
      <p>Choose a color theme</p>
      {themes.map((option) => <button className="theme-option" key={option.id} type="button" aria-pressed={theme === option.id} onClick={() => choose(option.id)}><span className="theme-swatch" style={{ backgroundColor: option.color }} aria-hidden="true" />{option.label}<span className="theme-option-check" aria-hidden="true">{theme === option.id ? "✓" : ""}</span></button>)}
    </div>}
  </div>;
}
