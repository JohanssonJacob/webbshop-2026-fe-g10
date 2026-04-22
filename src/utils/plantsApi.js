import { getBaseUrl } from './api.js';

const API_URL = `${getBaseUrl()}plants/`;

// 🟢 GET ALL PLANTS (med JWT)
export async function getPlants() {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Error fetching plants:", error);
        return [];
    }
}


export async function createPlant({ name, description, image, lightLevel, lat, lng }) {
    const token = localStorage.getItem("token");

    const plantData = {
        name,
        description,
        image,
        lightLevel,
        location: {
            type: "Point",
            coordinates: [lng, lat] 
        }
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(plantData)
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`HTTP error: ${response.status} - ${text}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Error creating plant:", error);
        throw error;
    }
}