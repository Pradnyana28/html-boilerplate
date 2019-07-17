(function ($) {
    "use strict";

    // PRELOADER
    $(window).on('load', function(){
        const preloader = $('.preloader');
        preloader.fadeOut(1000);
    });

    // MAPS
    let mapWrapper = $('#maps-wrapper');
    let dataLatitude = mapWrapper.data('latitude');
    let dataLongitude = mapWrapper.data('longitude');
    let dataMarker = mapWrapper.data('marker');

    var cities = L.layerGroup();
    L.marker([-8.7000773, 115.1899732]).bindPopup('This is Littleton, CO.').addTo(cities);

    let mapBoxAttr = '';
    let mapBoxURL = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    let grayscale = L.tileLayer(mapBoxURL, { id: 'mapbox.light', attribution: mapBoxAttr });

    let maps = L.map('maps-wrapper', {
        center: [dataLatitude, dataLongitude],
        zoom: 13,
        layers: [grayscale, cities]
    });
}(jQuery))