# Restock — Kitchen Inventory (Rebuild)

This is a rebuild of the AI-powered restaurant inventory project from the hackathon. It is a much simpler version.

## About

The original project was built for a hackathon (Top 10, The Access Group 2026). This version keeps the main idea — inventory with AI restock suggestions — but adds a simple restaurant website on top, with a customer side and a staff side.

## What it does

**Customer side (`index.html`)**
- Shows a menu with starters, mains, and sides.
- Customers can add dishes to a cart and place an order with their name and table number.

**Staff login (`login.html`)**
- A simple login page for staff.
- Demo login only: username `test`, password `test` (shown on the page since this is just for demo).

**Admin dashboard (`admin.html`)**
- Only reachable after logging in.
- Two tabs:
  - **Customer Orders** — shows orders placed on the customer side.
  - **Restock** — shows kitchen stock levels and a button to ask Claude AI for a restock plan.

## Files

- `index.html` — customer menu and ordering page
- `login.html` — staff login page
- `admin.html` — orders + restock dashboard
- `resource/style.css` — shared styling for all pages
- `resource/order.js` — customer ordering logic
- `resource/login.js` — staff login logic
- `resource/admin.js` — orders view + restock/AI logic

## How data is stored

Since this is hosted on GitHub Pages (no real backend), orders are saved in the browser's `localStorage`. This means:
- Orders show up in the admin dashboard only on the same browser/device that placed them.
- Data does not sync between different visitors or devices.
- This is fine for a demo, but not for a real multi-user restaurant.

## AI restock feature

The restock button sends the current stock levels to a Cloudflare Worker, which calls an AI model and returns a restock plan. The Worker keeps the API key private, so it is never exposed in the website's code.

## Why simpler

The hackathon version had more features and a bigger backend. This rebuild is a small front-end demo to show the core idea: a restaurant ordering flow plus AI-assisted restocking, without the extra complexity.
