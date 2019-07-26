(function ($) {
    "use strict";

    // global variables
    var gMarkers = [];

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

    // Owl Carousel
    // $(".owl-carousel").owlCarousel({
    //     loop: true,
    //     margin: 10,
    //     nav: false,
    //     responsive: {
    //         0: { items: 1 },
    //         600: { items: 3 },
    //         1000: { items: 3 }
    //     }
    // });

    // Institutions maps
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
        // add marker id to institution options
        var markerOption = $('#institution-select').find('.' + $marker.data('id'));
        // create marker
        var marker = new google.maps.Marker({
            position: latlng,
            icon: '/wp-content/themes/understrap/img/marker.png',
            map: map
        });
        // add to array
        map.markers.push(marker);
        gMarkers.push(marker);
        markerOption.attr('data-marker', map.markers.length - 1);
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

    // Show detail of institution
    $('.institution-select').on('change', function () {
        var that = $(this);
        var value = that.val();
        var option = $('option:selected', this);
        var dataTitle = option.data('title');
        var dataDesc = option.data('description');
        var dataMarker = option.data('marker');
        // result wrapper
        var resultWrapper = that.next('.institution-selected-result');
        resultWrapper.html('<h3 class="default-color text-uppercase">' + dataTitle + '</h3><p>' + dataDesc + '</p>');
        // center map and open info window
        map.setCenter(gMarkers[dataMarker].getPosition());
        google.maps.event.trigger(gMarkers[dataMarker], 'click');
    });
}(jQuery))