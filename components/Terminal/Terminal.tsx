"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTerminalStore } from "@/store/terminalStore";
import { useNavigationStore } from "@/store/navigationStore";
import styles from "./Terminal.module.css";

interface HistoryItem {
  command: string;
  output: React.ReactNode;
}

const NAVIGABLE_SECTIONS = [
  { id: "about" as const, name: "about/" },
  { id: "skills-certs" as const, name: "skills-certs/" },
  { id: "projects" as const, name: "projects/" },
  { id: "experience" as const, name: "experience/" },
  { id: "domains" as const, name: "domains/" },
];

export default function Terminal() {
  const isOpen = useTerminalStore((state) => state.isOpen);
  const setOpen = useTerminalStore((state) => state.setOpen);
  const setCurrentSection = useNavigationStore((state) => state.setCurrentSection);
  const setProgrammatic = useNavigationStore((state) => state.setProgrammatic);

  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 600, height: 380 });
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Enable client-side portal rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      // Determine default spawn from trigger element if present
      const trigger = document.getElementById("terminal-trigger");
      if (trigger) {
        const rect = trigger.getBoundingClientRect();
        setPosition({
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY,
        });
        setSize({
          width: rect.width,
          height: rect.height,
        });
      } else {
        const x = Math.max(20, (window.innerWidth - 600) / 2);
        const y = Math.max(20, (window.innerHeight - 380) / 2);
        setPosition({ x, y });
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Spawn position/size sync, autofocus, and auto-clear on open/close
  useEffect(() => {
    if (isOpen && mounted) {
      const timer = setTimeout(() => {
        const trigger = document.getElementById("terminal-trigger");
        if (trigger) {
          const rect = trigger.getBoundingClientRect();
          setPosition({
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY,
          });
          setSize({
            width: rect.width,
            height: rect.height,
          });
        }
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else if (!isOpen) {
      const timer = setTimeout(() => {
        setHistory([]);
        setInputValue("");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, mounted]);

  // Scroll to bottom of terminal body when history updates
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [history]);

  if (!mounted || !isOpen) return null;

  // Custom pointer-event dragging handler for the header
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only drag with left click

    const header = e.currentTarget;
    header.setPointerCapture(e.pointerId);

    const startX = e.clientX;
    const startY = e.clientY;
    const startPos = { ...position };
    const currentSize = { ...size };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      // Keep terminal inside bounds
      const nextX = Math.max(0, Math.min(window.innerWidth - currentSize.width, startPos.x + dx));
      const nextY = Math.max(0, Math.min(window.innerHeight - currentSize.height, startPos.y + dy));

      setPosition({ x: nextX, y: nextY });
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      header.releasePointerCapture(upEvent.pointerId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  // Custom pointer-event resizing handler for the bottom-right corner
  const handleResizePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only resize with left click
    e.stopPropagation(); // Avoid triggering header drag

    const handle = e.currentTarget;
    handle.setPointerCapture(e.pointerId);

    const startX = e.clientX;
    const startY = e.clientY;
    const startSize = { ...size };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      // Enforce minimum width/height limits
      const nextWidth = Math.max(250, startSize.width + dx);
      const nextHeight = Math.max(150, startSize.height + dy);

      setSize({ width: nextWidth, height: nextHeight });
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      handle.releasePointerCapture(upEvent.pointerId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(" ");

    let output: React.ReactNode;

    switch (cmd) {
      case "clear":
        setHistory([]);
        setInputValue("");
        return;

      case "help":
        output = (
          <div className={styles.helpContainer}>
            <div>Available commands:</div>
            <div className={styles.helpCommand}>
              <span>ls</span>
              <span className={styles.helpDescription}>List all navigable archive sections</span>
            </div>
            <div className={styles.helpCommand}>
              <span>cd &lt;section&gt;</span>
              <span className={styles.helpDescription}>Navigate to a section (e.g. `cd about`, `cd /`)</span>
            </div>
            <div className={styles.helpCommand}>
              <span>cat &lt;file&gt;</span>
              <span className={styles.helpDescription}>View the contents of a file (e.g. `cat resume`)</span>
            </div>
            <div className={styles.helpCommand}>
              <span>whoami</span>
              <span className={styles.helpDescription}>Display archivist identity profile</span>
            </div>
            <div className={styles.helpCommand}>
              <span>clear</span>
              <span className={styles.helpDescription}>Clear terminal screen scrollback history</span>
            </div>
            <div className={styles.helpCommand}>
              <span>help</span>
              <span className={styles.helpDescription}>Display this help dialogue menu</span>
            </div>
          </div>
        );
        break;

      case "cat": {
        const file = arg.toLowerCase().trim();
        if (file === "resume" || file === "resume.pdf") {
          window.open("/resume.pdf", "_blank");
          output = <div>Opening resume.pdf in a new tab...</div>;
        } else if (!file) {
          output = <div className={styles.errorText}>usage: cat &lt;filename&gt; (e.g. `cat resume`)</div>;
        } else {
          output = (
            <div className={styles.errorText}>
              cat: {arg}: No such file or directory
            </div>
          );
        }
        break;
      }

      case "whoami":
        output = (
          <div>
            <div>curator@archive:~$ whoami</div>
            <div>Identity: Curator & Architect [Oracle v3.14]</div>
            <div>Goal: Preserving digital history and building clean interfaces.</div>
            <div>Status: System online. Reading scroll indexes...</div>
          </div>
        );
        break;

      case "ls":
        output = (
          <div>
            <div>Directory listing: /archive</div>
            <div className={styles.lsGrid}>
              <span className={styles.lsItem}>gallery/</span>
              {NAVIGABLE_SECTIONS.map((sec) => (
                <span key={sec.id} className={styles.lsItem}>
                  {sec.name}
                </span>
              ))}
            </div>
          </div>
        );
        break;

      case "cd": {
        const target = arg.toLowerCase().replace(/\/$/, "");
        if (!target || target === "/" || target === "gallery" || target === "home" || target === "~" || target === "..") {
          setProgrammatic(true);
          setCurrentSection(null);
          output = <div>Navigating to Gallery Hero...</div>;
        } else {
          const match = NAVIGABLE_SECTIONS.find(
            (sec) => sec.id === target || sec.name.replace("/", "") === target
          );
          if (match) {
            setProgrammatic(true);
            setCurrentSection(match.id);
            output = <div>Navigating to {match.id}...</div>;
          } else {
            output = (
              <div className={styles.errorText}>
                cd: no such file or directory: {arg}
              </div>
            );
          }
        }
        break;
      }

      default:
        output = (
          <div className={styles.errorText}>
            oracle: command not found: &apos;{cmd}&apos;. Type &apos;help&apos; for assistance.
          </div>
        );
    }

    setHistory((prev) => [...prev, { command: trimmed, output }]);
    setInputValue("");
  };

  const handleWindowClick = () => {
    // Focus the input when clicking anywhere inside the terminal window
    inputRef.current?.focus();
  };

  return createPortal(
    <div
      className={styles.window}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
      }}
      onClick={handleWindowClick}
      onWheel={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      data-lenis-prevent
    >
      {/* Title bar / drag handle */}
      <div className={styles.header} onPointerDown={handlePointerDown}>
        <div className={styles.controls}>
          <button
            className={`${styles.dot} ${styles.closeDot}`}
            onClick={() => setOpen(false)}
            onPointerDown={(e) => e.stopPropagation()}
            title="Close Terminal"
            aria-label="Close Terminal"
          />
        </div>
        <div className={styles.title}>archive@curator:~ (terminal)</div>
        <div style={{ width: 30 }} /> {/* Spacer */}
      </div>

      {/* Terminal terminal output/input body */}
      <div ref={bodyRef} className={styles.body}>
        <div className={styles.welcomeText}>
          Welcome to the Archive Terminal [Oracle v3.14]
          <br />
          Type &apos;help&apos; to view all available commands.
        </div>

        <div className={styles.history}>
          {history.map((item, idx) => (
            <div key={idx} className={styles.line}>
              <div className={styles.inputLine}>
                <span className={styles.prompt}>curator@archive:~$</span>
                <span>{item.command}</span>
              </div>
              <div style={{ marginTop: 4, marginBottom: 12 }}>{item.output}</div>
            </div>
          ))}
        </div>

        <form onSubmit={handleCommandSubmit} className={styles.inputLine}>
          <span className={styles.prompt}>curator@archive:~$</span>
          <input
            ref={inputRef}
            type="text"
            className={styles.inputArea}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Terminal input prompt"
          />
        </form>
      </div>

      {/* Resize Handle */}
      <div className={styles.resizeHandle} onPointerDown={handleResizePointerDown} />
    </div>,
    document.body
  );
}
