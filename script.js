// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
}

// Year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// --- SMS helper ---
function openSMS({ phoneE164, message }) {
  // sms: URI is picky across devices; safest is digits-only for the URI.
  // Keep your real number in E.164 (+1...) and strip for the sms link.
  const phoneForUri = String(phoneE164).replace(/[^\d]/g, ""); // "12033993320"

  // Encode message safely (handles spaces, &, ?, emojis, etc.)
  const encoded = encodeURIComponent(message);

  // iOS often wants sms:number&body= (no '?')
  const ua = navigator.userAgent || "";
  const isIOS = /iPhone|iPad|iPod/i.test(ua);

  const smsUrl = isIOS
    ? `sms:${phoneForUri}&body=${encoded}`
    : `sms:${phoneForUri}?body=${encoded}`;

  // Try to open the messaging app
  window.location.href = smsUrl;

  // Fallback for desktops / unsupported sms: handlers:
  // If the page is still visible after a short delay, show a copy prompt.
  setTimeout(() => {
    // If the browser didn't switch apps, help the user copy the text.
    // (This isn't perfect detection, but it's a practical fallback.)
    try {
      if (document.visibilityState === "visible") {
        const fallbackText =
          "Your device/browser didn't open Messages automatically.\n\n" +
          "Copy this and text it to " + phoneE164 + ":\n\n" +
          message;

        // Try clipboard first
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(message).then(() => {
            alert(fallbackText + "\n\n✅ Message copied to clipboard.");
          }).catch(() => {
            alert(fallbackText);
          });
        } else {
          alert(fallbackText);
        }
      }
    } catch {
      // do nothing
    }
  }, 600);
}

// Demo form handlers (no backend)
function handleForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());

    // Build a clean SMS body
    const message =
      "Detail Request:\n" +
      Object.entries(data)
        .map(([k, v]) => `${k}: ${String(v).trim()}`)
        .join("\n");

    // Your business number (keep in E.164 for humans; helper strips for URI)
    openSMS({
      phoneE164: "+12033993320",
      message
    });
  });
}

// Custom file input label
(function () {
  const input = document.getElementById("photos");
  const nameEl = document.getElementById("fileName");
  if (!input || !nameEl) return;

  // clicking the fake button should open picker
  const btn = input.closest(".file-field")?.querySelector(".file-btn");
  if (btn) btn.addEventListener("click", () => input.click());

  input.addEventListener("change", () => {
    const files = input.files ? Array.from(input.files) : [];
    if (files.length === 0) {
      nameEl.textContent = ""; // show nothing (no "No file chosen")
    } else if (files.length === 1) {
      nameEl.textContent = files[0].name;
    } else {
      nameEl.textContent = `${files.length} photos selected`;
    }
  });
})();

handleForm("quickForm");