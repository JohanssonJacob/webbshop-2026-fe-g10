import { getBaseUrl } from './api.js';

export async function getProducts() {

    const API_URL = `${getBaseUrl()}plants/`;

    const token = localStorage.getItem("token");

    try {
        if (!token) {
            console.error("Ingen token hittades i localStorage. Användaren är inte inloggad.");
            return [];
        }

        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                console.error("Autentisering misslyckades: Token är ogiltig eller har gått ut.");
            }
            throw new Error(`HTTP-fel! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Kunde inte hämta plantor från API:", error);
        const title = document.querySelector('.main-content h1');
        if (title && !title.textContent.includes("Backend unavailable")) {
            title.textContent += " - Backend unavailable";
            title.style.color = "#d9534f";
        }
        return [];
    }
}