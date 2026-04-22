import { getPlants } from "../utils/plantsApi.js";
import { handleTradeRequest } from "../utils/trades.js";

async function initMap() {
  const map = L.map('map').setView([59.3293, 18.0686], 14);

  // 🌍 Tiles
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map);

  // 📍 GLOBAL coords (viktig!)
  window.selectedCoords = null;
  let tempMarker = null;

  // 🖱️ Klick på karta → spara coords
  map.on("click", function (e) {
    const { lat, lng } = e.latlng;

    window.selectedCoords = { lat, lng };

    console.log("Selected coords:", window.selectedCoords);

    // Ta bort tidigare marker
    if (tempMarker) {
      map.removeLayer(tempMarker);
    }

    // Lägg ny marker
    tempMarker = L.marker([lat, lng]).addTo(map);
  });

  // 🌱 Ikon baserat på ljus
  const getPlantIcon = (lightLevel) => L.icon({
    iconUrl: `/public/plant-icon${lightLevel}.png`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35]
  });

  try {
    const plants = await getPlants(); // ✅ FIX

    plants.forEach(plant => {
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
                ${plant.owner.name}
              </span>
            </div>
            <button class="trade-btn" data-id="${plant._id}">
              Skicka bytesförfrågan
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      // 🔘 Klick på trade-knapp
      marker.on('popupopen', () => {
        const btn = document.querySelector(`.trade-btn[data-id="${plant._id}"]`);

        if (btn) {
          btn.onclick = async () => {
            try {
              await handleTradeRequest(plant._id);

              btn.innerText = "Skickad!";
              btn.disabled = true;

              alert(`Bytesförfrågan skickad till ${plant.owner.name}`);

            } catch (err) {
              console.error(err);
              alert("Kunde inte skicka förfrågan");
            }
          };
        }
      });
    });

  } catch (error) {
    console.error("Kunde inte hämta plantor:", error);
  }
}

initMap();