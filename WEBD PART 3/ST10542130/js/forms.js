/* Forms: JavaScript validation, error handling, AJAX submission, email compilation (contact) and quote (enquiry) */
(function () {
    'use strict';

    /* ===== Configuration ===== */
    /* Recipient used for the compiled email on contact.html. Change to the organisation's real address. */
    var RECIPIENT = 'info@foodforwardsa.example';

    /* ===== Validation rules (return an error message, or '' when valid) ===== */
    var NAME_RE = /^[A-Za-zÀ-ɏ][A-Za-zÀ-ɏ'\- ]+$/;
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var PHONE_RE = /^(\+27|0)[1-9][0-9]{8}$/; /* South African numbers, e.g. 012 345 6789 or +27 82 123 4567 */

    var rules = {
        name: function (v) {
            if (!v) return 'Please enter your full name.';
            if (v.length < 2 || v.length > 60) return 'Your name must be between 2 and 60 characters.';
            if (!NAME_RE.test(v)) return 'Use letters, spaces, hyphens or apostrophes only.';
            return '';
        },
        email: function (v) {
            if (!v) return 'Please enter your email address.';
            if (v.length > 254 || !EMAIL_RE.test(v)) return 'Enter a valid email, for example name@example.com.';
            return '';
        },
        phoneOptional: function (v) {
            if (!v) return '';
            return PHONE_RE.test(v.replace(/[\s\-()]/g, '')) ? '' : 'Enter a valid South African number, e.g. 012 345 6789 or +27 82 123 4567.';
        },
        phoneRequired: function (v) {
            if (!v) return 'Please enter a phone number.';
            return PHONE_RE.test(v.replace(/[\s\-()]/g, '')) ? '' : 'Enter a valid South African number, e.g. 012 345 6789 or +27 82 123 4567.';
        },
        message: function (v) {
            if (!v) return 'Please type your message.';
            if (v.length < 10) return 'Your message must be at least 10 characters.';
            if (v.length > 1000) return 'Your message must be 1000 characters or fewer.';
            return '';
        },
        notes: function (v) {
            return v.length > 500 ? 'Notes must be 500 characters or fewer.' : '';
        },
        select: function (v) {
            return v ? '' : 'Please choose an option.';
        },
        quantity: function (v) {
            if (!v) return 'Please enter a quantity.';
            var n = Number(v);
            if (!/^\d+$/.test(v) || n < 1 || n > 10000) return 'Enter a whole number between 1 and 10 000.';
            return '';
        },
        date: function (v) {
            if (!v) return 'Please choose a preferred date.';
            var d = new Date(v + 'T00:00:00');
            if (isNaN(d.getTime())) return 'Enter a valid date.';
            var today = new Date();
            today.setHours(0, 0, 0, 0);
            var max = new Date(today);
            max.setFullYear(max.getFullYear() + 1);
            if (d < today) return 'The date cannot be in the past.';
            if (d > max) return 'Please choose a date within the next 12 months.';
            return '';
        }
    };

    /* exposed so the rules can be unit-tested */
    window.FF = window.FF || {};
    FF.validators = rules;

    /* ===== Helpers ===== */
    function errorBox(field) {
        return document.getElementById(field.id + '-error');
    }

    function validateField(field) {
        var ruleName = field.getAttribute('data-rule');
        if (!ruleName || !rules[ruleName]) return true;
        var msg = rules[ruleName](field.value.trim());
        var box = errorBox(field);
        if (box) box.textContent = msg;
        field.classList.toggle('invalid', !!msg);
        field.classList.toggle('valid', !msg && field.value.trim() !== '');
        field.setAttribute('aria-invalid', msg ? 'true' : 'false');
        return !msg;
    }

    function validateRadio(form) {
        var group = form.querySelector('[data-radio-group]');
        if (!group) return true;
        var checked = form.querySelector('input[name="reason"]:checked');
        var box = document.getElementById('reason-error');
        box.textContent = checked ? '' : 'Please choose a reason for contacting us.';
        return !!checked;
    }

    function validateForm(form) {
        var fields = Array.prototype.slice.call(form.querySelectorAll('[data-rule]'));
        var firstBad = null;
        fields.forEach(function (f) {
            if (!validateField(f) && !firstBad) firstBad = f;
        });
        if (!validateRadio(form) && !firstBad) firstBad = form.querySelector('input[name="reason"]');
        if (firstBad) firstBad.focus();
        return !firstBad;
    }

    function attachLiveValidation(form) {
        form.querySelectorAll('[data-rule]').forEach(function (f) {
            f.addEventListener('blur', function () { validateField(f); });
            f.addEventListener('input', function () {
                if (f.classList.contains('invalid') || f.classList.contains('valid')) validateField(f);
            });
        });
        form.querySelectorAll('input[name="reason"]').forEach(function (r) {
            r.addEventListener('change', function () { validateRadio(form); });
        });
        /* live character counters */
        form.querySelectorAll('[data-counter]').forEach(function (area) {
            var out = document.getElementById(area.getAttribute('data-counter'));
            var max = area.getAttribute('maxlength');
            function update() { out.textContent = area.value.length + ' / ' + max + ' characters'; }
            area.addEventListener('input', update);
            update();
        });
    }

    function showStatus(box, type, nodes) {
        box.className = 'form-status show ' + type;
        box.innerHTML = '';
        nodes.forEach(function (n) { box.appendChild(n); });
        box.setAttribute('tabindex', '-1');
        box.focus();
        box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function el(tag, text, cls) {
        var e = document.createElement(tag);
        if (text) e.textContent = text;
        if (cls) e.className = cls;
        return e;
    }

    /* AJAX submission. If the form action is still the placeholder, the request is simulated
       so the page works offline / before a real endpoint (e.g. Formspree) is configured. */
    function ajaxSubmit(form) {
        var action = form.getAttribute('action') || '';
        if (!action || action.indexOf('YOUR_FORM_ID') !== -1) {
            return new Promise(function (resolve) { setTimeout(function () { resolve({ simulated: true }); }, 700); });
        }
        return fetch(action, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        }).then(function (res) {
            if (!res.ok) throw new Error('Server responded with ' + res.status);
            return { simulated: false };
        });
    }

    function isSpam(form) {
        var trap = form.querySelector('.honeypot input');
        return trap && trap.value !== '';
    }

    /* ===== CONTACT FORM ===== */
    function initContact(form) {
        var status = document.getElementById('form-status');
        var submitBtn = form.querySelector('button[type="submit"]');
        attachLiveValidation(form);

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (isSpam(form)) return;
            if (!validateForm(form)) {
                showStatus(status, 'error', [el('p', 'Please correct the highlighted fields and try again.')]);
                return;
            }

            var data = {
                name: form.elements['name'].value.trim(),
                email: form.elements['email'].value.trim(),
                phone: form.elements['phone'].value.trim() || 'Not provided',
                reason: form.querySelector('input[name="reason"]:checked').value,
                message: form.elements['message'].value.trim()
            };

            var subject = 'FoodForward SA enquiry: ' + data.reason;
            var body = 'Hello FoodForward SA,\n\n' + data.message +
                '\n\n--\nName: ' + data.name +
                '\nEmail: ' + data.email +
                '\nPhone: ' + data.phone +
                '\nReason for contact: ' + data.reason;

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            ajaxSubmit(form).then(function (result) {
                var mailto = 'mailto:' + RECIPIENT + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
                var link = el('a', 'Open the email in my email app', 'btn');
                link.href = mailto;

                var nodes = [
                    el('h3', 'Thank you, ' + data.name.split(' ')[0] + '!'),
                    el('p', result.simulated
                        ? 'Your message was validated successfully. To make sure it reaches us, send the email below to ' + RECIPIENT + '.'
                        : 'Your message was sent successfully. We will respond to ' + data.email + '. You can also send it as an email below.'),
                    el('p', 'To: ' + RECIPIENT + '\nSubject: ' + subject + '\n\n' + body, 'email-preview'),
                    link
                ];
                showStatus(status, 'success', nodes);
                form.reset();
                form.querySelectorAll('.valid,.invalid').forEach(function (f) { f.classList.remove('valid', 'invalid'); });
                form.querySelectorAll('[data-counter]').forEach(function (a) { a.dispatchEvent(new Event('input')); });
            }).catch(function () {
                showStatus(status, 'error', [el('p', 'Sorry, we could not send your message right now. Please try again, or email us at ' + RECIPIENT + '.')]);
            }).then(function () {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            });
        });
    }

    /* ===== ENQUIRY FORM ===== */
    function formatRand(n) {
        return 'R' + n.toLocaleString('en-ZA', { maximumFractionDigits: 0 });
    }

    function initEnquiry(form) {
        var status = document.getElementById('form-status');
        var submitBtn = form.querySelector('button[type="submit"]');
        var serviceSel = form.elements['service'];
        var qtyLabel = document.getElementById('quantity-label');
        attachLiveValidation(form);

        /* Fill the service select from the pricing data (dynamic DOM) */
        Object.keys(FF.pricing).forEach(function (key) {
            var o = document.createElement('option');
            o.value = key;
            o.textContent = FF.pricing[key].label;
            serviceSel.appendChild(o);
        });

        /* Pre-select from ?service=<id> links on the services page */
        var map = {
            'warehouse-foodbanking': 'warehouse-collect',
            'virtual-foodbanking': 'warehouse-collect',
            'mother-child-nutrition': 'donate-meals',
            'food-gardens-connect': 'garden-support',
            'volunteer-events': 'volunteer-group',
            'corporate-partnerships': 'corporate-package'
        };
        var param = new URLSearchParams(location.search).get('service');
        if (param && map[param]) serviceSel.value = map[param];

        /* Live estimate while the user types */
        var live = document.getElementById('live-estimate');
        function updateLive() {
            var p = FF.pricing[serviceSel.value];
            var q = Number(form.elements['quantity'].value);
            if (!p) { live.textContent = 'Choose a service to see an estimate.'; return; }
            qtyLabel.textContent = p.unitLabel === 'per meal' ? 'Number of meals:' :
                p.unitLabel === 'per parcel' ? 'Number of parcels:' :
                p.unitLabel === 'per garden' ? 'Number of gardens:' :
                p.unitLabel === 'per month' ? 'Number of months:' : 'Number of people / collections:';
            if (p.unit === 0) { live.textContent = 'Estimate: no charge. ' + p.availability + '.'; return; }
            live.textContent = q > 0 ? 'Estimate: ' + formatRand(p.unit * q) + ' (' + formatRand(p.unit) + ' ' + p.unitLabel + ')' : 'Enter a quantity to see an estimate.';
        }
        serviceSel.addEventListener('change', updateLive);
        form.elements['quantity'].addEventListener('input', updateLive);
        updateLive();

        /* min date = today (HTML5 hint, JS re-checks it) */
        var today = new Date();
        var iso = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
        form.elements['date'].setAttribute('min', iso);

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (isSpam(form)) return;
            if (!validateForm(form)) {
                showStatus(status, 'error', [el('p', 'Please correct the highlighted fields and try again.')]);
                return;
            }

            var p = FF.pricing[serviceSel.value];
            var qty = Number(form.elements['quantity'].value);
            var name = form.elements['name'].value.trim();
            var email = form.elements['email'].value.trim();
            var dateStr = form.elements['date'].value;
            var date = new Date(dateStr + 'T00:00:00');

            /* Process the enquiry: cost + availability response */
            var total = p.unit * qty;
            var avail = p.availability;
            var day = date.getDay();
            var notes = [];
            if (serviceSel.value === 'garden-support') {
                var earliest = new Date();
                earliest.setDate(earliest.getDate() + 28);
                if (date < earliest) notes.push('Your date is earlier than our next intake, so the earliest start would be around ' + earliest.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' }) + '.');
            }
            if ((serviceSel.value === 'volunteer-group' || serviceSel.value === 'warehouse-collect') && (day === 0 || day === 6)) {
                notes.push('Your chosen date is on a weekend. Weekend sessions are by arrangement only, so we will confirm with you.');
            }
            if (serviceSel.value === 'volunteer-group' && qty > 30) {
                notes.push('Large groups may be split across more than one session.');
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Processing...';

            ajaxSubmit(form).then(function () {
                var box = el('div', null, 'quote-box');
                var dl = document.createElement('dl');
                function row(k, v) { dl.appendChild(el('dt', k)); dl.appendChild(el('dd', v)); }
                row('Service', p.label);
                row('Quantity', String(qty));
                row('Estimated cost', p.unit === 0 ? 'No charge' : formatRand(total) + ' (' + formatRand(p.unit) + ' ' + p.unitLabel + ')');
                row('Availability', avail);
                row('Preferred date', date.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
                box.appendChild(dl);

                var nodes = [
                    el('h3', 'Thank you, ' + name.split(' ')[0] + '. Here is your enquiry response:'),
                    box
                ];
                notes.forEach(function (n) { nodes.push(el('p', n)); });
                nodes.push(el('p', 'A confirmation will be sent to ' + email + '. Figures are estimates only and will be confirmed by our team.', 'legal-note'));
                showStatus(status, 'success', nodes);
                form.reset();
                form.querySelectorAll('.valid,.invalid').forEach(function (f) { f.classList.remove('valid', 'invalid'); });
                updateLive();
            }).catch(function () {
                showStatus(status, 'error', [el('p', 'Sorry, we could not process your enquiry right now. Please try again shortly.')]);
            }).then(function () {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Get My Response';
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        var c = document.querySelector('form[data-form="contact"]');
        var e = document.querySelector('form[data-form="enquiry"]');
        if (c) initContact(c);
        if (e && window.FF && FF.pricing) initEnquiry(e);
    });
})();
