document.addEventListener("DOMContentLoaded", function () {
  initThemeToggle();
  initAccessibility();
  initNavbar();
  initBackToTop();
  initAOS();
  initTabActivator();
  renderAlphabetCards();
  initQuiz();
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
  if (window.AOS && !document.documentElement.hasAttribute("data-reduced-motion")) {
    AOS.init({
      duration: 800,
      once: true,
      offset: 60,
      easing: "ease-out-cubic"
    });
  }
}

/* ===== Accessibility panel ===== */
function getAccessSettings() {
  try {
    return JSON.parse(localStorage.getItem("biisa-access")) || {};
  } catch (e) {
    return {};
  }
}

function applyAccessSettings() {
  const html = document.documentElement;
  const s = getAccessSettings();

  html.setAttribute("data-access-font", s.fontScale || "a");
  if (s.contrast) {
    html.setAttribute("data-high-contrast", "");
  } else {
    html.removeAttribute("data-high-contrast");
  }
  if (s.motion) {
    html.setAttribute("data-reduced-motion", "");
  } else {
    html.removeAttribute("data-reduced-motion");
  }
}

function saveAccessSettings(s) {
  localStorage.setItem("biisa-access", JSON.stringify(s));
  applyAccessSettings();
  syncAccessPanelUI();
}

function injectAccessPanel() {
  const panelHTML =
    '<div class="access-panel" id="accessPanel" aria-hidden="true">' +
    '<div class="access-head"><span><i class="fa-solid fa-universal-access me-2"></i>Aksesibilitas</span>' +
    '<button class="access-close" id="accessClose" aria-label="Tutup"><i class="fa-solid fa-xmark"></i></button></div>' +
    '<div class="access-body">' +
    '<div class="access-heading"><i class="fa-solid fa-text-height"></i>Ukuran Teks</div>' +
    '<div class="access-size">' +
    '<button data-size="a" aria-label="Ukuran teks kecil">A</button>' +
    '<button data-size="b" aria-label="Ukuran teks sedang">A</button>' +
    '<button data-size="c" aria-label="Ukuran teks besar">A</button></div>' +
    '<label class="access-label">Kontras Tinggi</label>' +
    '<label class="switch"><input type="checkbox" id="accessContrast"><span class="track"></span>Mode kontras tinggi</label>' +
    '<label class="access-label">Kurangi Animasi</label>' +
    '<label class="switch"><input type="checkbox" id="accessMotion"><span class="track"></span>Matikan animasi</label>' +
    '<button class="btn btn-ghost access-reset" id="accessReset">Reset Pengaturan</button>' +
    '</div></div>' +
    '<button class="access-float" id="accessToggle" aria-label="Buka pengaturan aksesibilitas"><i class="fa-solid fa-universal-access"></i></button>';

  document.body.insertAdjacentHTML("beforeend", panelHTML);
}

function syncAccessPanelUI() {
  const s = getAccessSettings();

  const sizeBtns = document.querySelectorAll(".access-size button");
  sizeBtns.forEach(function (btn) {
    btn.classList.toggle("active", btn.getAttribute("data-size") === (s.fontScale || "a"));
  });

  const contrast = document.getElementById("accessContrast");
  if (contrast) contrast.checked = !!s.contrast;

  const motion = document.getElementById("accessMotion");
  if (motion) motion.checked = !!s.motion;
}

function initAccessibility() {
  injectAccessPanel();
  applyAccessSettings();
  syncAccessPanelUI();

  const panel = document.getElementById("accessPanel");
  const toggle = document.getElementById("accessToggle");
  const close = document.getElementById("accessClose");
  const reset = document.getElementById("accessReset");

  function openPanel() {
    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
  }
  function closePanel() {
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
  }

  toggle.addEventListener("click", function () {
    panel.classList.contains("open") ? closePanel() : openPanel();
  });
  close.addEventListener("click", closePanel);

  document.querySelectorAll(".access-size button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const s = getAccessSettings();
      s.fontScale = btn.getAttribute("data-size");
      saveAccessSettings(s);
    });
  });

  const contrast = document.getElementById("accessContrast");
  contrast.addEventListener("change", function () {
    const s = getAccessSettings();
    s.contrast = contrast.checked;
    saveAccessSettings(s);
  });

  const motion = document.getElementById("accessMotion");
  motion.addEventListener("change", function () {
    const s = getAccessSettings();
    s.motion = motion.checked;
    saveAccessSettings(s);
    if (window.AOS && !motion.checked) {
      initAOS();
    }
  });

  reset.addEventListener("click", function () {
    localStorage.removeItem("biisa-access");
    applyAccessSettings();
    syncAccessPanelUI();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closePanel();
  });
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

function getAlphabetImages(type) {
  return ALPHABETS.split("").map(function (ch) {
    return { letter: ch, image: "image/" + type + "_" + ch + ".png" };
  });
}

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
      letters.push.apply(letters, getAlphabetImages(type));
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

/* ===== Quiz / Practice mode ===== */
var quiz = {
  type: "BISINDO",
  mode: "signToLetter",
  count: 10,
  questions: [],
  idx: 0,
  score: 0,
  answered: false
};

function initQuiz() {
  const setup = document.getElementById("quizSetup");
  if (!setup) return;

  const body = document.getElementById("quizBody");
  const result = document.getElementById("quizResult");
  const options = document.getElementById("quizOptions");
  const promptEl = document.getElementById("quizPrompt");
  const feedback = document.getElementById("quizFeedback");
  const nextBtn = document.getElementById("quizNext");
  const progressText = document.getElementById("quizProgressText");
  const scoreText = document.getElementById("quizScoreText");
  const progressBar = document.getElementById("quizProgressBar");
  const resultText = document.getElementById("quizResultText");
  const setupBtns = setup.querySelectorAll(".quiz-setup-btn");

  setupBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      btn.parentElement.querySelectorAll(".quiz-setup-btn").forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");

      if (btn.hasAttribute("data-quiz-type")) quiz.type = btn.getAttribute("data-quiz-type");
      if (btn.hasAttribute("data-quiz-mode")) quiz.mode = btn.getAttribute("data-quiz-mode");
      if (btn.hasAttribute("data-quiz-count")) quiz.count = parseInt(btn.getAttribute("data-quiz-count"), 10);
    });
  });

  document.getElementById("quizStart").addEventListener("click", startQuiz);
  document.getElementById("quizRetry").addEventListener("click", startQuiz);
  document.getElementById("quizChange").addEventListener("click", function () {
    result.classList.add("d-none");
    setup.classList.remove("d-none");
    body.classList.add("d-none");
  });

  nextBtn.addEventListener("click", function () {
    quiz.idx++;
    if (quiz.idx < quiz.questions.length) {
      renderQuestion();
    } else {
      showResult();
    }
  });

  function startQuiz() {
    const letters = getAlphabetImages(quiz.type);
    quiz.score = 0;
    quiz.idx = 0;
    quiz.questions = [];

    const pool = letters.slice();
    for (let i = 0; i < quiz.count; i++) {
      const pick = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
      if (!pick) break;
      quiz.questions.push({
        letter: pick.letter,
        image: pick.image,
        options: buildOptions(pick.letter, letters)
      });
    }

    setup.classList.add("d-none");
    result.classList.add("d-none");
    body.classList.remove("d-none");
    renderQuestion();
  }

  function buildOptions(correctLetter, letters) {
    const wrong = letters.filter(function (l) {
      return l.letter !== correctLetter;
    });
    const shuffledWrong = wrong.slice().sort(function () {
      return Math.random() - 0.5;
    }).slice(0, 3);

    const optionLetters = shuffledWrong.map(function (l) {
      return l.letter;
    });
    optionLetters.push(correctLetter);
    optionLetters.sort(function () {
      return Math.random() - 0.5;
    });
    return optionLetters;
  }

  function renderQuestion() {
    quiz.answered = false;
    nextBtn.classList.add("d-none");
    feedback.textContent = "";
    options.innerHTML = "";

    const q = quiz.questions[quiz.idx];
    progressText.textContent = "Soal " + (quiz.idx + 1) + " dari " + quiz.questions.length;
    scoreText.textContent = "Skor: " + quiz.score;
    progressBar.style.width = (((quiz.idx + 1) / quiz.questions.length) * 100) + "%";

    if (quiz.mode === "signToLetter") {
      promptEl.innerHTML = '<img src="' + q.image + '" alt="Isyarat huruf ' + q.letter + '" class="quiz-prompt-img" style="max-width:200px;">';
      q.options.forEach(function (letter) {
        const btn = document.createElement("button");
        btn.className = "quiz-opt-btn";
        btn.textContent = letter;
        btn.addEventListener("click", function () {
          guess(letter, btn, null);
        });
        options.appendChild(btn);
      });
    } else {
      promptEl.innerHTML = '<div class="quiz-prompt-letter">' + q.letter + "</div>";
      const byLetter = {};
      getAlphabetImages(quiz.type).forEach(function (l) {
        byLetter[l.letter] = l.image;
      });
      q.options.forEach(function (letter) {
        const btn = document.createElement("button");
        btn.className = "quiz-opt-btn quiz-opt-img";
        btn.innerHTML = '<img src="' + byLetter[letter] + '" alt="Pilihan huruf ' + letter + '">';
        btn.addEventListener("click", function () {
          guess(letter, btn, null);
        });
        options.appendChild(btn);
      });
    }
  }

  function guess(selectedLetter, btn) {
    if (quiz.answered) return;
    quiz.answered = true;

    const correct = quiz.questions[quiz.idx].letter;
    const correctBtn = Array.prototype.slice.call(options.querySelectorAll(".quiz-opt-btn"))[
      quiz.questions[quiz.idx].options.indexOf(correct)
    ];

    if (selectedLetter === correct) {
      btn.classList.add("opt-correct");
      quiz.score++;
      feedback.innerHTML = '<span class="text-success"><i class="fa-solid fa-circle-check me-2"></i>Benar! Jawaban: ' + correct + "</span>";
    } else {
      btn.classList.add("opt-wrong");
      if (correctBtn) correctBtn.classList.add("opt-correct");
      feedback.innerHTML = '<span class="text-danger"><i class="fa-solid fa-circle-xmark me-2"></i>Kurang tepat. Jawaban: ' + correct + "</span>";
    }

    options.querySelectorAll(".quiz-opt-btn").forEach(function (b) {
      b.disabled = true;
    });
    scoreText.textContent = "Skor: " + quiz.score;
    nextBtn.classList.remove("d-none");
  }

  function showResult() {
    body.classList.add("d-none");
    result.classList.remove("d-none");

    const pct = Math.round((quiz.score / quiz.questions.length) * 100);
    let stars = "";
    if (pct === 100) stars = "&#9733;&#9733;&#9733;";
    else if (pct >= 70) stars = "&#9733;&#9733;";
    else if (pct >= 40) stars = "&#9733;";

    const starsEl = result.querySelector(".quiz-result-stars");
    if (starsEl) starsEl.innerHTML = stars;

    resultText.textContent = "Benar " + quiz.score + " dari " + quiz.questions.length + " (" + pct + "%). " +
      (pct === 100 ? "Sempurna! Kamu sudah menguasai alfabet " + quiz.type + "!" :
      pct >= 70 ? "Hebat! Terus latih lagi untuk hasil maksimal." :
      pct >= 40 ? "Lumayan. Coba pelajari kembali kartu alfabet di atas." :
      "Jangan menyerah! Pelajari alfabet lalu coba lagi.");
  }
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