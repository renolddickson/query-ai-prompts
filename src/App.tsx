import { useState, useEffect } from "react";
import './App.css'

type Section = { id: string; text: string };

function App() {
  // null = loading, [] = loaded but empty, [..] = loaded with data
  const [sections, setSections] = useState<Section[] | null>(null);

  const fetchSections = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      if (!tabId) {
        setSections([]); // no tab → treat as empty
        return;
      }

      chrome.tabs.sendMessage(
        tabId,
        { action: "getSections" },
        (response: { sections?: Section[] }) => {
          setSections(response.sections || []);
        }
      );
    });
  };

  // Run once when popup opens
  useEffect(() => {
    fetchSections();
  }, []);

  return (
    <div className="container">
      <h1 className="title">Sections Found</h1>

      {sections === null ? (
        <p className="loading">Loading…</p>
      ) : sections.length === 0 ? (
        <p className="empty-message">No prompt found</p>
      ) : (
        <ul className="section-list">
          {sections.map(({ id, text }) => (
            <li
              key={id}
              onClick={() => {
                chrome.tabs.query(
                  { active: true, currentWindow: true },
                  (tabs) => {
                    const tabId = tabs[0]?.id;
                    if (tabId) {
                      chrome.tabs.sendMessage(tabId, {
                        action: "scrollToSection",
                        id,
                      });
                    }
                  }
                );
              }}
              className="section-item"
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