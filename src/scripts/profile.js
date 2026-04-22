import { getTrades, updateTrade } from "../utils/trades.js";

const incomingContainer = document.getElementById("pendingContainer");
const outgoingContainer = document.getElementById("outgoingContainer");
const historyContainer = document.getElementById("historyContainer");

async function initProfile() {
  const myId = localStorage.getItem("userId");

  if (!myId) {
    console.error("Inget userId hittat");
    return;
  }


  try {
    const allTrades = await getTrades();

    if (!allTrades || !Array.isArray(allTrades)) return;

    const incoming = allTrades.filter(t => t.status === "pending" && t.owner?._id === myId);

    const outgoing = allTrades.filter(t => t.status === "pending" && t.requester?._id === myId);

    const history = allTrades.filter(t => t.status !== "pending");

    renderIncoming(incoming);
    renderOutgoing(outgoing);
    renderHistory(history);

  } catch (err) {
    console.error("Fel vid initiering:", err);
  }
}

function renderIncoming(trades) {
  if (trades.length === 0) {
    incomingContainer.innerHTML = "<p class='empty-msg'>Inga nya förfrågningar att ta ställning till.</p>";
    return;
  }

  incomingContainer.innerHTML = trades.map(trade => `
        <div class="trade-card incoming">
            <div class="badge action-needed">ATT GODKÄNNA</div>
            <img src="${trade.plant?.image || ''}" alt="Planta" onerror="this.src='../public/placeholder-plant-icon.png';"/>
            <div class="trade-info">
                <h3>${trade.plant?.name}</h3>
                <p class="participants">Från: <strong>${trade.requester?.name}</strong></p>
                <div class="actions">
                    <button class="btn-approve" onclick="handleApprove('${trade._id}')">Godkänn</button>
                    <button class="btn-reject" onclick="handleReject('${trade._id}')">Neka</button>
                </div>
            </div>
        </div>
    `).join("");
}

function renderOutgoing(trades) {

  if (trades.length === 0) {
    outgoingContainer.innerHTML = "<p class='empty-msg'>Du har inga väntande förfrågningar.</p>";
    return;
  }

  outgoingContainer.innerHTML = trades.map(trade => `
        <div class="trade-card outgoing">
            <div class="badge waiting">VÄNTAR PÅ SVAR</div>
            <img src="${trade.plant?.image || ''}" alt="Planta" onerror="this.src='../public/placeholder-plant-icon.png';"/>
            <div class="trade-info">
                <h3>${trade.plant?.name}</h3>
                <p class="participants">Till: <strong>${trade.owner?.name}</strong></p>
                <p class="status-text">Du väntar på att ${trade.owner?.name} ska godkänna bytet.</p>
            </div>
        </div>
    `).join("");
}

function renderHistory(trades) {
  if (trades.length === 0) {
    historyContainer.innerHTML = "<p class='empty-msg'>Ingen historik hittades.</p>";
    return;
  }

  historyContainer.innerHTML = trades.map(trade => `
        <div class="history-item">
            <div class="history-details">
                <strong>${trade.plant?.name || "Växt"}</strong>
                <span class="history-users">${trade.requester?.name} ⇄ ${trade.owner?.name}</span>
            </div>
            <span class="status-tag ${trade.status}">${trade.status.toUpperCase()}</span>
        </div>
    `).join("");
}

window.handleApprove = async (id) => {
  await updateTrade(id, "approve");
  initProfile();
};

window.handleReject = async (id) => {
  if (confirm("Vill du neka bytet?")) {
    await updateTrade(id, "cancel");
    initProfile();
  }
};

document.addEventListener("DOMContentLoaded", initProfile);