mapboxgl.accessToken =
    mapToken;
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: LngLat.geometry.coordinates,
    zoom: 12,
});

var marker = new mapboxgl.Marker()
    .setLngLat(LngLat.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup( {offset:25} )
        .setHTML(
            `<h3>${LngLat.title}</h3>`
        )
    )
    .addTo(map);

    
// map.addControl(new mapboxgl.NavigationControl());   