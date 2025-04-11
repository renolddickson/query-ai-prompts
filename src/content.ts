// content.ts
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "getSections") {
    // 1. Define host→selector map
    const siteSelectors: { host: string; selector: string }[] = [
      { host: "chatgpt.com",         selector: '[data-message-author-role="user"]' },
      { host: "gemini.google.com",    selector: ".gemini-user-message" },
      { host: "grok.com",             selector: ".grok-user-message" },
      { host: "chat.qwen.ai",         selector: ".message-content-bg" },
      { host: "chat.deepseek.com",    selector: ".deepseek-user" },
      { host: "claude.ai",            selector: ".claude-user-message" },
    ];

    // 2. Pick the selector for the current host (fallback to first entry)
    const host = window.location.host;
    const cfg = siteSelectors.find(c => host.includes(c.host)) || siteSelectors[0];
    const els = document.querySelectorAll<HTMLElement>(cfg.selector);

    // 3. Build {id, text} array and tag each element
    const sections = Array.from(els).map((el, i) => {
      const id = `section-${i}`;
      el.setAttribute("data-section-id", id);
      const txtNode = findFirstTextNode(el);
      return { id, text: txtNode?.textContent?.trim() || "" };
    });

    sendResponse({ sections });
  }

  if (message.action === "scrollToSection") {
    const target = document.querySelector<HTMLElement>(
      `[data-section-id="${message.id}"]`
    );
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
});

// Helper to find the first non‑empty text node
function findFirstTextNode(element: Element): Node | null {
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) =>
        node.textContent && node.textContent.trim() !== ""
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP,
    }
  );
  return walker.nextNode();
}
