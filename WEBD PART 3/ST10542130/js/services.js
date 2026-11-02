/* Products & Services page: dynamic rendering, live search, category filter, sorting, details modal */
(function () {
    'use strict';
    var grid = document.getElementById('service-grid');
    if (!grid || !window.FF || !FF.services) return;

    var search = document.getElementById('service-search');
    var category = document.getElementById('service-category');
    var sort = document.getElementById('service-sort');
    var count = document.getElementById('result-count');
    var reset = document.getElementById('service-reset');

    /* Fill the category <select> from the data (dynamic DOM creation) */
    var cats = [];
    FF.services.forEach(function (s) { if (cats.indexOf(s.category) === -1) cats.push(s.category); });
    cats.sort().forEach(function (c) {
        var o = document.createElement('option');
        o.value = c;
        o.textContent = c;
        category.appendChild(o);
    });

    function showSkeletons() {
        grid.innerHTML = '';
        for (var i = 0; i < 6; i++) {
            var s = document.createElement('div');
            s.className = 'skeleton';
            grid.appendChild(s);
        }
    }

    function buildCard(service, index) {
        var card = document.createElement('article');
        card.className = 'card reveal visible';
        card.style.animation = 'fadeUp 0.5s ease ' + (index * 0.06) + 's both';

        var tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = service.category;

        var h = document.createElement('h3');
        h.textContent = service.name;

        var p = document.createElement('p');
        p.textContent = service.summary;

        var actions = document.createElement('div');
        actions.className = 'card-actions';

        var more = document.createElement('button');
        more.type = 'button';
        more.className = 'btn btn-secondary';
        more.textContent = 'Learn more';
        more.setAttribute('aria-label', 'Learn more about ' + service.name);
        more.addEventListener('click', function () { openDetails(service); });

        actions.appendChild(more);
        card.appendChild(tag);
        card.appendChild(h);
        card.appendChild(p);
        card.appendChild(actions);
        return card;
    }

    function openDetails(service) {
        var wrap = document.createElement('div');
        var p1 = document.createElement('p');
        p1.textContent = service.details;
        var p2 = document.createElement('p');
        var strong = document.createElement('strong');
        strong.textContent = 'Who it helps: ';
        p2.appendChild(strong);
        p2.appendChild(document.createTextNode(service.audience));
        var link = document.createElement('a');
        link.className = 'btn';
        link.href = 'enquiry.html?service=' + encodeURIComponent(service.id);
        link.textContent = 'Enquire about this service';
        wrap.appendChild(p1);
        wrap.appendChild(p2);
        wrap.appendChild(link);
        FF.openModal(service.name, wrap);
    }

    function getResults() {
        var q = search.value.trim().toLowerCase();
        var cat = category.value;
        var list = FF.services.filter(function (s) {
            var matchesCat = !cat || s.category === cat;
            var hay = (s.name + ' ' + s.summary + ' ' + s.details + ' ' + s.category).toLowerCase();
            return matchesCat && (!q || hay.indexOf(q) !== -1);
        });
        list.sort(function (a, b) {
            if (sort.value === 'za') return b.name.localeCompare(a.name);
            if (sort.value === 'category') return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
            return a.name.localeCompare(b.name);
        });
        return list;
    }

    function render() {
        var list = getResults();
        grid.innerHTML = '';
        if (!list.length) {
            var empty = document.createElement('div');
            empty.className = 'empty-state';
            var p = document.createElement('p');
            p.textContent = 'No services match your search. Try a different word or clear the filters.';
            empty.appendChild(p);
            grid.appendChild(empty);
        } else {
            list.forEach(function (s, i) { grid.appendChild(buildCard(s, i)); });
        }
        count.textContent = list.length + (list.length === 1 ? ' service found' : ' services found');
    }

    /* the search box lives in a <form>: stop Enter from reloading the page */
    search.form.addEventListener('submit', function (e) { e.preventDefault(); });

    var timer = null;
    search.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(render, 150); /* debounce */
    });
    category.addEventListener('change', render);
    sort.addEventListener('change', render);
    reset.addEventListener('click', function () {
        search.value = '';
        category.value = '';
        sort.value = 'az';
        render();
        search.focus();
    });

    /* simulate loading from a data source, then render */
    showSkeletons();
    count.textContent = 'Loading services...';
    setTimeout(render, 450);
})();
