
let markers = [];
let directionsArray = [];
let coolMap;
let linesDrawn = false;
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
				coolMap = map;
				const homeMarker = new google.maps.Marker({
					position: haightAshbury,
					map: map,
					icon: '/home.png'
				});
				markers.push(homeMarker);
				map.addListener("click", (e) => {
					getNearestRoad(e.latLng.toJSON());
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
				// google.maps.event.addListener(map, 'bounds_changed', function() {
				// 	if (!linesDrawn) {
				// 		splitMapIntoPieces(8);
				// 	}
				// });

			// },
			// () => {
			// 	handleLocationError();
			// }
	// 	);
	// } else {
	// 	handleLocationError(false, infoWindow, map.getCenter());
	// }
};

function splitMapIntoPieces(num) {
	linesDrawn = true;
	// todo: map through halfVal number and draw a line at each iteration of halfval * index
	const halfVal = num/2;
	const top = coolMap.getBounds().getNorthEast().lat();
	const right = coolMap.getBounds().getNorthEast().lng();
	const bottom = coolMap.getBounds().getSouthWest().lat();
	const left = coolMap.getBounds().getSouthWest().lng();
	const latHeight = (top - bottom > 0) ? top - bottom : bottom - top;
	const longWidth = (left - right > 0) ? left - right : right - left;
	for (let i = 1; i <= halfVal; i++) {
		const drawLatLine = [{
			lat: top,
			lng: (left - right > 0) ? right + longWidth/halfVal*i : left + longWidth/halfVal*i
		},{
			lat: bottom,
			lng: (left - right > 0) ? right + longWidth/halfVal*i : left + longWidth/halfVal*i
		}]
		const drawLongLine = [{
			lat: (top - bottom > 0) ? bottom + latHeight/halfVal*i : top + latHeight/halfVal*i,
			lng: left
		}, {
			lat: (top - bottom > 0) ? bottom + latHeight/halfVal*i : top + latHeight/halfVal*i,
			lng: right
		}]
		drawDirections(drawLatLine);
		drawDirections(drawLongLine);
	}
}

function removeMarker(id) {
	markers[id].setMap(null);
	directionsArray[id].setMap(null);
	directionsArray[id - 1].setMap(null);
	directionsArray.splice(id,1);
	getDirections(id - 1, id + 1);
}

function getDirections(fromId = markers.length - 2, toId = markers.length - 1) {
	//todo figure out why removing a marker is not changing the directions array right
	let directionArray = [];
	const from = markers[fromId];
	const to = markers[toId];
	console.log(from)
	console.log(to)
	fetch(`/directions?fromLat=${from.position.lat()}&fromLong=${from.position.lng()}&toLat=${to.position.lat()}&toLong=${to.position.lng()}`)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			data[0].steps.forEach(step => {
				directionArray.push(step.start_location)
				directionArray.push(step.end_location)
			})
			drawDirections(directionArray)
		});
}

function drawDirections(directionArray) {
	const directions = new google.maps.Polyline({
		path: directionArray,
		geodesic: true,
		strokeColor: "#FF0000",
		strokeOpacity: 1.0,
		strokeWeight: 2,
	});
	directionsArray.push(directions);

	directions.setMap(coolMap);
}

function getNearestRoad(latLong) {
	fetch(`/nearest-road?lat=${latLong.lat}&long=${latLong.lng}`)
		.then((response) => response.json())
		.then((data) => addMarker(data));
}

function addMarker(latLng) {
	var newMarkerLatLng = new google.maps.LatLng(latLng.latitude, latLng.longitude);
	const marker = new google.maps.Marker({
		position: newMarkerLatLng,
		map: coolMap
	});
	markers.push(marker);
	getDirections();
}

function handleLocationError() {
	document.getElementById("map").innerText = "Can not use browser location data, please enable and reload the page"
}
