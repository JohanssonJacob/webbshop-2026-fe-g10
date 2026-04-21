import { createPlant, getPlants } from "/src/utils/plantsApi.js";

const form = document.getElementById("createProductForm");
const tbody = document.getElementById("productsTableBody");

let selectedCoords = null;
let tempMarker = null;

function initAdminMap() {
  const map = L.map("adminMap").setView([59.3293, 18.0686], 13);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; OpenStreetMap &copy; CARTO",
    subdomains: "abcd",
    maxZoom: 20
  }).addTo(map);

  map.on("click", (e) => {
    const { lat, lng } = e.latlng;

    selectedCoords = { lat, lng };

    if (tempMarker) {
      map.removeLayer(tempMarker);
    }

    tempMarker = L.marker([lat, lng]).addTo(map);

    const coordsText = document.getElementById("coordsText");
    if (coordsText) {
      coordsText.innerText = `Selected: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const description = document.getElementById("description").value.trim();
  const image = document.getElementById("image").value.trim();
  const lightLevel = parseInt(document.getElementById("lightLevel").value);

  if (!selectedCoords) {
    alert("Please click on the map to select a location");
    return;
  }

  const { lat, lng } = selectedCoords;

  const button = form.querySelector("button");
  button.innerText = "Loading...";

  try {
    const result = await createPlant({
      name,
      description,
      image,
      lightLevel,
      lat,
      lng
    });

    console.log("Plant created:", result);

    button.innerText = "Done!";
    alert("Plant uploaded successfully!");

    form.reset();
    selectedCoords = null;

    if (tempMarker) {
      tempMarker.remove();
      tempMarker = null;
    }

    loadPlants();

  } catch (err) {
    console.error(err);
    button.innerText = "Error!";
    alert(err.message || "Failed to create plant");
  } finally {
    setTimeout(() => {
      button.innerText = "Create Plant";
    }, 2000);
  }
});

async function loadPlants() {
  tbody.innerHTML = "<tr><td colspan='3'>Loading...</td></tr>";

  try {
    const plants = await getPlants();

    if (plants.length === 0) {
      tbody.innerHTML = "<tr><td colspan='3'>No plants yet.</td></tr>";
      return;
    }

    tbody.innerHTML = plants
      .map(
        (p) => `
        <tr>
          <td>${p.name}</td>
          <td>${p.lightLevel || "-"}</td>
          <td><img src="${p.image}" width="50"/></td>
        </tr>
      `
      )
      .join("");

  } catch (err) {
    console.error(err);
    tbody.innerHTML = "<tr><td colspan='3'>Failed to load plants.</td></tr>";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadPlants();
  initAdminMap();
});