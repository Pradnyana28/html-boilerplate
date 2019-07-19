(function ($) {
    "use strict";

    // PRELOADER
    $(window).on('load', function () {
        var preloader = $('.preloader');
        preloader.fadeOut(1000);
    });

    // collapsing
    $(".collapse-button ").on('click', function (e) {
        var areaExpanded = $(this).attr('aria-expanded');
        if (areaExpanded === 'true') {
            $(this).removeClass('collapse-opened');
        } else {
            $(this).addClass('collapse-opened');
        }
    });

    function new_map($el) {
        var $markers = $el.find('.marker');
        var args = {
            zoom: 16,
            center: new google.maps.LatLng(0, 0),
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'tehgrayz']
            }
        };
        var stylez = [
            {
                featureType: "all",
                elementType: "all",
                stylers: [
                    { saturation: -100 }
                ]
            }
        ];

        var map = new google.maps.Map($el[0], args);
        // style to grayscale
        var mapType = new google.maps.StyledMapType(stylez, { name: "Grayscale" });
        map.mapTypes.set('tehgrayz', mapType);
        map.setMapTypeId('tehgrayz');
        // add a markers reference
        map.markers = [];
        // add markers
        $markers.each(function () {
            add_marker($(this), map);
        });
        // center map
        center_map(map);
        // return
        return map;
    }

    function add_marker($marker, map) {
        // var
        var latlng = new google.maps.LatLng($marker.attr('data-lat'), $marker.attr('data-lng'));
        // create marker
        var marker = new google.maps.Marker({
            position: latlng,
            map: map
        });
        // add to array
        map.markers.push(marker);
        // if marker contains HTML, add it to an infoWindow
        if ($marker.html()) {
            // create info window
            var infowindow = new google.maps.InfoWindow({
                content: $marker.html()
            });
            // show info window when marker is clicked
            google.maps.event.addListener(marker, 'click', function () {
                infowindow.open(map, marker);
            });
        }
    }

    function center_map(map) {
        // vars
        var bounds = new google.maps.LatLngBounds();
        // loop through all markers and create bounds
        $.each(map.markers, function (i, marker) {
            var latlng = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
            bounds.extend(latlng);
        });

        // only 1 marker?
        if (map.markers.length == 1) {
            // set center of map
            map.setCenter(bounds.getCenter());
            map.setZoom(16);
        }
        else {
            // fit to bounds
            map.setCenter(bounds.getCenter());
            map.setZoom(11);
            // map.fitBounds(bounds);
        }
    }

    // global var
    var map = null;
    $(document).ready(function () {
        $('.acf-map').each(function () {
            // create map
            map = new_map($(this));
        });
    });
}(jQuery))