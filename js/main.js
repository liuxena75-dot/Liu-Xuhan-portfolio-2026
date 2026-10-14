/* Xena Liu — Portfolio interactions */
(function () {
  "use strict";

  /* ---------- language toggle ---------- */
  var html = document.documentElement;

  function setLang(l) {
    html.setAttribute("data-lang", l);
    html.setAttribute("lang", l === "zh" ? "zh-CN" : "en");
    try { localStorage.setItem("xena-lang", l); } catch (e) {}
    var btn = document.getElementById("lang-toggle");
    if (btn) btn.setAttribute("aria-pressed", l === "en" ? "true" : "false");
  }

  var saved = null;
  try { saved = localStorage.getItem("xena-lang"); } catch (e) {}
  setLang(saved === "en" ? "en" : "zh");

  document.addEventListener("click", function (e) {
    var t = e.target.closest("#lang-toggle");
    if (t) setLang(html.getAttribute("data-lang") === "zh" ? "en" : "zh");
  });

  /* ---------- nav: scrolled state + mobile menu ---------- */
  var nav = document.querySelector(".site-nav");
  var navToggle = document.getElementById("nav-toggle");
  var navLinks = document.getElementById("nav-links");

  function onScroll() {
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      navToggle.classList.toggle("open");
      navLinks.classList.toggle("open");
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        navToggle.classList.remove("open");
        navLinks.classList.remove("open");
      }
    });
  }

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- lazy video covers: load & play only on click ---------- */
  document.querySelectorAll(".video-shell").forEach(function (shell) {
    var cover = shell.querySelector(".video-cover");
    var video = shell.querySelector("video");
    if (!cover || !video) return;
    // if the local video file is unavailable (e.g. not published online), fall back to YouTube
    video.addEventListener("error", function () {
      var yt = video.getAttribute("data-yt");
      if (yt) window.open(yt, "_blank", "noopener,noreferrer");
    });
    cover.addEventListener("click", function () {
      if (!video.getAttribute("src") && video.getAttribute("data-src")) {
        video.setAttribute("src", video.getAttribute("data-src"));
      }
      video.controls = true;
      video.play();
      cover.classList.add("hidden");
    });
  });

  /* ---------- image lightbox (data-zoom) ---------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lb-open");
  }

  if (lightbox && lightboxImg) {
    document.querySelectorAll("img[data-zoom]").forEach(function (img) {
      img.addEventListener("click", function () {
        lightboxImg.setAttribute("src", img.getAttribute("src"));
        lightboxImg.setAttribute("alt", img.getAttribute("alt") || "");
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("lb-open");
      });
    });
    lightbox.addEventListener("click", closeLightbox);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLightbox();
    });
  }

  /* ---------- footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
