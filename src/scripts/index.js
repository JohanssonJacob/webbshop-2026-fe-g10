import { getPlants } from "../utils/plantsApi.js";
import { handleTradeRequest } from "../utils/trades.js";

let map;

function addPlantMarker(plant) {
  const getPlantIcon = (lightLevel) => L.icon({
    iconUrl: `/public/plant-icon${lightLevel}.png`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35]
  });

  const [lng, lat] = plant.location.coordinates;
  const selectedIcon = getPlantIcon(plant.lightLevel);

  const marker = L.marker([lat, lng], { icon: selectedIcon }).addTo(map);

  const popupContent = `
    <div class="compact-row-popup">
      <div class="popup-aside">
        <img src="${plant.image}" class="popup-thumb">
      </div>
      <div class="popup-main">
        <h4>${plant.name}</h4>
        <p class="popup-desc">${plant.description}</p>
        <div class="popup-meta">
          <span>${`<img src="/public/light-level-icon.png" class="popup-icons-img">`.repeat(plant.lightLevel)}</span>
          <span class="popup-owner">
            <img src="/public/owner-icon.png" class="popup-icons-img">
            ${plant.owner?.name || ""}
          </span>
        </div>
        <button class="trade-btn" data-id="${plant._id}">
          Skicka bytesförfrågan
        </button>
      </div>
    </div>
  `;

  marker.bindPopup(popupContent);

  marker.on('popupopen', () => {
    const btn = document.querySelector(`.trade-btn[data-id="${plant._id}"]`);

    if (btn) {
      btn.onclick = async () => {
        try {
          await handleTradeRequest(plant._id);
          btn.innerText = "Skickad!";
          btn.disabled = true;
          alert("Bytesförfrågan skickad");
        } catch (err) {
          console.error(err);
          alert("Kunde inte skicka förfrågan");
        }
      };
    }
  });
}

window.addPlantMarker = addPlantMarker;

async function initMap() {
  map = L.map('map').setView([59.3293, 18.0686], 14);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map);

  window.selectedCoords = null;
  let tempMarker = null;

  map.on("click", function (e) {
    const { lat, lng } = e.latlng;
    window.selectedCoords = { lat, lng };

    if (tempMarker) {
      map.removeLayer(tempMarker);
    }

    tempMarker = L.marker([lat, lng]).addTo(map);
  });

  try {
    const plants = await getPlants();
    plants.forEach(addPlantMarker);
  } catch (error) {
    console.error("Kunde inte hämta plantor:", error);
  }
}

initMap();