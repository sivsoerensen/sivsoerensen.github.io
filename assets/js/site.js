console.log("site.js v4 loaded from", window.location.origin);

// === Load shared head + sidebar, then fade in site ===
Promise.all([
  fetch("partials/head.html")
    .then(r => r.text())
    .then(html => document.head.insertAdjacentHTML("beforeend", html)),
  fetch("partials/sidebar.html")
    .then(r => r.text())
    .then(html => {
      const sidebar = document.getElementById("sidebar");
      if (sidebar) sidebar.innerHTML = html;
    })
]).then(() => {
  document.body.classList.add("loaded");
  initGlobalUI();   // initialize logo, menu, etc., once everything is ready
});

// === Initialize global UI elements (runs after load) ===
function initGlobalUI() {

  /*--------------------------------------------*/
  /* Hamburger menu setup                      */
  /*--------------------------------------------*/
  const host = document.getElementById("sidebar");
  if (host) {
    const btn = document.createElement("button");
    btn.id = "menu-toggle";
    btn.setAttribute("aria-label", "Toggle menu");
    btn.innerHTML = "&#9776;";
    document.body.appendChild(btn);

    btn.addEventListener("click", () => host.classList.toggle("active"));
    document.addEventListener("click", (e) => {
      if (e.target.closest("#sidebar .nav a")) host.classList.remove("active");
    });
  }

  /*--------------------------------------------*/
  /* Corner logo setup                         */
  /*--------------------------------------------*/
  const logo = document.createElement("div");
  logo.id = "corner-logo";
  logo.addEventListener("click", () => (window.location.href = "index.html"));
  document.body.appendChild(logo);


  console.log("UI initialized");
}

/*==============================================================*/
/*  SIVGPT LIVE LOGIC – fetch real GPT reply from Vercel API
/*==============================================================*/

const sivForm   = document.getElementById("sivgpt-form");
const sivInput  = document.getElementById("sivgpt-input");
const sivAnswer = document.getElementById("sivgpt-answer");

if (sivForm && sivInput && sivAnswer) {
  async function handleSubmit(e) {
    e.preventDefault();
    const q = sivInput.value.trim();
    if (!q) return;

    sivInput.value = "";
    sivAnswer.classList.remove("show");
    sivAnswer.textContent = "SivGPT is thinking…";

    try {
      const apiUrl =
        window.location.hostname.includes("vercel.app") ||
        window.location.hostname.includes("sivsoerensen.com")
          ? "https://sivsoerensen-github-n74ftzn1a-sivs-projects-6719b311.vercel.app/api/sivgpt"
          : "/api/sivgpt";

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q }),
      });

      const data = await res.json();
      sivAnswer.textContent = data.answer || "No response.";
      sivAnswer.classList.add("show");
    } catch (err) {
      sivAnswer.textContent = "Error: " + err.message;
      sivAnswer.classList.add("show");
    }
  }

  sivForm.addEventListener("submit", handleSubmit);
}
