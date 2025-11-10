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
