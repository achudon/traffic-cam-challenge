// show traffic cameras of Seattle on Google map

"use strict";

var camData;
var allMarkers;

// when window is loaded, add search functionality, map, and camera data
$(document).ready(function() {
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

        for (idx = 0; idx < camData.length; idx++) {
            var camera = camData[idx];
            var marker = allMarkers[idx];

            var value = $('#search').val().toLowerCase();
            var containsString = camera.cameralabel.toLowerCase().indexOf(value) > -1;

            if(containsString) {
                marker.setMap(map);
            } else {
                marker.setMap(null);
            }
        }
    }); // end of search function


    // get data from source and display it on map
    $.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
        .done(function(data) {
            camData = data;
            data.forEach(function (camera) {
                var marker = new google.maps.Marker({
                    position: {
                        lat: Number(camera.location.latitude),
                        lng: Number(camera.location.longitude)
                    },
                    map: map
                });
                allMarkers.push(marker);

                // set click event on marker to open info window
                google.maps.event.addListener(marker, 'click', function() {
                    var html = '<p>' + camera.cameralabel + '</p>';
                    var img = '<img src=\"' + camera.imageurl.url + '\">';
                    infoWindow.setContent(html + '<br/>' + img);
                    infoWindow.open(map, this);
                    map.panTo(this.getPosition());
                }); // end of click event function

                // set click event on map to close info window
                google.maps.event.addListener(map, 'click', function() {
                    infoWindow.close();
                });
            });
        })
        .fail(function(error) {
            console.log(error);
        })
        .always(function() {
            $('#ajax-loader').fadeOut();
        })
}); // end of document.ready funcction



