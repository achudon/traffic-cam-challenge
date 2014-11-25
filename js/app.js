// show traffic cameras of Seattle on Google map

"use strict";

var camData;
var allMarkers;

$(document).ready(function() {
    var mapElem = document.getElementById('map');
    allMarkers = [];

    var center = {
        lat: 47.6,
        lng: -122.3
    };

    var map = new google.maps.Map(mapElem,
        {center: center,
            zoom: 12
        });

    var infoWindow = new google.maps.InfoWindow();

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
    });





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

                // set click event on marker
                google.maps.event.addListener(marker, 'click', function() {
                    var html = '<p>' + camera.cameralabel + '</p>';
                    var img = '<img src=\"' + camera.imageurl.url + '\">';
                    infoWindow.setContent(html + '<br/>' + img);
                    infoWindow.open(map, this);
                    map.panTo(this.getPosition());
                }); // end of click event function
            });
        })
        .fail(function(error) {
            console.log(error);
        })
        .always(function() {
            $('#ajax-loader').fadeOut();
        })
}); // document.ready funcction




//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box

