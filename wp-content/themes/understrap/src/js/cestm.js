(function ($) {
    "use strict";

    // PRELOADER
    $(window).on('load', function () {
        var preloader = $('.preloader');
        preloader.fadeOut(1000);
    });

    // MAPS
    var mapWrapper = $('#maps-wrapper');
    var dataLatitude = mapWrapper.data('latitude');
    var dataLongitude = mapWrapper.data('longitude');
    var dataMarker = mapWrapper.data('marker');

    var cities = L.layerGroup();
    L.marker([-8.7000773, 115.1899732]).bindPopup('This is Littvaron, CO.').addTo(cities);

    var mapBoxAttr = '';
    var mapBoxURL = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    var grayscale = L.tileLayer(mapBoxURL, { id: 'mapbox.light', attribution: mapBoxAttr });

    var maps = L.map('maps-wrapper', {
        center: [dataLatitude, dataLongitude],
        zoom: 13,
        layers: [grayscale, cities]
    });
}(jQuery))