// assets/js/site.js
document.addEventListener('DOMContentLoaded', async () => {
  // 1) Load sidebar partial into #sidebar
  const host = document.getElementById('sidebar');
  if (host) {
    const html = await fetch('partials/sidebar.html').then(r => r.text());
    host.innerHTML = html;
  }

  // 2) Inject hamburger once (no per-page markup)
  const btn = document.createElement('button');
  btn.id = 'menu-toggle';
  btn.setAttribute('aria-label', 'Toggle menu');
  btn.innerHTML = '&#9776;';
  document.body.appendChild(btn);

  // 3) Toggle logic
  btn.addEventListener('click', () => {
    host.classList.toggle('active');
  });

  // 4) Close on nav click
  document.addEventListener('click', (e) => {
    if (e.target.closest('#sidebar .nav a')) host.classList.remove('active');
  });
});


/*==============================================================*/
/*  SIVGPT DEMO LOGIC – clears input and shows answer
/*==============================================================*/

const sivForm   = document.getElementById("sivgpt-form");
const sivInput  = document.getElementById("sivgpt-input");
const sivSend   = document.getElementById("sivgpt-send");
const sivAnswer = document.getElementById("sivgpt-answer");

if (sivForm && sivInput && sivSend && sivAnswer) {

  function showAnswer(text) {
    sivAnswer.textContent = "SivGPT: " + text;
    sivAnswer.classList.add("show");
  }

  function handleSubmit(e) {
    e.preventDefault();
    const q = sivInput.value.trim();
    if (!q) return;
    sivInput.value = "";
    sivAnswer.classList.remove("show");

    // simulate thinking delay
    setTimeout(() => {
      showAnswer("That’s a great question! (placeholder response for now)");
    }, 500);
  }

  sivForm.addEventListener("submit", handleSubmit);
  sivSend.addEventListener("click", handleSubmit);
}

