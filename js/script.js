/* ==================================================
   CELEBSO Landing Page - Scripts
   File: js/script.js
   ================================================== */

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        updateCopyrightYear();
        initTheme();
        initMobileMenu();
        initReveal();
        initReelSound();
        initViewAll();
        initNavScroll();
        initCardTilt();
    });

    function initTheme() {
        var buttons = document.querySelectorAll(".theme-toggle");
        if (!buttons.length) return;

        buttons.forEach(function (btn) {
            btn.addEventListener("click", function () {
                var light = document.documentElement.classList.toggle("light-mode");
                try {
                    localStorage.setItem("celebso-theme", light ? "light" : "dark");
                } catch (e) {}
            });
        });
    }

    function updateCopyrightYear() {
        var copy = document.querySelector(".copy");
        if (copy) {
            copy.textContent = "\u00A9 " + new Date().getFullYear() + " ANTELLAY Tech. All Rights Reserved. A Celebso Group Company.";
        }
    }

    function initMobileMenu() {
        var toggle = document.querySelector(".nav-toggle");
        var menu = document.querySelector(".mobile-menu");
        if (!toggle || !menu) return;

        toggle.addEventListener("click", function () {
            var isOpen = menu.classList.toggle("open");
            toggle.classList.toggle("active", isOpen);
        });

        var links = menu.querySelectorAll("a");
        links.forEach(function (link) {
            link.addEventListener("click", function () {
                menu.classList.remove("open");
                toggle.classList.remove("active");
            });
        });
    }

    function initViewAll() {
        var btn = document.querySelector(".view");
        var modal = document.getElementById("reelsModal");
        if (!btn || !modal) return;

        btn.addEventListener("click", function () {
            modal.classList.add("open");
            document.body.style.overflow = "hidden";
        });

        var close = modal.querySelector(".reels-modal-close");
        close.addEventListener("click", closeModal);

        modal.addEventListener("click", function (e) {
            if (e.target === modal) closeModal();
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
        });

        function closeModal() {
            modal.classList.remove("open");
            document.body.style.overflow = "";
        }
    }

    function initReelSound() {
        var buttons = document.querySelectorAll(".reel-mute");
        if (!buttons.length) return;

        buttons.forEach(function (btn) {
            btn.addEventListener("click", function () {
                var reel = btn.closest(".reel");
                var video = reel.querySelector("video");
                if (!video) return;
                var muted = video.muted;
                video.muted = !muted;
                btn.textContent = muted ? "🔊" : "🔇";
                btn.setAttribute("aria-label", muted ? "Mute" : "Unmute");
            });
        });
    }

    function initReveal() {
        var els = document.querySelectorAll(".reveal");
        if (!("IntersectionObserver" in window)) {
            els.forEach(function (el) { el.classList.add("visible"); });
            return;
        }
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        els.forEach(function (el) { obs.observe(el); });
    }

    function initNavScroll() {
        var links = document.querySelectorAll(".menu a, .mobile-menu a");
        if (!links.length) return;

        var sections = {};
        links.forEach(function (link) {
            var href = link.getAttribute("href");
            if (!href || href.charAt(0) !== "#" || href.length < 2) return;
            var target = document.querySelector(href);
            if (!target) return;
            sections[href] = target;
        });

        function setActive(id) {
            links.forEach(function (link) {
                var href = link.getAttribute("href");
                if (!href || href.charAt(0) !== "#") return;
                link.classList.toggle("active", href === id);
            });
        }

        function onScroll() {
            var scrollY = window.scrollY;
            var current = "#home";
            var offset = 100;
            Object.keys(sections)
                .map(function (href) { return { href: href, top: sections[href].offsetTop }; })
                .sort(function (a, b) { return a.top - b.top; })
                .forEach(function (item) {
                    if (item.top - offset <= scrollY) {
                        current = item.href;
                    }
                });
            setActive(current);
        }

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
    }

    function initCardTilt() {
        var cards = document.querySelectorAll(".live-card");
        if (!cards.length) return;
        if (window.matchMedia && window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;

        cards.forEach(function (card) {
            card.addEventListener("mousemove", function (e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                var rx = ((y / rect.height) - 0.5) * 10;
                var ry = ((x / rect.width) - 0.5) * 10;
                card.style.transform = "perspective(700px) translateY(-6px) rotateX(" + rx + "deg) rotateY(" + ry + "deg)";
            });
            card.addEventListener("mouseleave", function () {
                card.style.transform = "";
            });
        });
    }
})();