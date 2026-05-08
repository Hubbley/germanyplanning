# Deploy Guide — Germany Relocation Timeline
### From zero to live website in ~30 minutes

---

## What you're deploying

A personal checklist website that:
- Lives at your own domain (e.g. `yourdomain.com`)
- Works on any device — phone, tablet, PC
- Saves progress automatically (checkboxes + notes)
- Is shared between you and your partner — same URL, same state
- Costs ~$10/year (domain only) — hosting is free on Cloudflare

---

## What you need before starting

- A credit card (for the domain — ~$10/year)
- An email address
- About 30 minutes

---

## Step 1 — Create a GitHub account (5 min)

1. Go to **https://github.com** and click **Sign up**
2. Choose the **Free** plan
3. Verify your email address

---

## Step 2 — Create your repository (3 min)

1. Once logged in, click the **+** icon (top right) → **New repository**
2. Name it: `germany-timeline`
3. Set to **Public** (required for free Cloudflare Pages)
4. Leave everything else as default — don't add a README
5. Click **Create repository**

You'll land on an empty repo page. Leave this tab open.

---

## Step 3 — Upload your files (5 min)

You have two options:

### Option A — Upload via the GitHub website (easiest, no Git needed)

1. On your empty repo page, click **uploading an existing file**
2. Drag and drop ALL the files from this folder:
   ```
   index.html
   wrangler.toml
   _headers
   _redirects
   .gitignore
   functions/
     api/
       save.js
       load.js
   ```
   > ⚠️ Make sure to upload the `functions/api/` folder — GitHub will ask you
   > to confirm subdirectory structure.
3. Scroll down, add a commit message like `Initial deploy`
4. Click **Commit changes**

### Option B — Use Git from the command line

```bash
git init
git add .
git commit -m "Initial deploy"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/germany-timeline.git
git push -u origin main
```

---

## Step 4 — Create a Cloudflare account (3 min)

1. Go to **https://cloudflare.com** → **Sign Up** (free)
2. Verify your email

---

## Step 5 — Connect GitHub to Cloudflare Pages (5 min)

1. In the Cloudflare dashboard, go to **Workers & Pages** (left sidebar)
2. Click **Create** → **Pages** → **Connect to Git**
3. Click **Connect GitHub** and authorize Cloudflare
4. Select your `germany-timeline` repository
5. Click **Begin setup**

On the build settings page:
- **Framework preset**: None
- **Build command**: *(leave blank)*
- **Build output directory**: `/` (just a slash)

6. Click **Save and Deploy**

Cloudflare will deploy your site. After ~30 seconds you'll get a URL like
`germany-timeline-xyz.pages.dev` — your site is already live at this address.

---

## Step 6 — Set up KV storage (saves your progress) (5 min)

1. In Cloudflare dashboard, go to **Workers & Pages** → **KV** (under Storage)
2. Click **Create a namespace**
3. Name it: `PROGRESS`
4. Click **Add**
5. Copy the **ID** shown next to your new namespace

Now link it to your Pages project:
1. Go to **Workers & Pages** → click your `germany-timeline` project
2. Click **Settings** → **Functions** → scroll to **KV namespace bindings**
3. Click **Add binding**
   - Variable name: `PROGRESS`
   - KV namespace: select `PROGRESS` from the dropdown
4. Click **Save**

Now update `wrangler.toml` in your repository:
1. Open `wrangler.toml` in GitHub (click the file, then the pencil ✏️ icon)
2. Replace `YOUR_KV_NAMESPACE_ID_HERE` with the ID you copied
3. Commit the change

Cloudflare will automatically redeploy. Progress saving is now live.

---

## Step 7 — Buy a domain (5 min)

1. Go to **https://porkbun.com**
2. Search for a domain — suggestions:
   - `[yournames]-germany.com`  (~$10/year)
   - `ourmove.me`               (~$4/year)
   - `[yourname]-relocation.com`
3. Add to cart and check out (credit card required)
4. Leave DNS on Porkbun's default nameservers for now

---

## Step 8 — Connect your domain to Cloudflare (5 min)

1. In Cloudflare, go to your `germany-timeline` Pages project
2. Click **Custom domains** → **Set up a custom domain**
3. Enter your domain (e.g. `ourmove.me`)
4. Click **Continue** — Cloudflare will show you nameservers to use

Now update your nameservers at Porkbun:
1. Log into Porkbun → **Account** → **Domain Management** → your domain
2. Click **NS** (Nameservers)
3. Switch to **Custom nameservers**
4. Enter the two nameservers Cloudflare gave you (e.g. `aria.ns.cloudflare.com`)
5. Save

DNS propagation takes 5–30 minutes. Once done, your site is live at your domain
with automatic HTTPS — no extra setup needed.

---

## Sharing with your partner

Just send them the URL. Because both of you share the same KV store, you'll
see the same checkboxes and notes in real time (after a page refresh).

---

## Making changes later

Edit `index.html` directly in GitHub (click the file → pencil icon → edit →
commit). Cloudflare redeploys automatically within ~30 seconds.

---

## File structure reference

```
germany-timeline/
├── index.html              ← The checklist app
├── wrangler.toml           ← Cloudflare config (update with your KV ID)
├── _headers                ← Security headers
├── _redirects              ← URL routing rules
├── .gitignore              ← Files Git should ignore
└── functions/
    └── api/
        ├── save.js         ← POST /api/save  (saves your progress)
        └── load.js         ← GET  /api/load  (loads saved progress)
```

---

## Troubleshooting

**Progress isn't saving**
- Check that the KV binding variable name is exactly `PROGRESS` (uppercase)
- Make sure `wrangler.toml` has your real KV namespace ID, not the placeholder

**Domain not working after 30+ minutes**
- Nameserver changes can take up to 48 hours in rare cases
- Verify nameservers at https://dnschecker.org — search your domain, select NS

**Site shows old content after editing**
- Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Or wait 1–2 minutes for Cloudflare's cache to clear

**"KV binding PROGRESS not configured" error**
- The KV binding in Cloudflare Pages settings hasn't been saved yet
- Go back to Step 6 and re-add the binding

---

*Questions? The Cloudflare Pages docs are at https://developers.cloudflare.com/pages*
