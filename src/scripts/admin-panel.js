import { getBaseUrl } from '../utils/api.js';

const token = localStorage.getItem("token");
const userRole = localStorage.getItem("userRole");
let currentView = 'plants';

document.addEventListener("DOMContentLoaded", () => {

    if (!token || userRole !== "admin") {
        alert("Åtkomst nekad. Du har inte administratörsrättigheter.");
        window.location.href = "/index.html";
        return;
    }

    document.getElementById("show-plants").addEventListener("click", () => {
        changeView('plants');
    });

    document.getElementById("show-users").addEventListener("click", () => {
        changeView('users');
    });

    loadData();
});

function changeView(view) {
    currentView = view;

    document.getElementById("show-plants").classList.toggle("active", view === 'plants');
    document.getElementById("show-users").classList.toggle("active", view === 'users');

    const title = document.getElementById("list-title");
    if (view === 'plants') {
        title.innerText = "Plants";
    } else {
        title.innerText = "System Users";
    }

    loadData();
}

async function loadData() {
    const tableBody = document.getElementById("admin-tbody");
    const tableHead = document.getElementById("table-head");

    tableBody.innerHTML = "<tr><td colspan='6'>Laddar data...</td></tr>";

    let endpoint;
    if (currentView === 'plants') {
        endpoint = 'plants';
    } else {
        endpoint = 'users';
    }

    try {
        const response = await fetch(getBaseUrl() + endpoint, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Kunde inte hämta data");
        }

        const data = await response.json();

        if (currentView === 'plants') {
            tableHead.innerHTML = `
                <th>Bild</th>
                <th>Växtnamn</th>
                <th>Skapad av</th>
                <th>Ljusnivå</th>
                <th>Datum</th>
                <th>Hantera</th>
            `;
        } else {
            tableHead.innerHTML = `
                <th>Namn</th>
                <th>Email</th>
                <th>Användar-ID</th>
                <th>Hantera</th>
            `;
        }

        tableBody.innerHTML = "";

        data.forEach(item => {
            const row = document.createElement("tr");

            if (currentView === 'plants') {
                addPlantRow(row, item);
            } else {
                addUserRow(row, item);
            }

            const deleteBtn = createDeleteButton(item._id);
            row.appendChild(deleteBtn);

            tableBody.appendChild(row);
        });

    } catch (error) {
        tableBody.innerHTML = `<tr><td colspan='6' style='color:red'>Fel: ${error.message}</td></tr>`;
    }
}

function addPlantRow(row, plant) {
    const date = new Date(plant.createdAt).toLocaleDateString('sv-SE');

    const ownerName = plant.owner?.name || 'Borttagen användare';
    const ownerId = plant.owner?._id || 'N/A';

    row.innerHTML = `
        <td><img src="${plant.image}" class="admin-thumb" onerror="this.src='/public/placeholder-plant-icon.png';"></td>
        <td>
            <strong>${plant.name}</strong><br>
            <small>Plant ID: ${plant._id}</small>
        </td>
        <td>
            <strong>${ownerName}</strong><br>
            <small>User ID: ${ownerId}</small>
        </td>
        <td>${`<img src="/public/light-level-icon.png" class="popup-icons-img">`.repeat(plant.lightLevel || 1)}</td>
        <td>${date}</td>
    `;
}

function addUserRow(row, user) {
    row.innerHTML = `
        <td>${user.name || 'N/A'}</td>
        <td>${user.email || 'N/A'}</td>
        <td><small>${user._id}</small></td>
    `;
}

function createDeleteButton(id) {
    const td = document.createElement("td");

    const button = document.createElement("button");
    button.innerText = "Radera";
    button.className = "btn-delete";

    button.onclick = () => {
        deleteItem(id);
    };

    td.appendChild(button);
    return td;
}

async function deleteItem(id) {
    const type = currentView === 'plants' ? 'växt' : 'användare';

    const confirmDelete = confirm(`Är du säker att du vill radera denna ${type} med id "${id}"?`);
    if (!confirmDelete) return;

    const endpoint = currentView === 'plants'
        ? `plants/${id}`
        : `users/${id}`;

    try {
        const response = await fetch(getBaseUrl() + endpoint, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Kunde inte radera");
        }

        alert("Borttagen");
        loadData();

    } catch (error) {
        alert("Fel: " + error.message);
    }
}