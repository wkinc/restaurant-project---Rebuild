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

  const sample = await claude.use("sample");
  if (!sample) {
    panel.innerHTML = `<h2>Restock plan</h2>Kitchen assistant isn't available in this view.`;
    btn.disabled = false;
    return;
  }

  const prompt = `You are the kitchen manager's restock assistant for a restaurant called Woodfire & Co.
Here is tonight's inventory (item, category, unit, on-hand, par level):
${inventory.map(i => `- ${i.name} (${i.cat}): ${i.qty} ${i.unit} on hand, par ${i.par} ${i.unit}`).join("\n")}

Write a short, direct restock plan for the kitchen manager:
1. List items that need ordering now (on hand below ~60% of par), with a suggested order quantity to bring them back to par, most urgent first.
2. One line at the end flagging anything that can wait until the next delivery.
Keep it tight and practical, like a note pinned to the kitchen board. No preamble.`;

  try {
    const result = await sample(prompt, { modelTier: "quick" });
    panel.innerHTML = `<h2>Restock plan</h2>${result.text}`;
  } catch (e) {
    panel.innerHTML = `<h2>Restock plan</h2>Couldn't reach the assistant (${e.code || "error"}). Try again in a moment.`;
  } finally {
    btn.disabled = false;
  }
});
