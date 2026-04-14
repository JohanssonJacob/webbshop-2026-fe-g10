import { getProducts } from "../utils/plantsApi.js";

async function initMap() {
  const map = L.map('map').setView([59.3293, 18.0686], 14);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map);

  const getPlantIcon = (lightLevel) => L.icon({
    iconUrl: `/public/plant-icon${lightLevel}.png`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35]
  });

  try {
    const plants = await getProducts();

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
              <span class="popup-owner"><img src="/public/owner-icon.png" class="popup-icons-img"> ${plant.owner.name}</span>
            </div>
            <button class="trade-btn" data-id="${plant._id}">Skicka bytesförfrågan</button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.querySelector(`.trade-btn[data-id="${plant._id}"]`);
        if (btn) {
          btn.onclick = () => {
            console.log(`Bytesförfrågan skickad för växt: ${plant.name} (ID: ${plant._id})`);
            //sendTradeRequest(plant._id)
            alert(`Bytesförfrågan för ${plant.name} har skickats till ${plant.owner.name}!`);
          };
        }
      });
    });
  } catch (error) {
    console.error("Kunde inte hämta plantor:", error);
  }
}

initMap();