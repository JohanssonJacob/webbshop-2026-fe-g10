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

    const sortedTrades = [...trades].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    outgoingContainer.innerHTML = sortedTrades.map(trade => `
        <div class="trade-card outgoing">
            <div class="badge waiting">VÄNTAR PÅ SVAR</div>
            <img src="${trade.plant?.image || ''}" alt="Planta" onerror="this.src='../public/placeholder-plant-icon.png';"/>
            <div class="trade-info">
                <h3>${trade.plant?.name || 'Okänd växt'}</h3>
                <p class="participants">Till: <strong>${trade.owner?.name || 'Okänd'}</strong></p>
                <p class="status-text">Du väntar på att ${trade.owner?.name || 'ägaren'} ska godkänna bytet.</p>
                
                <div class="trade-actions">
                    <button class="btn-cancel-trade" onclick="handleReject('${trade._id}')">
                        Avbryt förfrågan
                    </button>
                </div>
            </div>
        </div>
    `).join("");
}

function renderHistory(trades) {
  if (!trades || trades.length === 0) {
    historyContainer.innerHTML = "<p class='empty-msg'>Ingen historik hittades.</p>";
    return;
  }
  
  const sortedTrades = [...trades].sort((a, b) => {
    const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return timeB - timeA; 
  });

  historyContainer.innerHTML = sortedTrades.map(trade => `
        <div class="history-item">
            <div class="history-details">
                <strong>${trade.plant?.name || "Okänd växt"}</strong>
                <span class="history-users">
                  ${trade.requester?.name || 'Okänd'} ⇄ ${trade.owner?.name || 'Okänd'}
                </span>
            </div>
            <span class="status-tag ${trade.status || 'unknown'}">
              ${(trade.status || 'INFO').toUpperCase()}
            </span>
        </div>
    `).join("");
}

window.handleApprove = async (id) => {
  await updateTrade(id, "approve");
  await updateTrade(id, "complete");
  initProfile();
};

window.handleReject = async (id) => {
  if (confirm("Vill du neka bytet?")) {
    await updateTrade(id, "cancel");
    initProfile();
  }
};

document.addEventListener("DOMContentLoaded", initProfile);