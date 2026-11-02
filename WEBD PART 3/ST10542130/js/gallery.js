/* Gallery page: category filter + lightbox modal */
(function () {
    'use strict';
    var grid = document.querySelector('.gallery-grid');
    if (!grid) return;

    var items = Array.prototype.slice.call(grid.querySelectorAll('.gallery-item'));
    var buttons = document.querySelectorAll('.filter-btn');
    var status = document.getElementById('gallery-status');

    buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var cat = btn.getAttribute('data-filter');
            buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
            var visible = 0;
            items.forEach(function (it) {
                var show = cat === 'all' || it.getAttribute('data-category') === cat;
                it.hidden = !show;
                if (show) visible++;
            });
            status.textContent = 'Showing ' + visible + ' of ' + items.length + ' photos';
        });
    });

    /* Lightbox */
    items.forEach(function (it) {
        var trigger = it.querySelector('button');
        var img = it.querySelector('img');
        var title = it.querySelector('h3').textContent;
        var caption = it.querySelector('p').textContent;
        trigger.addEventListener('click', function () {
            var wrap = document.createElement('div');
            var big = document.createElement('img');
            big.src = img.getAttribute('src');
            big.alt = img.getAttribute('alt');
            var p = document.createElement('p');
            p.textContent = caption;
            wrap.appendChild(big);
            wrap.appendChild(p);
            FF.openModal(title, wrap);
        });
    });
})();
