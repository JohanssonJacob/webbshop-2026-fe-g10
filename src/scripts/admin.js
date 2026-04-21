import { createPlant, getPlants } from "/src/utils/plantsApi.js";

const form = document.getElementById("createProductForm");
const tbody = document.getElementById("productsTableBody");


form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const imageUrl = document.getElementById("image").value.trim();

  // TEMP tills karta kopplas
  const lightLevel = 2;
  const lat = 59.33;
  const lng = 18.06;

  const button = form.querySelector("button");
  button.innerText = "Loading...";

  try {
    const result = await createPlant({
      name,
      imageUrl,
      lightLevel,
      coordinates: { lat, lng }
    });

    console.log("Plant created:", result);

    button.innerText = "Done!";
    alert("Plant uploaded successfully!");

    form.reset();
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
          <td><img src="${p.imageUrl}" width="50"/></td>
        </tr>
      `
      )
      .join("");

  } catch (err) {
    console.error(err);
    tbody.innerHTML = "<tr><td colspan='3'>Failed to load plants.</td></tr>";
  }
}

document.addEventListener("DOMContentLoaded", loadPlants);