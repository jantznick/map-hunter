
let markers = [];
// Initialize and add the map
function initMap() {
	// if (navigator.geolocation) {
	// 	navigator.geolocation.getCurrentPosition(
	// 		(position) => {
	// 			const pos = {
	// 				lat: position.coords.latitude,
	// 				lng: position.coords.longitude,
	// 			};
				const haightAshbury = { lat: 37.769, lng: -122.446 };
				const map = new google.maps.Map(document.getElementById("map"), {
					zoom: 15,
					center: haightAshbury
				});
				const homeMarker = new google.maps.Marker({
					position: haightAshbury,
					map: map,
				});
				markers.push(homeMarker);
				map.addListener("click", (e) => {
					getNearestRoad(e.latLng.toJSON(), map);
				});
				const infowindow = new google.maps.InfoWindow({
					content: "Testing info window",
				});
				homeMarker.addListener("click", () => {
					infowindow.open({
						anchor: homeMarker,
						map,
						shouldFocus: false,
					});
				});

			// },
			// () => {
			// 	handleLocationError();
			// }
	// 	);
	// } else {
	// 	handleLocationError(false, infoWindow, map.getCenter());
	// }
};

function getDirections(map) {
	let directionArray = [];
	const from = markers[markers.length - 2];
	const to = markers[markers.length - 1];
	fetch(`/directions?fromLat=${from.position.lat()}&fromLong=${from.position.lng()}&toLat=${to.position.lat()}&toLong=${to.position.lng()}`)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			data[0].steps.forEach(step => {
				directionArray.push(step.start_location)
				directionArray.push(step.end_location)
			})
			drawDirections(directionArray, map)
		});
}

function drawDirections(directionArray, map) {
	const directions = new google.maps.Polyline({
		path: directionArray,
		geodesic: true,
		strokeColor: "#FF0000",
		strokeOpacity: 1.0,
		strokeWeight: 2,
	});

	directions.setMap(map);
}

function getNearestRoad(latLong, map) {
	fetch(`/nearest-road?lat=${latLong.lat}&long=${latLong.lng}`)
		.then((response) => response.json())
		.then((data) => addMarker(data, map));
}

function addMarker(latLng, map) {
	var newMarkerLatLng = new google.maps.LatLng(latLng.latitude, latLng.longitude);
	const marker = new google.maps.Marker({
		position: newMarkerLatLng,
		map: map
	});
	markers.push(marker);
	getDirections(map);
}

function handleLocationError() {
	document.getElementById("map").innerText = "Can not use browser location data, please enable and reload the page"
}
