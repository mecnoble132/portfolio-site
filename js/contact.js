import { site } from "../data/site.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const rules = {
  name: (v) => (v.trim() ? "" : "Please enter your name."),
  email: (v) => (EMAIL_RE.test(v.trim()) ? "" : "Please enter a valid email address."),
  message: (v) => (v.trim().length >= 10 ? "" : "Please write at least 10 characters."),
};

function setError(field, message) {
  const error = document.querySelector(`#${field.id}-error`);
  error.textContent = message;
  field.setAttribute("aria-invalid", message ? "true" : "false");
}

export function initContact(form) {
  const status = form.querySelector("#form-status");
  const submit = form.querySelector("button[type='submit']");
  const fields = [...form.querySelectorAll("[name]")].filter((f) => rules[f.name]);

  const showStatus = (text, type) => {
    status.textContent = text;
    status.dataset.type = type;
  };

  fields.forEach((field) => {
    field.addEventListener("blur", () => setError(field, rules[field.name](field.value)));
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") setError(field, rules[field.name](field.value));
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    showStatus("", "");

    const errors = fields.map((f) => {
      const message = rules[f.name](f.value);
      setError(f, message);
      return message;
    });
    if (errors.some(Boolean)) {
      fields.find((f) => f.getAttribute("aria-invalid") === "true").focus();
      return;
    }

    // Honeypot: bots fill the hidden field. Pretend success and send nothing.
    if (form.elements["hp_check"].value) {
      showStatus("Thanks! Your message was sent.", "success");
      form.reset();
      return;
    }

    if (!site.formEndpoint) {
      showStatus(`The form isn't connected yet. Please email ${site.email} instead.`, "error");
      return;
    }

    submit.disabled = true;
    submit.textContent = "Sending…";
    try {
      const response = await fetch(site.formEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      showStatus("Thanks! Your message was sent.", "success");
      form.reset();
    } catch {
      showStatus(`Something went wrong. Please email ${site.email} instead.`, "error");
    } finally {
      submit.disabled = false;
      submit.textContent = "Send message";
    }
  });
}
