/* Theme switcher behaviour for the three-way Auto / Light / Dark control.
   The stored choice is applied before first paint by a small inline script in
   <head>; this file only connects the control to localStorage and the
   [data-theme] attribute on <html>. With JavaScript disabled the attribute is
   never set, <noscript> hides the control, and the site follows the operating
   system preference through the prefers-color-scheme media query. */
(function () {
  "use strict";

  var STORAGE_KEY = "theme";
  var root = document.documentElement;
  var control = document.querySelector(".theme-switch");
  if (!control) return;

  var inputs = control.querySelectorAll('input[name="theme"]');

  function readStored() {
    try {
      var value = window.localStorage.getItem(STORAGE_KEY);
      return value === "light" || value === "dark" ? value : "auto";
    } catch (error) {
      // Storage can be blocked (private mode). The page still renders; the
      // choice simply does not persist across visits.
      return "auto";
    }
  }

  function writeStored(value) {
    try {
      if (value === "auto") {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        window.localStorage.setItem(STORAGE_KEY, value);
      }
    } catch (error) {
      // As above: persistence is best-effort, the visible choice still applies.
    }
  }

  function apply(value) {
    if (value === "auto") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", value);
    }
  }

  function sync(value) {
    for (var i = 0; i < inputs.length; i += 1) {
      inputs[i].checked = inputs[i].value === value;
    }
  }

  var current = readStored();
  apply(current);
  sync(current);

  for (var i = 0; i < inputs.length; i += 1) {
    inputs[i].addEventListener("change", function () {
      if (!this.checked) return;
      current = this.value;
      writeStored(current);
      apply(current);
      sync(current);
    });
  }
})();
