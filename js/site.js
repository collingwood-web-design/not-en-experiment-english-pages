(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  var yearEl = document.getElementById("footer-date");
  if (yearEl) {
    var now = new Date();
    var months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    yearEl.textContent =
      months[now.getMonth()] + " " + now.getDate() + ", " + now.getFullYear();
  }

  var typeRadios = document.querySelectorAll('input[name="vape-type"]');
  var disposable = document.getElementById("calc-disposable");
  var refillable = document.getElementById("calc-refillable");

  function showType() {
    var type = document.querySelector('input[name="vape-type"]:checked');
    if (!type || !disposable || !refillable) return;
    var isDisp = type.value === "disposable";
    disposable.classList.toggle("hidden", !isDisp);
    refillable.classList.toggle("hidden", isDisp);
    calculate();
  }

  typeRadios.forEach(function (r) {
    r.addEventListener("change", showType);
  });

  function num(id) {
    var el = document.getElementById(id);
    if (!el) return 0;
    var v = parseFloat(el.value);
    return isNaN(v) ? 0 : v;
  }

  function money(n) {
    return n ? n.toFixed(2) : "";
  }

  function setVal(id, n) {
    var el = document.getElementById(id);
    if (el) el.value = money(n);
  }

  function calculate() {
    var type = document.querySelector('input[name="vape-type"]:checked');
    if (!type) return;
    if (type.value === "disposable") {
      var week = num("vapes-week") * num("price-vape");
      setVal("disp-week", week);
      setVal("disp-month", (week * 52) / 12);
      setVal("disp-year", week * 52);
    } else {
      var rweek =
        num("pods-week") * num("price-pod") +
        num("refills-week") * num("price-refill");
      setVal("ref-week", rweek);
      setVal("ref-month", (rweek * 52) / 12);
      setVal("ref-year", rweek * 52);
    }
  }

  ["vapes-week", "price-vape", "pods-week", "price-pod", "refills-week", "price-refill"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("input", calculate);
  });

  showType();

  var contact = document.getElementById("contact-form");
  if (contact) {
    contact.addEventListener("submit", function (e) {
      e.preventDefault();
      if (document.getElementById("website") && document.getElementById("website").value) {
        return;
      }
      var note = document.getElementById("form-note");
      if (note) {
        note.textContent =
          "Thanks. This static copy of the site does not send messages. Please use the live form at notanexperiment.ca if you need a reply.";
      }
    });
  }
})();
