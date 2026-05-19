# Setting up the grind-profiler site

These files in `site/` are designed to live in your `grind-profiler` GitHub repository and be served via GitHub Pages. Here's how to wire it up.

---

## 1. Move the files into the grind-profiler repo

From the Brew Tuner project root, copy the contents of `site/` into your local checkout of `grind-profiler`:

```bash
# Adjust the destination path to wherever your grind-profiler checkout lives.
GRIND_PROFILER=~/Projects/grind-profiler

cp -R "site/." "$GRIND_PROFILER/"
cd "$GRIND_PROFILER"
git status   # eyeball what's new before committing
```

If `grind-profiler` already has a `README.md`, the copy will overwrite it. Diff and reconcile if you want to keep parts of the old one.

## 2. Commit and push

```bash
git add .
git commit -m "Add Brew Tuner landing, privacy, support, submission guide"
git push
```

## 3. Enable GitHub Pages

In the `grind-profiler` repo on github.com:

1. **Settings → Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `main` (or `master`), folder: `/ (root)`
4. **Save**

Within a minute or two, your site is live at:

```
https://YOUR_GITHUB_USERNAME.github.io/grind-profiler/
```

Verify these URLs all resolve to real content:

- `/` → landing page (README.md renders as index)
- `/privacy/` → privacy policy
- `/support/` → support page
- `/app-store-submission/` → submission guide

## 4. (Optional) Custom domain

If you want the site at a custom domain (e.g. `brewtuner.app` or `tonyschmidt.io/brewtuner`):

1. Create a `CNAME` file in the repo root containing just your domain, e.g.:
   ```
   brewtuner.app
   ```
2. In Settings → Pages → Custom domain, enter the same domain and save.
3. In your DNS provider, add either:
   - An `A` record pointing the domain at GitHub Pages IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - Or a `CNAME` record on a subdomain pointing at `YOUR_USERNAME.github.io`.
4. Wait 10-30 minutes for DNS propagation, then enable "Enforce HTTPS" in the GitHub Pages settings.

After custom domain is live, your URLs become:

- `https://brewtuner.app/privacy/`
- `https://brewtuner.app/support/`

These are what you'll plug into App Store Connect / Play Console for the Privacy Policy and Support URL fields.

## 5. Update the Brew Tuner code repo's APP_STORE.md

The submission guide in `brewtuner-mobile/APP_STORE.md` still references `YOURDOMAIN` placeholders. Once you know the final URLs (GitHub Pages default or custom domain), do a find-and-replace:

```bash
cd ~/Projects/brewtuner-mobile

# If using GitHub Pages default:
sed -i '' 's|https://YOURDOMAIN/brewtuner/privacy|https://YOUR_USERNAME.github.io/grind-profiler/privacy|g' APP_STORE.md
sed -i '' 's|https://YOURDOMAIN/brewtuner/support|https://YOUR_USERNAME.github.io/grind-profiler/support|g' APP_STORE.md

# Or if using a custom domain like brewtuner.app:
sed -i '' 's|https://YOURDOMAIN/brewtuner/privacy|https://brewtuner.app/privacy|g' APP_STORE.md
sed -i '' 's|https://YOURDOMAIN/brewtuner/support|https://brewtuner.app/support|g' APP_STORE.md
```

(Adjust the `sed` flag for GNU sed on Linux: `sed -i` instead of `sed -i ''`. macOS uses BSD sed which needs the empty string.)

## 6. Future updates

Anything you push to `main` on `grind-profiler` deploys automatically within a minute or two. No build step needed — GitHub runs Jekyll for you.

When you want to add screenshots, tweak the description, or update the privacy policy: edit the markdown, commit, push. Done.

---

## File map

```
grind-profiler/
├── README.md                    # Landing page (also serves as repo's GitHub README)
├── privacy.md                   # Privacy policy → /privacy/
├── support.md                   # Support page → /support/
├── app-store-submission.md      # Submission guide → /app-store-submission/
├── _config.yml                  # Jekyll theme + site config
└── CNAME                        # (optional) custom domain
```

## Theme notes

`_config.yml` sets the theme to `jekyll-theme-cayman` — a clean, single-column theme built into GitHub Pages. If you want to swap it, change `theme:` to one of:

- `jekyll-theme-minimal` — sparser, more text-focused
- `jekyll-theme-slate` — dark, more technical-looking
- `jekyll-theme-architect` — flatter, geometric
- `jekyll-theme-leap-day` — colorful sidebar style

Or remove `_config.yml` entirely and the site will render as plain markdown without theming.

For a fully custom look, swap in your own `index.html` + `assets/styles.css` and remove `_config.yml`.
