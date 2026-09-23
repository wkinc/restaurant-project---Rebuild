// Gate access — must have logged in via login.html
if (sessionStorage.getItem("wk_admin") !== "1") {
  window.location.href = "login.html";
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  sessionStorage.removeItem("wk_admin");
  window.location.href = "login.html";
});

// Tabs
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".panel-view").forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab + "Panel").classList.add("active");
  });
});

// --- Customer Orders ---
function renderOrders() {
  const orders = JSON.parse(localStorage.getItem("wk_orders") || "[]");
  const list = document.getElementById("ordersList");

  if (orders.length === 0) {
    list.innerHTML = `<div class="empty-state">No orders yet — they'll show up here once placed on the site.</div>`;
    return;
  }

  list.innerHTML = orders.map(o => `
    <div class="order-card">
      <div class="top">
        <span class="who">${o.customer} · Table ${o.table}</span>
        <span class="when">${o.time}</span>
      </div>
      <ul>${o.items.map(i => `<li>${i}</li>`).join("")}</ul>
      <div style="margin-top:8px; font-weight:600;">$${o.total.toFixed(2)}</div>
    </div>
  `).join("");
}
renderOrders();

// --- Restock (same inventory + AI logic as before) ---
const inventory = [
  {name:"Yellowfin tuna", cat:"Protein", unit:"lb", qty:6, par:20},
  {name:"Chicken thigh, boneless", cat:"Protein", unit:"lb", qty:24, par:30},
  {name:"Wagyu striploin", cat:"Protein", unit:"lb", qty:3, par:12},
  {name:"Heirloom tomato", cat:"Produce", unit:"lb", qty:9, par:15},
  {name:"Shishito pepper", cat:"Produce", unit:"lb", qty:2, par:8},
  {name:"Yukon gold potato", cat:"Produce", unit:"lb", qty:40, par:35},
  {name:"Burrata", cat:"Dairy", unit:"units", qty:4, par:16},
  {name:"Cultured butter", cat:"Dairy", unit:"lb", qty:10, par:12},
  {name:"00 flour", cat:"Dry goods", unit:"lb", qty:48, par:50},
  {name:"Calabrian chili paste", cat:"Dry goods", unit:"jars", qty:1, par:6},
];

const WORKER_URL = "https://restock-proxy.yourname.workers.dev"; // your deployed Worker URL

const rows = document.getElementById("rows");
inventory.forEach(it => {
  const pct = Math.min(100, Math.round((it.qty / it.par) * 100));
  const low = it.qty < it.par * 0.5;
  const tr = document.createElement("tr");
  if (low) tr.className = "low";
  tr.innerHTML = `
    <td><div class="item">${it.name}</div><div class="cat">${it.cat}</div></td>
    <td class="qty">${it.qty} ${it.unit}${low ? '<span class="tag">low</span>' : ''}
      <div class="bar"><i style="width:${pct}%"></i></div>
    </td>
    <td class="qty">${it.par} ${it.unit}</td>`;
  rows.appendChild(tr);
});

const btn = document.getElementById("askBtn");
const panel = document.getElementById("panel");

btn.addEventListener("click", async () => {
  btn.disabled = true;
  panel.className = "show";
  panel.innerHTML = `<h2>Restock plan</h2><span class="dot">●</span> <span class="dot">●</span> <span class="dot">●</span>`;

  const prompt = `You are the kitchen manager's restock assistant for a restaurant called Woodfire & Co.
Here is tonight's inventory (item, category, unit, on-hand, par level):
${inventory.map(i => `- ${i.name} (${i.cat}): ${i.qty} ${i.unit} on hand, par ${i.par} ${i.unit}`).join("\n")}

Write a short, direct restock plan for the kitchen manager:
1. List items that need ordering now (on hand below ~60% of par), with a suggested order quantity to bring them back to par, most urgent first.
2. One line at the end flagging anything that can wait until the next delivery.
Keep it tight and practical, like a note pinned to the kitchen board. No preamble.`;

  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: prompt }] })
    });
    if (!response.ok) throw new Error(`API error ${response.status}`);
    const data = await response.json();
    const text = data.content.map(b => b.text || "").join("\n");
    panel.innerHTML = `<h2>Restock plan</h2>${text}`;
  } catch (e) {
    panel.innerHTML = `<h2>Restock plan</h2>Couldn't reach the assistant (${e.message}). Try again in a moment.`;
  } finally {
    btn.disabled = false;
  }
});
