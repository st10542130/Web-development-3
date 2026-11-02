/* Home page: dynamically loaded "latest updates" with Load more */
(function () {
    'use strict';
    var list = document.getElementById('updates-list');
    var btn = document.getElementById('load-more');
    if (!list || !btn || !window.FF || !FF.updates) return;

    var shown = 0;
    var step = 3;
    var items = FF.updates.slice().sort(function (a, b) { return b.date.localeCompare(a.date); });

    function formatDate(iso) {
        var d = new Date(iso + 'T00:00:00');
        return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    function loadMore() {
        var next = items.slice(shown, shown + step);
        next.forEach(function (u) {
            var art = document.createElement('article');
            art.className = 'update-item';
            var t = document.createElement('time');
            t.setAttribute('datetime', u.date);
            t.textContent = formatDate(u.date);
            var h = document.createElement('h3');
            h.textContent = u.title;
            var p = document.createElement('p');
            p.textContent = u.body;
            art.appendChild(t);
            art.appendChild(h);
            art.appendChild(p);
            list.appendChild(art);
        });
        shown += next.length;
        if (shown >= items.length) {
            btn.hidden = true;
        }
    }

    btn.addEventListener('click', loadMore);
    loadMore();
})();
