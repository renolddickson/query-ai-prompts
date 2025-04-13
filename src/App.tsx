// App.tsx
import { useState, useEffect } from "react";
import "./App.css";

type Section = { id: string; text: string };

// ——— Message & response types ———
type GetSectionsMessage = { action: "getSections" };
type ScrollMessage     = { action: "scrollToSection"; id: string };
type ContentResponse   = { sections?: Section[] };

function App() {
  const [sections, setSections] = useState<Section[] | null>(null);

  // Fetch all user‑prompt sections from the active tab
  const fetchSections = async () => {
    try {
      // 1. Find the active tab
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const tab = tabs[0];
      if (!tab?.id) throw new Error("No active tab");

      // 2. Send getSections message and assert response type
      const raw = await chrome.tabs.sendMessage(
        tab.id,
        { action: "getSections" } as GetSectionsMessage
      );
      const response = raw as ContentResponse;

      // 3. Update state (default to empty array)
      setSections(response.sections ?? []);
    } catch (err) {
      console.warn("fetchSections error:", err);
      setSections([]); // on any error, show “No prompt found”
    }
  };

  // Scroll to a specific section
  const scrollToSection = async (id: string) => {
    try {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const tab = tabs[0];
      if (!tab?.id) throw new Error("No active tab");

      await chrome.tabs.sendMessage(
        tab.id,
        { action: "scrollToSection", id } as ScrollMessage
      );
    } catch (err) {
      console.warn("scrollToSection error:", err);
    }
  };

  // Run once on mount
  useEffect(() => {
    fetchSections();
  }, []);

  return (
    <div className="container">
      <h1 className="title">Prompts Found</h1>

      {sections === null ? (
        <p className="loading">Loading…</p>
      ) : sections.length === 0 ? (
        <p className="empty-message">No prompt found</p>
      ) : (
        <ul className="section-list">
          {sections.map(({ id, text }) => (
            <li
              key={id}
              className="section-item"
              onClick={() => scrollToSection(id)}
            >
              {text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
