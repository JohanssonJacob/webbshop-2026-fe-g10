import { getTrades, updateTrade } from "../utils/trades.js";

const container = document.getElementById("tradesContainer");

async function loadTrades() {
  container.innerHTML = "<p>Loading...</p>";

  try {
    const trades = await getTrades();

    if (trades.length === 0) {
      container.innerHTML = "<p>No trades yet</p>";
      return;
    }

    container.innerHTML = trades.map(trade => `
      <div class="trade-card">
        <h3>${trade.plant?.name || "Plant"}</h3>
        <img src="${trade.plant?.image}" width="120"/>

        <p>Status: 
          <strong style="color: ${
            trade.status === "approved" ? "green" :
            trade.status === "pending" ? "orange" : "red"
          }">
            ${trade.status}
          </strong>
        </p>

        <p>With: ${trade.otherUser?.name || "Unknown"}</p>

        ${trade.status === "pending" ? `
          <button onclick="approveTrade('${trade._id}')">Approve</button>
          <button onclick="rejectTrade('${trade._id}')">Reject</button>
        ` : ""}
      </div>
    `).join("");

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Failed to load trades</p>";
  }
}

window.approveTrade = async (id) => {
  await updateTrade(id, "approved");
  location.reload();
};

window.rejectTrade = async (id) => {
  await updateTrade(id, "rejected");
  location.reload();
};

document.addEventListener("DOMContentLoaded", loadTrades);