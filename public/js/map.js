document.addEventListener("DOMContentLoaded", () => {
  const mapElement = document.getElementById("map");

  // Stop if map doesn't exist
  if (!mapElement) return;

  const lat = parseFloat(mapElement.dataset.lat);
  const lng = parseFloat(mapElement.dataset.lng);
  const title = mapElement.dataset.title;
  const location = mapElement.dataset.location;

  // Create map
  const map = new maplibregl.Map({
    container: "map",
    style: "https://tiles.openfreemap.org/styles/liberty",
    center: [lng, lat],
    zoom: 13,
  });

  // Navigation controls
  map.addControl(new maplibregl.NavigationControl());

  // Popup
  const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
    <h6>${title}</h6>
    <p>${location}</p>
  `);

  console.log(lat, lng);
  // Marker
  new maplibregl.Marker().setLngLat([lng, lat]).setPopup(popup).addTo(map);

  popup.addTo(map);
});
