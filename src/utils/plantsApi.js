export async function getProducts() {
    //Vercel url?
    const API_URL = "http://localhost:3000/plants/";

    //Byt ut efter login är fixat
    localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWQ2MGVkYWIwMWUyYTBhOTE1M2RiNzYiLCJpYXQiOjE3NzU4MTc2ODMsImV4cCI6MTc3NTkwNDA4M30.Zb85sBnu4jM7lA_jOaG22clSg1OkrMliS3m_d0IqVTs");
    
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
        return [];
    }
}