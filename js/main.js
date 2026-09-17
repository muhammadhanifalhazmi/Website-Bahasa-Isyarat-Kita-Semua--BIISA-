document.addEventListener("DOMContentLoaded", function () {
  initThemeToggle();
  initNavbar();
  initBackToTop();
  initAOS();
  initTabActivator();
  renderAlphabetCards();
  initContactForm();
});

/* ===== Theme toggle (Dark / Light) ===== */
function initThemeToggle() {
  const html = document.documentElement;
  const toggle = document.querySelector(".theme-toggle");

  const stored = localStorage.getItem("biisa-theme");
  if (stored === "dark") {
    html.setAttribute("data-theme", "dark");
  } else if (stored === "light") {
    html.setAttribute("data-theme", "light");
  } else {
    const dark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    html.setAttribute("data-theme", dark ? "dark" : "light");
  }

  if (toggle) {
    toggle.innerHTML = "";
    const knob = document.createElement("span");
    knob.className = "knob";
    toggle.appendChild(knob);
    toggle.setAttribute("aria-label", "Toggle dark mode");

    toggle.addEventListener("click", function () {
      const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
      html.setAttribute("data-theme", next);
      localStorage.setItem("biisa-theme", next);
    });
  }
}

/* ===== Navbar ===== */
function initNavbar() {
  const navbar = document.querySelector(".navbar-biisa");
  if (!navbar) return;

  window.addEventListener("scroll", function () {
    if (window.scrollY > 30) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  const links = navbar.querySelectorAll(".nav-link");
  const pageName = window.location.pathname.split("/").pop() || "index.html";

  links.forEach(function (link) {
    const href = link.getAttribute("href");
    if (href === pageName) {
      link.classList.add("active");
    }
  });

  const collapse = document.querySelector("#navbarSupportedContent");
  if (collapse) {
    const toggler = document.querySelector(".navbar-toggler");
    document.querySelectorAll("#navbarSupportedContent .nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        if (collapse.classList.contains("show")) {
          toggler.click();
        }
      });
    });
  }
}

/* ===== Back to top ===== */
function initBackToTop() {
  const btn = document.querySelector(".back-to-top");
  if (!btn) return;

  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", function () {
    if (window.scrollY > 400) {
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }
  });
}

/* ===== AOS ===== */
function initAOS() {
  if (window.AOS) {
    AOS.init({
      duration: 800,
      once: true,
      offset: 60,
      easing: "ease-out-cubic"
    });
  }
}

/* ===== Tab activator (link dari luar tab list) ===== */
function initTabActivator() {
  document.querySelectorAll("[data-activate-tab]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = el.getAttribute("data-activate-tab");
      const target = document.getElementById(targetId);
      const tab = document.querySelector('#alphabetTabs [data-bs-target="#' + targetId + '"]');

      if (tab && window.bootstrap) {
        bootstrap.Tab.getOrCreateInstance(tab).show();
      } else if (target) {
        target.classList.add("active", "show");
      }

      const alphabets = document.getElementById("alphabets");
      if (alphabets) {
        alphabets.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

/* ===== Alphabet cards generator ===== */
var ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function renderAlphabetCards() {
  document.querySelectorAll("[data-alphabet]").forEach(function (container) {
    const type = container.getAttribute("data-alphabet"); // "BISINDO" | "SIBI"
    const cards = container.querySelectorAll("[data-letter]");
    const letters = [];

    cards.forEach(function (card) {
      letters.push({
        letter: card.getAttribute("data-letter"),
        image: card.getAttribute("data-image") || ("image/" + type + "_" + card.getAttribute("data-letter") + ".png")
      });
    });

    if (letters.length === 0) {
      ALPHABETS.split("").forEach(function (ch) {
        letters.push({ letter: ch, image: "image/" + type + "_" + ch + ".png" });
      });
    }

    const wrapper = document.createElement("div");
    wrapper.className = "row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-6 g-4";

    letters.forEach(function (item) {
      const col = document.createElement("div");
      col.className = "col";
      col.innerHTML =
        '<div class="alphabet-card">' +
        '<img src="' + item.image + '" alt="Sign language alphabet ' + item.letter +
        '" loading="lazy" onerror="this.style.opacity=\'0.25\'">' +
        '<div class="letter-label">' + item.letter + "</div>" +
        "</div>";
      wrapper.appendChild(col);
    });

    container.appendChild(wrapper);
  });
}

/* ===== Contact form ===== */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const alertBox = document.getElementById("formAlert");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("contactName");
    const email = document.getElementById("contactEmail");
    const message = document.getElementById("contactMessage");

    let valid = true;
    [name, email, message].forEach(function (input) {
      if (!input || !input.value.trim()) {
        input.classList.add("is-invalid");
        valid = false;
      } else {
        input.classList.remove("is-invalid");
      }
    });

    if (!valid) {
      showFormAlert("Mohon isi semua kolom dengan benar.", "danger");
      return;
    }

    const subject = encodeURIComponent("Pesan dari " + name.value.trim());
    const body = encodeURIComponent(message.value.trim() + "\n\nDari: " + name.value.trim() + " (" + email.value.trim() + ")");
    window.open("mailto:biisa@gmail.com?subject=" + subject + "&body=" + body, "_blank");

    form.reset();
    showFormAlert("Terima kasih! Email klien sudah dibuka agar Anda dapat mengirim pesan.", "success");
  });

  function showFormAlert(message, type) {
    if (!alertBox) return;
    alertBox.classList.remove("d-none", "alert-success", "alert-danger");
    alertBox.classList.add("alert-" + type);
    alertBox.textContent = message;
    alertBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    setTimeout(function () {
      alertBox.classList.add("d-none");
    }, 6000);
  }
}