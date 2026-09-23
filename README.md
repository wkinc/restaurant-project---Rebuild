# Restock — Kitchen Inventory (Rebuild)

This is a rebuild of the AI-powered restaurant inventory project from the hackathon. It is a much simpler version.

## About

The original project was built for a hackathon (Top 10, The Access Group 2026). This version keeps the main idea — an inventory list with AI restock suggestions — but with less features and simpler code.

## What it does

- Shows a list of kitchen items with current stock and par level (the amount you want to keep in stock).
- Marks items that are running low.
- A button asks Claude AI to write a restock plan based on the stock levels.

## Files

- `index.html` — page structure
- `style.css` — styling
- `script.js` — inventory data and the AI request

## Why simpler

The hackathon version had more features and a bigger backend. This rebuild is a small front-end demo to show the core idea: inventory tracking + AI restock suggestions, without the extra complexity.

## Note

The AI button only works when the page is running inside a Claude artifact. To use it on your own site, you need to connect it to the Anthropic API with your own key.
