mapboxgl.accessToken = 'pk.eyJ1IjoiZ2F1cmF2bmciLCJhIjoiY20xdGx3ODhuMDNzNTJ0cHI2YWphY2p1ZCJ9.DCncOYgA91GXOkejz0CilQ';

const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/streets-v11', 
    center: [-74.5, 40], 
    zoom: 9 
});


function haversineDistance(coords1, coords2) {
    const R = 6371; 
    const dLat = (coords2[1] - coords1[1]) * Math.PI / 180;
    const dLon = (coords2[0] - coords1[0]) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(coords1[1] * Math.PI / 180) * Math.cos(coords2[1] * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance.toFixed(2);
}

let userCoordinates = [];


function searchLocation() {
    const searchInput = document.getElementById('location-search').value;
    
   
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchInput}.json?access_token=${mapboxgl.accessToken}&limit=1`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const coordinates = data.features[0].geometry.coordinates;
            userCoordinates = coordinates; 

            const detailsContent = document.getElementById('details-content');
            detailsContent.innerHTML = '';

            data.features.forEach(feature => {
                const place = feature.place_name;
                const locationDiv = document.createElement('div');
                locationDiv.innerHTML = `<strong>${place}</strong>`;
                detailsContent.appendChild(locationDiv);

                new mapboxgl.Marker()
                    .setLngLat(feature.geometry.coordinates)
                    .addTo(map);

                map.flyTo({ center: feature.geometry.coordinates, zoom: 12 });
            });
        })
        .catch(error => console.error('Error fetching location data:', error));
}


function filterLocations(type) {
    const detailsContent = document.getElementById('details-content');
    detailsContent.innerHTML = ''; 

    const locationDetails = {
        restaurants: [
            { name: 'Restaurant A', description: 'Great place for food.', coordinates: [-74.6, 40.1] },
            { name: 'Restaurant B', description: 'Awesome dining experience.', coordinates: [-74.55, 40.05] }
        ],
        parks: [
            { name: 'Park A', description: 'Beautiful park for a walk.', coordinates: [-74.5, 40.1] },
            { name: 'Park B', description: 'Great place to relax.', coordinates: [-74.45, 40] }
        ],
        museums: [
            { name: 'Museum A', description: 'Explore art and history.', coordinates: [-74.4, 40.1] },
            { name: 'Museum B', description: 'Interactive exhibits for all ages.', coordinates: [-74.35, 40.05] }
        ]
    };

    const filteredPlaces = locationDetails[type];

    filteredPlaces.forEach(place => {
        const distance = haversineDistance(userCoordinates, place.coordinates);

        const placeDiv = document.createElement('div');
        placeDiv.innerHTML = `<strong>${place.name}</strong>: ${place.description} <br> Distance: ${distance} km`;
        detailsContent.appendChild(placeDiv);

        new mapboxgl.Marker()
            .setLngLat(place.coordinates)
            .addTo(map);
    });
}

document.getElementById('resturent').addEventListener('click', () => filterLocations('restaurants'));
document.getElementById('parks').addEventListener('click', () => filterLocations('parks'));
document.getElementById('Museums').addEventListener('click', () => filterLocations('museums'));

document.getElementById('search-btn').addEventListener('click', searchLocation);
