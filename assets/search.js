(() => {
  const normalize = (value) =>
    (value || "")
      .toString()
      .toLocaleLowerCase("tr")
      .replace(/\s+/g, " ")
      .trim();

  const clearHighlights = (root) => {
    if (!root) return;
    const marks = Array.from(root.querySelectorAll("mark.hl"));
    for (const mark of marks) {
      const text = document.createTextNode(mark.textContent || "");
      mark.replaceWith(text);
    }
  };

  const highlightText = (root, queryRaw) => {
    if (!root) return;
    clearHighlights(root);

    const query = (queryRaw || "").toString().trim();
    if (!query) return;

    const queryNorm = query.toLocaleLowerCase("tr");

    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;

          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const tag = parent.tagName?.toLowerCase();
          if (tag === "script" || tag === "style" || tag === "mark") {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        },
      },
      false
    );

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    for (const node of nodes) {
      const text = node.nodeValue;
      const lower = text.toLocaleLowerCase("tr");
      const index = lower.indexOf(queryNorm);
      if (index === -1) continue;

      const fragment = document.createDocumentFragment();
      let cursor = 0;

      while (true) {
        const start = lower.indexOf(queryNorm, cursor);
        if (start === -1) break;
        const end = start + queryNorm.length;

        if (start > cursor) {
          fragment.appendChild(document.createTextNode(text.slice(cursor, start)));
        }

        const mark = document.createElement("mark");
        mark.className = "hl";
        mark.textContent = text.slice(start, end);
        fragment.appendChild(mark);

        cursor = end;
      }

      if (cursor < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(cursor)));
      }

      node.parentNode?.replaceChild(fragment, node);
    }
  };

  const getSearchables = () => {
    const cards = Array.from(document.querySelectorAll(".card"));
    const listItems = Array.from(document.querySelectorAll(".list li"));
    const faqs = Array.from(document.querySelectorAll("details.faq"));

    const items = [];

    for (const element of cards) {
      items.push({
        element,
        text: normalize(element.innerText),
      });
    }

    for (const element of listItems) {
      items.push({
        element,
        text: normalize(element.innerText),
      });
    }

    for (const element of faqs) {
      items.push({
        element,
        text: normalize(element.innerText),
      });
    }

    return items;
  };

  const ensureStatus = (searchContainer) => {
    if (!searchContainer) return null;

    let status = document.getElementById("search-status");
    if (status) return status;

    status = document.createElement("div");
    status.id = "search-status";
    status.className = "callout";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.style.marginTop = "12px";
    status.style.display = "none";

    searchContainer.insertAdjacentElement("afterend", status);
    return status;
  };

  const setHidden = (element, hidden) => {
    if (!element) return;

    if (hidden) {
      element.classList.add("is-hidden");
    } else {
      element.classList.remove("is-hidden");
    }
  };

  const run = () => {
    const searchContainer = document.querySelector(".search");
    const input = document.querySelector('.search input[type="search"]');
    const button = document.querySelector(".search button");

    if (!searchContainer || !input) return;

    const status = ensureStatus(searchContainer);
    const items = getSearchables();

    const apply = () => {
      const query = normalize(input.value);
      let visibleCount = 0;

      for (const item of items) {
        const matches = !query || item.text.includes(query);
        setHidden(item.element, !matches);
        if (matches) visibleCount += 1;

        if (!query || !matches) {
          clearHighlights(item.element);
        } else {
          highlightText(item.element, input.value);
        }

        if (item.element?.tagName?.toLowerCase() === "details" && !matches) {
          item.element.removeAttribute("open");
        }
      }

      if (status) {
        if (!query) {
          status.style.display = "none";
          status.textContent = "";
        } else {
          status.style.display = "block";
          status.textContent = `Arama: "${input.value}" · Sonuç: ${visibleCount}`;
        }
      }
    };

    const applyWithPrevent = (event) => {
      if (event) event.preventDefault();
      apply();
    };

    input.addEventListener("input", apply);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") applyWithPrevent(e);
      if (e.key === "Escape") {
        input.value = "";
        apply();
      }
    });

    if (button) {
      button.addEventListener("click", applyWithPrevent);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
