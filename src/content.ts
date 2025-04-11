chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.action === "getSections") {
      const userMessages = document.querySelectorAll('[data-message-author-role="user"]');
  
      const sections = Array.from(userMessages).map((el) => {
        const firstTextNode = findFirstTextNode(el);
        return firstTextNode ? firstTextNode.textContent?.trim() || '' : '';
      });
  
      sendResponse({ sections });
    }
  });
  
  // Helper function to find the first non-empty text node
  function findFirstTextNode(element: Element): Node | null {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          if (node.textContent && node.textContent.trim() !== '') {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_SKIP;
        },
      }
    );
    return walker.nextNode();
  }
  