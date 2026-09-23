let cart = [];

document.querySelectorAll(".add").forEach(btn => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);
    const existing = cart.find(i => i.name === name);
    if (existing) existing.qty += 1;
    else cart.push({ name, price, qty: 1 });
    renderCart();
  });
});

function renderCart() {
  const box = document.getElementById("cartItems");
  const totalRow = document.getElementById("cartTotal");
  const placeBtn = document.getElementById("placeOrder");

  if (cart.length === 0) {
    box.innerHTML = `<div class="cart-empty">Nothing added yet.</div>`;
    totalRow.style.display = "none";
    placeBtn.disabled = true;
    return;
  }

  box.innerHTML = cart.map(i =>
    `<div class="cart-row"><span>${i.name} × ${i.qty}</span><span>$${(i.price * i.qty).toFixed(2)}</span></div>`
  ).join("");

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  document.getElementById("totalAmount").textContent = `$${total.toFixed(2)}`;
  totalRow.style.display = "flex";
  placeBtn.disabled = false;
}

document.getElementById("placeOrder").addEventListener("click", () => {
  const name = document.getElementById("custName").value.trim() || "Guest";
  const table = document.getElementById("custTable").value.trim() || "—";

  const orders = JSON.parse(localStorage.getItem("wk_orders") || "[]");
  orders.unshift({
    id: Date.now(),
    customer: name,
    table,
    items: cart.map(i => `${i.name} × ${i.qty}`),
    total: cart.reduce((sum, i) => sum + i.price * i.qty, 0),
    time: new Date().toLocaleString(),
    fulfilled: false,
  });
  localStorage.setItem("wk_orders", JSON.stringify(orders));

  cart = [];
  renderCart();
  document.getElementById("custName").value = "";
  document.getElementById("custTable").value = "";
  const msg = document.getElementById("confirmMsg");
  msg.className = "confirm show";
  setTimeout(() => msg.className = "confirm", 3000);
});
