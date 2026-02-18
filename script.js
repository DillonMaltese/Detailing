// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
if (menuBtn) {
  menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
}

// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Demo form handlers (no backend)
function handleForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());

    // Option A: open user's SMS app with the message
    const phone = "+15551234567"; // <-- change to your business #
    const msg =
      `Detail Request:%0A` +
      Object.entries(data).map(([k, v]) => `${k}: ${v}`).join("%0A");

    window.location.href = `sms:${phone}?&body=${msg}`;

    // Option B (later): send to a backend / Formspree / Netlify Forms
    // fetch("YOUR_ENDPOINT", { method: "POST", body: JSON.stringify(data) })
  });
}

handleForm("quickForm");
handleForm("quoteForm");