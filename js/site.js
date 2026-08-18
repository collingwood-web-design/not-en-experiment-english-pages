(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  var navOpen = document.getElementById("nav-open");
  if (toggle && nav && !navOpen) {
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

  document.querySelectorAll("a.js-unity-game").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      var width = 1280;
      var height = 760;
      var left = Math.round((window.screenX || 0) + Math.max(0, (window.outerWidth - width) / 2));
      var top = Math.round((window.screenY || 0) + Math.max(0, (window.outerHeight - height) / 2));
      var popup = window.open(
        link.href,
        "naeUnityGame",
        "width=" + width + ",height=" + height + ",left=" + left + ",top=" + top + ",menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=no"
      );
      if (!popup) {
        window.location.href = link.href;
      }
    });
  });

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
    return n.toFixed(2);
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

  var sketchPath =
    "M0.6 8.5 C 12 8.7, 22 7.6, 34 6.9 C 50 6.2, 62 6.4, 74 7.2 C 86 7.9, 93 8.2, 99.4 8.6";

  var titles = document.querySelectorAll(".title-underline");
  if (titles.length) {
    titles.forEach(function (el, i) {
      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("class", "title-mark");
      svg.setAttribute("viewBox", "0 0 100 12");
      svg.setAttribute("preserveAspectRatio", "none");
      svg.setAttribute("aria-hidden", "true");
      var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", sketchPath);
      path.setAttribute("pathLength", "1");
      svg.appendChild(path);
      el.appendChild(svg);
    });

    if ("IntersectionObserver" in window) {
      var titleObserver = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-marked");
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.45, rootMargin: "0px 0px -8% 0px" }
      );
      titles.forEach(function (el) {
        titleObserver.observe(el);
      });
    } else {
      titles.forEach(function (el) {
        el.classList.add("is-marked");
      });
    }
  }

  document.querySelectorAll(".facts-carousel").forEach(function (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll(".facts-slide"));
    var prev = carousel.querySelector(".facts-prev");
    var next = carousel.querySelector(".facts-next");
    var dotsWrap = carousel.querySelector(".facts-dots");
    var loop = carousel.getAttribute("data-loop") === "true";
    var index = Math.max(0, slides.findIndex(function (slide) {
      return slide.classList.contains("is-active");
    }));

    if (!slides.length || !prev || !next || !dotsWrap) return;

    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "facts-dot" + (i === index ? " is-active" : "");
      dot.setAttribute("aria-label", "Show fact " + (i + 1));
      dot.addEventListener("click", function () {
        go(i);
      });
      dotsWrap.appendChild(dot);
    });

    function go(nextIndex) {
      if (loop) {
        nextIndex = (nextIndex + slides.length) % slides.length;
      } else {
        nextIndex = Math.max(0, Math.min(slides.length - 1, nextIndex));
      }
      index = nextIndex;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      Array.prototype.forEach.call(dotsWrap.children, function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
      prev.disabled = !loop && index === 0;
      next.disabled = !loop && index === slides.length - 1;
    }

    prev.addEventListener("click", function () {
      go(index - 1);
    });
    next.addEventListener("click", function () {
      go(index + 1);
    });
    go(index);
  });

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
