console.log("site.js loaded from", window.location.origin);

// LOAD EVERYTHING
(async function () {

  // hide until ready
  document.body.style.opacity = "0";

  // 1) Load head.html
  const headHtml = await fetch("partials/head.html").then(r => r.text());
  document.head.insertAdjacentHTML("beforeend", headHtml);

  // 2) Load sidebar.html
  const sidebarDiv = document.getElementById("sidebar");
  if (sidebarDiv) {
    const sidebarHtml = await fetch("partials/sidebar.html").then(r => r.text());
    sidebarDiv.innerHTML = sidebarHtml;
  }

  // 3) Insert menu button
  const button = document.createElement("button");
  button.id = "menu-toggle";
  button.setAttribute("aria-label", "Toggle menu");
  button.innerHTML = "&#9776;";
  document.body.appendChild(button);

  // 4) Toggle sidebar
  button.addEventListener("click", () => {
    sidebarDiv.classList.toggle("active");
  });

  document.addEventListener("click", e => {
    if (e.target.closest("#sidebar .nav a")) sidebarDiv.classList.remove("active");
  });

  // 5) Fade in
  document.body.style.transition = "opacity 0.001s";
  document.body.style.opacity = "1";
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
