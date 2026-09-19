const toggle = document.getElementById('theme-toggle');
const body = document.body;
const saved = localStorage.getItem('theme');
if (saved) body.classList.add(saved);
toggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : '');
});
