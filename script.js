/* Portfolio interactions */
(function () {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("open");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const root = document.documentElement;
  const modeBtn = document.getElementById("mode-toggle");
  const initial =
    localStorage.getItem("theme") ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  if (initial === "dark") {
    root.classList.add("dark");
  }

  function setModeButtonText() {
    if (!modeBtn) return;
    modeBtn.textContent = root.classList.contains("dark") ? "Light" : "Dark";
  }

  setModeButtonText();

  modeBtn?.addEventListener("click", () => {
    root.classList.toggle("dark");
    localStorage.setItem("theme", root.classList.contains("dark") ? "dark" : "light");
    setModeButtonText();
  });

  const grid = document.querySelector("[data-projects]");
  const chips = document.querySelectorAll(".chip");
  const searchInput = document.getElementById("project-search");
  const projectCount = document.getElementById("projects-count");
  let activeFilter = "all";

  function applyProjectFilters() {
    if (!grid) return;
    const query = (searchInput?.value || "").trim().toLowerCase();
    const cards = grid.querySelectorAll(".project-card");
    let visible = 0;

    cards.forEach((card) => {
      const tags = (card.getAttribute("data-tags") || "")
        .split(",")
        .map((s) => s.trim().toLowerCase());
      const title = card.querySelector(".project-card__title")?.textContent?.toLowerCase() || "";
      const desc = card.querySelector(".project-card__desc")?.textContent?.toLowerCase() || "";
      const matchesTag = activeFilter === "all" || tags.includes(activeFilter);
      const matchesQuery = !query || title.includes(query) || desc.includes(query);
      const show = matchesTag && matchesQuery;

      card.classList.toggle("is-hidden", !show);
      if (show) visible += 1;
    });

    if (projectCount) {
      projectCount.textContent = `${visible} project${visible === 1 ? "" : "s"} shown`;
    }
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      activeFilter = (chip.getAttribute("data-filter") || "all").toLowerCase();
      applyProjectFilters();
    });
  });

  searchInput?.addEventListener("input", applyProjectFilters);
  applyProjectFilters();

  const form = document.getElementById("contact-form");
  const success = document.getElementById("form-success");
  if (form) {
    const fields = ["name", "email", "message"];
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      let isValid = true;
      const submitBtn = form.querySelector('button[type="submit"]');

      fields.forEach((id) => {
        const input = form.querySelector("#" + id);
        const error = form.querySelector("#error-" + id);
        if (!input || !error) return;
        if (!input.checkValidity()) {
          isValid = false;
          error.textContent = input.validationMessage;
        } else {
          error.textContent = "";
        }
      });

      if (!isValid) {
        if (success) success.textContent = "";
        return;
      }

      try {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "Sending...";
        }

        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: {
            Accept: "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Unable to send message");
        }

        form.reset();
        if (success) {
          success.textContent = "Message sent successfully. Thank you for reaching out.";
        }
      } catch (error) {
        if (success) {
          success.textContent = "Message could not be sent right now. Please try again shortly.";
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send";
        }
      }
    });
  }

  const toTop = document.getElementById("to-top");
  function onScroll() {
    if (!toTop) return;
    toTop.classList.toggle("is-visible", window.scrollY > 400);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealItems.length > 0) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealItems.forEach((el) => observer.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  }
})();