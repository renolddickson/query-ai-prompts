import { useState } from "react";

function App() {
  const [sections, setSections] = useState<string[]>([]);

  const fetchSections = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "getSections" },
          (response: { sections: string[] }) => {
            setSections(response.sections || []);
          }
        );
      }
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Sections Found</h1>
      <button
        onClick={fetchSections}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Fetch Sections
      </button>

      <ul>
        {sections.map((section, index) => (
          <li key={index} className="mb-2 p-2 bg-gray-100 rounded">
            {section}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
