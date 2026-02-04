(() => {
  const normalize = (value) =>
    (value || "")
      .toString()
      .toLocaleLowerCase("tr")
      .replace(/\s+/g, " ")
      .trim();

  const getQueryParam = (name) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(name) || "";
  };

  const setParam = (name, value) => {
    const url = new URL(window.location.href);
    if (!value) url.searchParams.delete(name);
    else url.searchParams.set(name, value);
    window.history.replaceState({}, "", url);
  };

  const run = () => {
    const input = document.getElementById("q");
    const button = document.getElementById("searchBtn");
    const status = document.getElementById("resultStatus");
    const root = document.getElementById("results");

    if (!input || !status || !root) return;

    const cards = Array.from(root.querySelectorAll("a.card"));
    const index = cards.map((card) => ({
      card,
      text: normalize(card.innerText),
    }));

    const apply = (raw) => {
      const q = normalize(raw);
      let visible = 0;

      for (const item of index) {
        const matches = !q || item.text.includes(q);
        item.card.style.display = matches ? "block" : "none";
        if (matches) visible += 1;
      }

      if (!q) {
        status.style.display = "none";
        status.textContent = "";
      } else {
        status.style.display = "block";
        status.textContent = `Arama: "${raw}" · Sonuç: ${visible}`;
      }
    };

    const initial = getQueryParam("q");
    if (initial) {
      input.value = initial;
      apply(initial);
    }

    const onChange = () => {
      setParam("q", input.value);
      apply(input.value);
    };

    input.addEventListener("input", onChange);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onChange();
      }
      if (e.key === "Escape") {
        input.value = "";
        onChange();
      }
    });

    if (button) {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        onChange();
      });
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
