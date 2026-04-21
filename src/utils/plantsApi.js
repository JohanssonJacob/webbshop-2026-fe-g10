import { getBaseUrl } from './api.js';

const API_URL = `${getBaseUrl()}plants/`;


export async function getPlants() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Error fetching plants:", error);
        return [];
    }
}


export async function createPlant(plantData) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
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