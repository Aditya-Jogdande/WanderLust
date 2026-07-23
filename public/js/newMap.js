document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 newMap.js loaded");

  const mapContainer = document.getElementById("pickMap");
  console.log("Map Container:", mapContainer);

  if (!mapContainer) {
    console.error("❌ pickMap div not found!");
    return;
  }

  if (typeof maplibregl === "undefined") {
    console.error("❌ MapLibre is not loaded!");
    return;
  }

  // Default Location (Pune)
  let lat = 18.5204;
  let lng = 73.8567;
  let zoom = 6;

  // If editing a listing
  if (mapContainer.dataset.lat && mapContainer.dataset.lng) {
    lat = parseFloat(mapContainer.dataset.lat);
    lng = parseFloat(mapContainer.dataset.lng);
    zoom = 13;
  }

  console.log("Initial Coordinates:", lat, lng);

  let map;

  try {
    map = new maplibregl.Map({
      container: "pickMap",
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [lng, lat],
      zoom: zoom,
    });

    console.log("✅ Map Created Successfully");
  } catch (err) {
    console.error("❌ Error creating map:", err);
    return;
  }

  map.addControl(new maplibregl.NavigationControl());

  const marker = new maplibregl.Marker({
    color: "red",
  })
    .setLngLat([lng, lat])
    .addTo(map);

  const latitudeInput = document.getElementById("latitude");
  const longitudeInput = document.getElementById("longitude");
  const locationInput = document.getElementById("location");

  console.log("Latitude Input:", latitudeInput);
  console.log("Longitude Input:", longitudeInput);
  console.log("Location Input:", locationInput);

  if (!latitudeInput || !longitudeInput || !locationInput) {
    console.error("❌ One or more input fields are missing!");
    return;
  }

  latitudeInput.value = lat;
  longitudeInput.value = lng;

  console.log("✅ Default coordinates set");
  console.log("Latitude:", latitudeInput.value);
  console.log("Longitude:", longitudeInput.value);

  // User clicks on map
  map.on("click", (e) => {
    const newLat = e.lngLat.lat;
    const newLng = e.lngLat.lng;

    marker.setLngLat([newLng, newLat]);

    latitudeInput.value = newLat;
    longitudeInput.value = newLng;

    console.log("📍 Marker Updated");
    console.log("Latitude:", newLat);
    console.log("Longitude:", newLng);
  });

  async function searchLocation() {
    const place = locationInput.value.trim();

    if (!place) return;

    console.log("Searching:", place);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(place)}`,
      );

      const data = await response.json();

      console.log("Search Result:", data);

      if (!data.length) {
        console.warn("⚠️ No location found");
        return;
      }

      const newLat = parseFloat(data[0].lat);
      const newLng = parseFloat(data[0].lon);

      map.flyTo({
        center: [newLng, newLat],
        zoom: 13,
        essential: true,
      });

      marker.setLngLat([newLng, newLat]);

      latitudeInput.value = newLat;
      longitudeInput.value = newLng;

      console.log("✅ Coordinates Updated");
      console.log("Latitude:", newLat);
      console.log("Longitude:", newLng);
    } catch (err) {
      console.error("❌ Location search failed:", err);
    }
  }

  locationInput.addEventListener("change", searchLocation);

  locationInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchLocation();
    }
  });
});
