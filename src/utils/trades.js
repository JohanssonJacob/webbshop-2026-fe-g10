import { getBaseUrl } from "./api.js";
export async function handleTradeRequest(plantId) {
  try {
    const token = localStorage.getItem("token");
    const url = new URL("trades", getBaseUrl());
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        plantId: plantId
      })
    });

    if (!response.ok) {
      throw new Error("Kunde inte skicka förfrågan");
    }

    const data = await response.json();

    alert("Bytesförfrågan skickad!");
    console.log(data);

  } catch (error) {
    console.error(error);
    alert("Något gick fel");
  }
};

