import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ---------------------------------------------------------------------------
// The `locations` collection is the single source of truth for the site.
//
// One location = one JSON file in `src/data/locations/<slug>.json`.
// The location page (`/locations/<slug>`) AND the location finder
// (`/locations`) are BOTH generated from these files. Never hand-build a
// location page — add or edit a data file and the site rebuilds itself.
//
// The file name is the slug (e.g. `ludington.json` -> `/locations/ludington`).
// ---------------------------------------------------------------------------

const membership = z.object({
  id: z.string(), // CourtReserve membership ID
  plan: z.string(), // e.g. "Summer UNLIMITED PLAY"
  type: z.string(), // e.g. "Individual" | "Family"
  price: z.string(), // e.g. "$95 / Monthly" or "Free" — never invent a price
  description: z.string().optional(),
  offerEnds: z.string().optional(), // e.g. "9/30/2026"
  features: z.array(z.string()).default([]),
  signupUrl: z.string().url(),
});

const menuItem = z.object({
  label: z.string(),
  href: z.string(),
});

const eventItem = z.object({
  title: z.string(),
  date: z.string(),
  description: z.string().optional(),
});

const locations = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/data/locations' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    lat: z.number(),
    lng: z.number(),
    phone: z.string(),
    courtReserveOrgId: z.string(),
    courtReserveUrl: z.string().url(),
    bays: z.number(),
    hours: z.array(z.object({ days: z.string(), time: z.string() })).default([]),
    ownerName: z.string(),
    ownerBio: z.string().optional(),
    photos: z.array(z.string()).default([]),
    memberships: z.array(membership).default([]),
    // Optional per-location secondary menu, owner-controlled.
    secondaryMenu: z.array(menuItem).default([]),
    // Optional events, owner-controlled.
    events: z.array(eventItem).default([]),
  }),
});

export const collections = { locations };
