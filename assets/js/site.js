console.log("site.js v3 loaded from", window.location.origin);

(async function loadEverything() {
  // 2) Load sidebar
  const host = document.getElementById('sidebar');
  if (host) {
    const sidebarHtml = await fetch('partials/sidebar.html').then(r => r.text());
    host.innerHTML = sidebarHtml;
  }

  // 3) Create menu button
  const btn = document.createElement('button');
  btn.id = 'menu-toggle';
  btn.setAttribute('aria-label', 'Toggle menu');
  btn.innerHTML = '&#9776;';
  document.body.appendChild(btn);

  // 4) Menu toggle logic
  btn.addEventListener('click', () => {
    host.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('#sidebar .nav a')) host.classList.remove('active');
  });

  // 5) Fade in now everything is ready
  // document.body.classList.add("loaded");
})();


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
