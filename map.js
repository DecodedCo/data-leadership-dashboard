var map;
var latlon = [ 51.5, -0.09 ];
function initializeMap(){
  
  $("#dashboard").append('<section id="mapSection" class="db-card"><h1>Location</h1><article id="map-canvas"></article></section>');
  
  var mapOptions = {
    zoom: 5,
    center: new google.maps.LatLng( latlon[0],latlon[1] ),
    styles: [{"stylers":[{"saturation":-100},{"gamma":1}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"water","stylers":[{"visibility":"on"},{"saturation":50},{"gamma":0},{"hue":"#50a5d1"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"color":"#333333"}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"weight":0.5},{"color":"#333333"}]},{"featureType":"transit.station","elementType":"labels.icon","stylers":[{"gamma":1},{"saturation":50}]}]
  };
  
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  
  var trafficLayer = new google.maps.TrafficLayer();
  trafficLayer.setMap(map); 
  
  //var transitLayer = new google.maps.TransitLayer();
  //transitLayer.setMap(map);
  
  //var bikeLayer = new google.maps.BicyclingLayer();
  //bikeLayer.setMap(map);
  
  //addMarker( latlon[0], latlon[1], 'Current Location', 'yellow', 5, 1.0 );
  
}