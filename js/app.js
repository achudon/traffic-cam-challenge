// show traffic cameras of Seattle on Google map

"use strict";

var camData;
var allMarkers;
var mc;

// resize the map to fit the current window height
function resize() {
    var mapTop = $('#map').position().top;
    var winHeight = $(window).height();

    var finalHeight = (winHeight - mapTop - 20);

    $('#map').height(finalHeight);
}

// when window is loaded, add search functionality, map, and camera data
$(document).ready(function() {
    resize();

    var mapElem = document.getElementById('map');
    allMarkers = [];

    // coordinates for the center of the map
    var center = {
        lat: 47.6,
        lng: -122.3
    };

    // create map with given center
    var map = new google.maps.Map(mapElem,
        {center: center,
            zoom: 12
        });

    var infoWindow = new google.maps.InfoWindow();

    // filter markers to display based on search string
    $('#search').bind('search keyup', function() {
        var idx;
        var selectedMarkers = [];

        for (idx = 0; idx < camData.length; idx++) {
            var camera = camData[idx];
            var marker = allMarkers[idx];

            var value = $('#search').val().toLowerCase();
            var containsString = camera.cameralabel.toLowerCase().indexOf(value) > -1;

            if(containsString) {
                selectedMarkers.push(marker);
            }
        }
        mc.clearMarkers();
        mc.addMarkers(selectedMarkers);
    }); // end of search function

    // catch the window resize event
    $(window).resize(resize);

    // get data from source and display it on map
    $.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
        .done(function(data) {
            camData = data;
            data.forEach(function (camera) {
                var marker = new google.maps.Marker({
                    position: {
                        lat: Number(camera.location.latitude),
                        lng: Number(camera.location.longitude),
                        animation: google.maps.Animation.DROP
                    },
                    map: map
                });
                allMarkers.push(marker);

                // set click event on marker to open info window
                google.maps.event.addListener(marker, 'click', function() {
                    // make marker bounce when clicked on
                    console.log(camera.cameralabel + ' ' + marker.getPosition())
                    map.panTo(this.getPosition());

                    marker.setAnimation(google.maps.Animation.BOUNCE);

                    setTimeout(function() {
                        marker.setAnimation(google.maps.Animation.null);
                    }, 700);


                    var html = '<p>' + camera.cameralabel + '</p>';
                    var img = '<img src=\"' + camera.imageurl.url + '\">';
                    infoWindow.setContent(html + '<br/>' + img);


                    infoWindow.open(map, this);
                }); // end of click event function

                // set click event on map to close info window
                google.maps.event.addListener(map, 'click', function() {
                    infoWindow.close();
                });
            });

            // create markerClusterer
            mc = new MarkerClusterer(map, allMarkers);
        })
        .fail(function(error) {
            alert(error);
        })
        .always(function() {
            $('#ajax-loader').fadeOut();
        })
}); // end of document.ready function



