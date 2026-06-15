# Connecting Claude Code to the WordPress site (Royal MCP + Abilities API)

How to drive the V2 WordPress build at
**[mzhprabe.elementor.cloud](https://mzhprabe.elementor.cloud/)** from **Claude Code**.

We're trialing **two** MCP servers side by side:

1. **Royal MCP** — vendor plugin, fastest to start, Elementor-aware.
2. **Abilities API + MCP Adapter** — the official WordPress.org path (future-proof).

> ⚠️ **Do this on the staging site only.** These servers give an AI write access to
> your site. Use the staging URL above, keep backups on, and revoke tokens when
> you're done. Never commit a password/token into this repo.

---

## 0. One-time prerequisite — create a WordPress Application Password

Both approaches authenticate as your WordPress user with an **Application Password**
(a revocable, per-app password — *not* your login password).

1. Log in to WP Admin: `https://mzhprabe.elementor.cloud/wp-admin`
2. Go to **Users → Profile** (or **Users → All Users → your user → Edit**).
3. Scroll to **Application Passwords**.
4. Enter a name, e.g. `claude-code`, and click **Add New Application Password**.
5. **Copy the generated password** (looks like `abcd EFGH ijkl MNOP qrst UVWX`).
   You'll see it only once. Spaces are fine — keep them or remove them, both work.
6. Store it somewhere safe (a password manager). **Do not** put it in this repo.

> If you don't see "Application Passwords," it's disabled — it requires HTTPS
> (Elementor Cloud is HTTPS, so it should appear). Confirm WordPress is **6.9+**
> under **Dashboard → Updates** (required for the Abilities API path).

---

## 1. Approach A — Royal MCP (start here)

### Install
1. WP Admin → **Plugins → Add New**.
2. Search **"Royal MCP"** (by Royal Plugins), **Install**, then **Activate**.
   - (Elementor Cloud allows third-party plugins; if search is blocked, download
     the ZIP from royalplugins.com and use **Plugins → Add New → Upload Plugin**.)
3. Open the plugin's settings (look for **Royal MCP** in the admin menu).
4. **Enable the MCP server**, create/copy an **API key** (or enable OAuth), and
   choose which tool groups to expose. Royal MCP auto-detects Elementor/ACF and
   unlocks their tools.
5. The settings screen shows your **MCP endpoint URL** and usually a ready-to-copy
   connection command — use those exact values; the examples below are the shape.

### Connect from Claude Code
Royal MCP exposes an HTTP MCP endpoint with bearer/API-key auth:

```bash
claude mcp add royal-wp \
  --transport http \
  https://mzhprabe.elementor.cloud/wp-json/<ENDPOINT_FROM_PLUGIN> \
  --header "Authorization: Bearer YOUR_ROYAL_MCP_API_KEY"
```

Replace `<ENDPOINT_FROM_PLUGIN>` and the key with the values shown on the Royal MCP
settings page.

### Verify
```bash
claude mcp list          # royal-wp should show "connected"
```
Then in a Claude Code session: *"List the pages on the site"* or *"Create a draft
page titled 'Test'"* — confirm it appears in WP Admin.

---

## 2. Approach B — Abilities API + MCP Adapter (official)

The **Abilities API** is built into WordPress core **6.9+**. It only becomes useful
to an AI client once the **MCP Adapter** plugin exposes those abilities over MCP.

### Install the MCP Adapter
Two options:

**a) Upload the release ZIP (simplest on Elementor Cloud)**
1. Download the latest `mcp-adapter.zip` from the
   [releases page](https://github.com/WordPress/mcp-adapter/releases/latest).
2. WP Admin → **Plugins → Add New → Upload Plugin** → choose the ZIP → **Install** → **Activate**.

**b) WP-CLI** (if you have CLI/SSH access to the host)
```bash
wp plugin install https://github.com/WordPress/mcp-adapter/releases/latest/download/mcp-adapter.zip --activate
```

Once active, the default MCP server is available at:

```
https://mzhprabe.elementor.cloud/wp-json/mcp/mcp-adapter-default-server
```

> The set of tools is whatever **abilities** are registered — WordPress core
> registers some in 6.9, and more appear as plugins (Elementor, etc.) add their own.
> Expect a smaller tool set than Royal MCP today; this is the forward-looking bet.

### Connect from Claude Code
The adapter is reached through Automattic's MCP proxy, which handles auth and the
HTTP transport. Add it to Claude Code as a stdio server that runs the proxy:

```bash
claude mcp add wp-abilities \
  --env WP_API_URL=https://mzhprabe.elementor.cloud/wp-json/mcp/mcp-adapter-default-server \
  --env WP_API_USERNAME=YOUR_WP_USERNAME \
  --env WP_API_PASSWORD="YOUR_APPLICATION_PASSWORD" \
  -- npx -y @automattic/mcp-wordpress-remote@latest
```

- `WP_API_USERNAME` = your WordPress username (not email).
- `WP_API_PASSWORD` = the **Application Password** from Step 0.
- Requires **Node.js / npx** installed locally (Claude Code already needs Node).

### Verify
```bash
claude mcp list          # wp-abilities should show "connected"
```
In a session: *"What WordPress abilities/tools are available?"* then try a read
action before any writes.

---

## 3. Running both at once

You can register both servers — Claude Code will show tools from each:

```bash
claude mcp list
# royal-wp       connected
# wp-abilities   connected
```

Prefix your requests so it's clear which you mean (e.g. *"using royal-wp, clone the
Dewitt page"*). Royal MCP is the practical workhorse for content/Elementor today;
the Abilities API server is for learning the official direction.

---

## 4. Scope, safety & housekeeping

- **Staging first, always.** Point at the live site only once you trust the flow.
- **Least privilege:** if a plugin lets you limit tool groups or use a lower-role
  user, do it. Don't expose more than you need.
- **Secrets stay out of git.** Tokens/passwords live in your password manager and
  the `claude mcp add` env — never in this repo. (Claude Code stores MCP config
  outside the project by default.)
- **Audit:** enable activity logging in Royal MCP; review what the AI changed.
- **Revoke when done:** WP Admin → Users → Profile → Application Passwords → revoke;
  remove a server with `claude mcp remove royal-wp` / `claude mcp remove wp-abilities`.
- **Backups on.** Take a snapshot before any bulk operation.

---

### References
- [Royal MCP](https://royalplugins.com/royal-mcp/)
- [WordPress MCP Adapter (GitHub)](https://github.com/wordpress/mcp-adapter)
- [Abilities API in WordPress 6.9 & the role of MCP](https://www.miniorange.com/blog/wordpress-api-abilities-and-mcp-ai-agents/)
- [@automattic/mcp-wordpress-remote (npm proxy)](https://www.npmjs.com/package/@automattic/mcp-wordpress-remote)
- [AI Engine — Claude Code + WordPress (Meow Apps)](https://meowapps.com/claude-code-wordpress-mcp/)
