(function () {
  var EMAIL = "lessonscroatiankorijeni@gmail.com";

  // Mobile menu
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");
  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
  }
  toggle.addEventListener("click", function () {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });

  // Header border once scrolled
  var header = document.querySelector(".site-header");
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Lesson card buttons preselect the format in the form
  document.querySelectorAll("[data-format]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var radio = document.querySelector('input[name="format"][value="' + btn.dataset.format + '"]');
      if (radio) radio.checked = true;
    });
  });

  // Enquiry form: validate, then open the visitor's email app with the message filled in
  var form = document.getElementById("enquiry");
  var status = form.querySelector(".form-status");

  function setError(input, message) {
    var el = document.getElementById(input.getAttribute("aria-describedby"));
    input.setAttribute("aria-invalid", message ? "true" : "false");
    el.textContent = message;
  }

  function validate(input) {
    var value = input.value.trim();
    if (input.name === "name") {
      setError(input, value ? "" : "Please enter your name.");
    } else if (input.name === "email") {
      if (!value) setError(input, "Please enter your email so I can reply.");
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) setError(input, "That email doesn’t look right. Check for typos, e.g. name@example.com.");
      else setError(input, "");
    }
    return input.getAttribute("aria-invalid") !== "true";
  }

  ["f-name", "f-email"].forEach(function (id) {
    var input = document.getElementById(id);
    input.addEventListener("blur", function () { if (input.value) validate(input); });
    input.addEventListener("input", function () {
      if (input.getAttribute("aria-invalid") === "true") validate(input);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = form.elements.name;
    var email = form.elements.email;
    var okName = validate(name);
    var okEmail = validate(email);
    if (!okName || !okEmail) {
      (okName ? email : name).focus();
      return;
    }

    var data = new FormData(form);
    var subject = "Croatian lessons enquiry from " + data.get("name").trim();
    var body = [
      "Bok Martin,",
      "",
      "Name: " + data.get("name").trim(),
      "Email: " + data.get("email").trim(),
      "Lessons for: " + data.get("who"),
      "Format: " + data.get("format"),
      "Current level: " + data.get("level"),
      "",
      (data.get("message") || "").trim(),
    ].join("\n");

    window.location.href = "mailto:" + EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    status.textContent = "Your email app should open with your message ready. If it doesn’t, email " + EMAIL + " directly.";
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
