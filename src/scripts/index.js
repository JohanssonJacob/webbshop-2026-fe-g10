import { getProducts } from "../utils/productsApi.js";

function initMap() {
  const map = L.map('map').setView([59.3293, 18.0686], 10);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map);

  const plantIcon = L.icon({
    iconUrl: './public/plant-icon.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35]
  });

  const plantIcon2 = L.icon({
    iconUrl: './public/plant-icon2.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35]
  });

  const plantIcon3 = L.icon({
    iconUrl: './public/plant-icon3.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35]
  });

  const plantIcon4 = L.icon({
    iconUrl: './public/plant-icon4.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35]
  });

  const plantIcon5 = L.icon({
    iconUrl: './public/plant-icon5.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35]
  });

  //Temp

  L.marker([59.3293, 18.0686], { icon: plantIcon }).addTo(map)
    .bindPopup('<b>Namn</b><br>Planta');

  L.marker([59.3203, 18.0646], { icon: plantIcon2 }).addTo(map)
    .bindPopup('<b>Namn</b><br>Planta');

  L.marker([59.3393, 18.0886], { icon: plantIcon3 }).addTo(map)
    .bindPopup('<b>Namn</b><br>Planta');

  L.marker([59.3393, 18.0086], { icon: plantIcon4 }).addTo(map)
    .bindPopup('<b>Namn</b><br>Planta');

  L.marker([59.3093, 18.0086], { icon: plantIcon5 }).addTo(map)
    .bindPopup('<b>Namn</b><br>Planta');

}

initMap();
