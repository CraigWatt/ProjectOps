# ProjectOps MVP

This repository contains a static MVP for ProjectOps, a project-level operational and cost visibility tool.

## What’s included

- Portfolio dashboard with monthly and annualised spend
- Project cards and project detail view
- Cost inventory with filters
- Shared allocation and dead-weight views
- Local persistence through `localStorage`

## How to run

Open `index.html` in a browser. The app uses plain HTML, CSS, and JavaScript so it works without a build step.

## GitHub Pages

The repository now includes a GitHub Pages workflow that deploys the static site from `main`.
With the Pages source set to `Actions`, every push to `main` publishes the latest MVP.
The expected live site URL is `https://craigwatt.github.io/ProjectOps/`.

## Integration direction

The first production data sources to connect are AWS and GoDaddy.
CSV import stays in the loop as the manual fallback for providers that do not yet have an API connector.

## Notes

- The included data is demo data.
- The MVP assumes a single reporting currency for the portfolio view, with USD as the default display currency.
