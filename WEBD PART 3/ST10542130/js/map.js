/* Interactive map (Leaflet + OpenStreetMap) - contact page */
(function () {
    'use strict';
    var holder = document.getElementById('map');
    if (!holder) return;
    if (typeof L === 'undefined') {
        holder.textContent = 'The interactive map could not be loaded. Please check your internet connection.';
        return;
    }

    /* City-centre coordinates for illustration. Replace with the organisation's actual addresses. */
    var places = [
        { name: 'Johannesburg', lat: -26.2041, lng: 28.0473, note: 'Gauteng region' },
        { name: 'Cape Town', lat: -33.9249, lng: 18.4241, note: 'Western Cape region' },
        { name: 'Durban', lat: -29.8587, lng: 31.0218, note: 'KwaZulu-Natal region' }
    ];

    var map = L.map('map', { scrollWheelZoom: false }).setView([-29.0, 25.0], 5);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var bounds = [];
    places.forEach(function (p) {
        var node = document.createElement('div');
        var b = document.createElement('strong');
        b.textContent = p.name;
        node.appendChild(b);
        node.appendChild(document.createElement('br'));
        node.appendChild(document.createTextNode(p.note));
        L.marker([p.lat, p.lng]).addTo(map).bindPopup(node);
        bounds.push([p.lat, p.lng]);
    });
    map.fitBounds(bounds, { padding: [40, 40] });

    /* "Find my nearest area" - uses the Geolocation API and simple distance maths */
    var btn = document.getElementById('nearest-btn');
    var out = document.getElementById('nearest-result');
    if (btn) {
        btn.addEventListener('click', function () {
            if (!navigator.geolocation) { out.textContent = 'Geolocation is not supported by your browser.'; return; }
            out.textContent = 'Finding your location...';
            navigator.geolocation.getCurrentPosition(function (pos) {
                var best = null;
                places.forEach(function (p) {
                    var d = map.distance([pos.coords.latitude, pos.coords.longitude], [p.lat, p.lng]) / 1000;
                    if (!best || d < best.d) best = { p: p, d: d };
                });
                out.textContent = 'Your nearest area is ' + best.p.name + ' (about ' + Math.round(best.d) + ' km away).';
                L.circleMarker([pos.coords.latitude, pos.coords.longitude], { radius: 8 }).addTo(map).bindPopup('You are here');
            }, function () {
                out.textContent = 'We could not get your location. You can still use the map above.';
            });
        });
    }
})();
