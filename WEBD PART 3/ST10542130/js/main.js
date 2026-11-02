/* FoodForward SA - shared interactions (nav, reveal, accordion, tabs, modal, back-to-top) */
(function () {
    'use strict';

    document.documentElement.classList.add('js');

    /* Tiny helper namespace shared with the other scripts */
    var FF = (window.FF = window.FF || {});

    /* ---------- Mobile navigation + current page highlight ---------- */
    function initNav() {
        var toggle = document.querySelector('.nav-toggle');
        var list = document.getElementById('nav-list');
        if (toggle && list) {
            toggle.addEventListener('click', function () {
                var open = list.classList.toggle('open');
                toggle.setAttribute('aria-expanded', String(open));
            });
        }
        var here = location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('nav a').forEach(function (a) {
            if (a.getAttribute('href') === here) {
                a.setAttribute('aria-current', 'page');
            }
        });
    }

    /* ---------- Scroll reveal animation (IntersectionObserver) ---------- */
    function initReveal() {
        var items = document.querySelectorAll('.reveal');
        if (!('IntersectionObserver' in window)) {
            items.forEach(function (el) { el.classList.add('visible'); });
            return;
        }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        items.forEach(function (el) { io.observe(el); });
        FF.observeReveal = function (el) { io.observe(el); };
    }

    /* ---------- Back to top button ---------- */
    function initBackToTop() {
        var btn = document.createElement('button');
        btn.className = 'back-to-top';
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Back to top');
        btn.textContent = '↑';
        document.body.appendChild(btn);
        window.addEventListener('scroll', function () {
            btn.classList.toggle('show', window.scrollY > 400);
        }, { passive: true });
        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ---------- Accordion (DOM manipulation, ARIA-aware) ---------- */
    function initAccordions() {
        document.querySelectorAll('[data-accordion]').forEach(function (acc) {
            var triggers = acc.querySelectorAll('.accordion-trigger');
            triggers.forEach(function (trigger) {
                var panel = document.getElementById(trigger.getAttribute('aria-controls'));
                trigger.addEventListener('click', function () {
                    var expanded = trigger.getAttribute('aria-expanded') === 'true';
                    /* single-open behaviour: close the others */
                    triggers.forEach(function (other) {
                        var p = document.getElementById(other.getAttribute('aria-controls'));
                        other.setAttribute('aria-expanded', 'false');
                        p.style.maxHeight = null;
                    });
                    if (!expanded) {
                        trigger.setAttribute('aria-expanded', 'true');
                        panel.style.maxHeight = panel.scrollHeight + 'px';
                    }
                });
            });
        });
    }

    /* ---------- Tabs (arrow-key navigation) ---------- */
    function initTabs() {
        document.querySelectorAll('[data-tabs]').forEach(function (wrap) {
            var tabs = Array.prototype.slice.call(wrap.querySelectorAll('[role="tab"]'));
            function select(tab) {
                tabs.forEach(function (t) {
                    var on = t === tab;
                    t.setAttribute('aria-selected', String(on));
                    t.tabIndex = on ? 0 : -1;
                    var panel = document.getElementById(t.getAttribute('aria-controls'));
                    panel.hidden = !on;
                    panel.classList.toggle('active', on);
                });
            }
            tabs.forEach(function (tab, i) {
                tab.addEventListener('click', function () { select(tab); });
                tab.addEventListener('keydown', function (e) {
                    var next = null;
                    if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
                    if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
                    if (e.key === 'Home') next = tabs[0];
                    if (e.key === 'End') next = tabs[tabs.length - 1];
                    if (next) { e.preventDefault(); select(next); next.focus(); }
                });
            });
        });
    }

    /* ---------- Modal (focus trap, Esc, overlay click) ---------- */
    var overlay = null;
    var lastFocus = null;

    function closeModal() {
        if (!overlay) return;
        overlay.classList.remove('open');
        overlay.innerHTML = '';
        document.body.style.overflow = '';
        document.removeEventListener('keydown', onKey);
        if (lastFocus) lastFocus.focus();
    }

    function onKey(e) {
        if (e.key === 'Escape') { closeModal(); return; }
        if (e.key === 'Tab') {
            var focusables = overlay.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (!focusables.length) return;
            var first = focusables[0];
            var last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    }

    /* openModal(titleText, contentNode) - content is always a DOM node (no innerHTML => safe) */
    FF.openModal = function (titleText, contentNode) {
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            document.body.appendChild(overlay);
            overlay.addEventListener('click', function (e) {
                if (e.target === overlay) closeModal();
            });
        }
        lastFocus = document.activeElement;
        overlay.innerHTML = '';

        var dialog = document.createElement('div');
        dialog.className = 'modal';
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-modal', 'true');
        dialog.setAttribute('aria-labelledby', 'modal-title');

        var close = document.createElement('button');
        close.className = 'modal-close';
        close.type = 'button';
        close.setAttribute('aria-label', 'Close dialog');
        close.textContent = '×';
        close.addEventListener('click', closeModal);

        var h = document.createElement('h3');
        h.id = 'modal-title';
        h.textContent = titleText;

        dialog.appendChild(close);
        dialog.appendChild(h);
        dialog.appendChild(contentNode);
        overlay.appendChild(dialog);
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', onKey);
        close.focus();
    };
    FF.closeModal = closeModal;

    /* ---------- Boot ---------- */
    document.addEventListener('DOMContentLoaded', function () {
        initNav();
        initReveal();
        initBackToTop();
        initAccordions();
        initTabs();
    });
})();
