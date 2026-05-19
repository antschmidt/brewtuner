---
title: App Store Submission Guide
permalink: /app-store-submission/
---

# Brew Tuner — App Store Submission Guide

How to take a Brew Tuner build from your Mac to the iOS App Store. Most of the work is filling in text fields in App Store Connect; the build/upload from Xcode is a single dialog flow.

> **One-time work**: registering the bundle ID, configuring signing, writing the listing copy.
> **Per-release work**: bumping the build number, archiving in Xcode, uploading, attaching the build to a version, submitting for review.

---

## 0. Prerequisites

- [x] Apple Developer Program enrollment (approved)
- [x] Xcode installed (you already have it from M6)
- [x] CocoaPods installed (you already have it from M6)
- [x] An iCloud / Apple ID with two-factor auth (required for App Store Connect)
- [ ] Bundle ID registered in Apple Developer portal — see step 1
- [ ] App record created in App Store Connect — see step 2
- [ ] Privacy policy + support pages hosted at stable URLs — see step 3
- [ ] Screenshots captured — see step 5

---

## 1. Register the Bundle ID

Go to https://developer.apple.com/account/resources/identifiers/list and click the **+** button.

- Type: App IDs → App
- Description: `Brew Tuner`
- Bundle ID: **Explicit** → `io.tonyschmidt.brewtuner`
- Capabilities: leave defaults (no special capabilities needed for v1)
- Save

This is the same identifier already in `capacitor.config.ts` and `ios/App/App.xcodeproj`.

---

## 2. Create the App in App Store Connect

Go to https://appstoreconnect.apple.com → My Apps → **+** → New App.

Fill in:

| Field | Value |
|---|---|
| Platforms | iOS |
| Name | Brew Tuner |
| Primary language | English (U.S.) |
| Bundle ID | `io.tonyschmidt.brewtuner` (from step 1) |
| SKU | `BREWTUNER001` (free-form; never shown publicly, used for your records) |
| User Access | Full Access |

Submit.

---

## 3. Host the privacy policy and support pages

Apple requires public URLs for both, even if you collect zero data. The repo has:

- [`PRIVACY.md`](./PRIVACY.md) — the privacy policy
- [`SUPPORT.md`](./SUPPORT.md) — the support page

Host them on your domain — wherever you're set up. Suggested final URLs:

- `https://YOURDOMAIN/brewtuner/privacy`
- `https://YOURDOMAIN/brewtuner/support`

Both pages should be plain HTML (or rendered markdown) and publicly accessible without auth. Keep the URLs stable — Apple will rejection-reject if they later 404.

---

## 4. Fill in the App Store listing

In App Store Connect → your app → **App Information** (sidebar):

| Field | Value |
|---|---|
| Subtitle | `Your brew-by-brew dial-in log` |
| Category — Primary | Food & Drink |
| Category — Secondary | Lifestyle (optional but helpful for discoverability) |
| Content Rights | "Does not contain, show, or access third-party content" → Yes |
| Age Rating | Complete the questionnaire — should land at 4+ |

Then go to the version page (defaults to **1.0 Prepare for Submission**):

### Promotional Text (170 chars, editable without resubmission)

```
Dial in your coffee, brew by brew. Log every grind setting, dose, yield, time, and rating, then tap "Adjust & re-brew" to chase the sweet spot.
```

### Description (paste this — under 4000 chars)

```
Brew Tuner is a coffee dial-in companion. Pick a bean, pick a grinder, pick a brew method, then log every brew with grind setting, dose, yield, time, and rating.

Designed for the moment you actually need it: standing at the kitchen counter, coffee-stained fingers, wanting to know what you did last time so you can change one thing.

WHAT YOU CAN DO

• Track beans (roaster, origin, varietal, process, roast level, notes)
• Track grinders for any dial type — integer steps (Encore), fractional (Niche, 1Zpresso), stepless, even grinders with negative settings
• Track brew methods with their default recipes
• Log brews with the full recipe + 1-10 rating + tasting notes + flavor tags

DIAL-IN SUPERPOWERS

• "Adjust & re-brew" duplicates any past brew so you can change one variable (usually grind) and try again
• Per-bean dial-in view groups your attempts by (grinder, brew method) so you can see exactly how the grind setting moved across tries
• Filter the brew history by bean, grinder, or method to compare like with like

WORKS YOUR WAY

• Independent unit prefs for grounds (g / oz), liquid output (g / oz), and water temperature (°C / °F). Measure grounds in grams and liquid in ounces if that's how you work.
• Common grinders and brew methods are pre-loaded — V60, AeroPress, Chemex, Baratza Encore, Niche Zero, 1Zpresso JX-Pro, and more
• Fully offline — every screen works without a network connection
• No accounts required
• Your data lives only on your device

BACKUP, NOT SYNC

When you want to move your data to a new phone or just keep a snapshot, Settings → Backup &amp; restore exports everything to a single JSON file you can save anywhere — iCloud Drive, Google Drive, email, AirDrop. Restore on the new device by picking the file back up.

There's no cloud sync, no accounts, no ads, no analytics, no tracking. Just a coffee log that's actually yours.

Brew Tuner is built for one purpose: making your next cup better than your last.
```

### Keywords (100 chars total, comma-separated, no spaces after commas)

```
coffee,grinder,brew,espresso,pour over,V60,aeropress,dial in,recipe,barista,grind
```

That's 81 chars — leaves room to tune. Apple says to omit spaces after commas (counted as wasted characters).

### Support URL

`https://YOURDOMAIN/brewtuner/support` (from step 3)

### Marketing URL (optional)

Leave blank for v1 or point at the GitHub repo if public.

### Copyright

```
© 2026 Tony Schmidt
```

### App Review Information

| Field | Value |
|---|---|
| Sign-in required | No |
| Contact First Name | Tony |
| Contact Last Name | Schmidt |
| Phone Number | (your phone) |
| Email | mail@tonyschmidt.io |
| Notes | "Brew Tuner is an offline-only coffee dial-in app. No account or sign-in required. All data is stored locally on the device. Tap 'Log a brew' on the Home tab to test the core flow." |

### Version Release

Pick **Automatically release this version after App Review approval** for a hands-off ship, or **Manually release** if you want to coordinate the moment.

---

## 5. Screenshots

Required: at least one set in **iPhone 6.7" Display** (iPhone 15 Pro Max / 16 Pro Max resolution). Apple will scale these for other sizes.

Recommended captures (5–8 screenshots):

1. **Home** — the hero gradient card, library stats strip, and recent brews list (best after you've logged ~3-5 brews)
2. **Log a brew** form — fully filled out, mid-flow
3. **Brew detail** — big grind + rating tiles, recipe table, tasting notes
4. **Per-bean dial-in view** — best-brew callout + grouped sections (capture this after logging a few brews on the same bean)
5. **Library / Grinders list** — shows the variety of grinder types
6. **Settings → Units** — to surface the per-quantity unit toggles
7. **Brews tab with filter chips active** — shows the dial-in filtering

How to capture:
1. Open the iOS Simulator
2. Boot an iPhone 15 Pro Max (or 16 Pro Max if available)
3. Run the app: `pnpm run run:ios` and pick the Pro Max simulator
4. Use the brew log seeded with realistic test data, OR import a backup with some history
5. In the Simulator menu: **File → Save Screen → ⌘+S** (saves to your Desktop)

Resolution: 1290 × 2796 px (iPhone 15/16 Pro Max). Upload via the version page in App Store Connect.

---

## 6. App Privacy "nutrition label"

App Store Connect → your app → **App Privacy** (sidebar). Click **Get Started**.

Answer:

- **Do you or your third-party partners collect data from this app?** → **No, we do not collect data from this app**

Confirm and submit. Apple shows this as "Data Not Collected" on your store page.

---

## 7. App icon for store listing

App Store Connect wants a 1024×1024 PNG (no transparency, no rounded corners).

Generated by `pnpm run assets:generate` at:

```
ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png
```

Upload that file in the version page's **App Icon** field.

---

## 8. Bump build number and version (Xcode)

Open the project:

```bash
pnpm run open:ios
```

In Xcode, click the project root (top of the left sidebar, "App") → **General** tab.

| Field | First submission value |
|---|---|
| Version | `0.1.0` |
| Build | `1` |

For every subsequent upload to the same version, just bump **Build** (`2`, `3`, etc.). Bump **Version** when releasing a new version to users (`0.2.0`, `1.0.0`, etc.).

---

## 9. Archive and upload

In Xcode:

1. Top toolbar: switch the destination from a simulator to **Any iOS Device (arm64)**
2. Product menu → **Archive**
3. Wait for the build (~1-3 minutes)
4. The Organizer window opens automatically on success
5. Select your new archive → **Distribute App**
6. Method: **App Store Connect**
7. Destination: **Upload**
8. Distribution options: defaults (automatic signing, include bitcode if asked, upload symbols)
9. Review and click **Upload**

After upload, App Store Connect spends 15–60 minutes processing the build. You'll get an email when it's ready (or it'll show up under the **TestFlight** tab and on the **Version** page as a selectable build).

---

## 10. Attach build and submit for review

App Store Connect → your app → **1.0 Prepare for Submission** (sidebar):

1. Scroll to **Build** section → **+** → pick the build that just finished processing
2. Confirm all required fields are filled (screenshots, description, keywords, etc. — App Store Connect flags missing ones)
3. Click **Save**
4. Click **Add for Review** → **Submit for Review**

Submission is now in Apple's queue. First-time review for a new app typically takes **1–3 business days**. Status will show **Waiting for Review** → **In Review** → **Pending Developer Release** (if manual) or **Ready for Sale** (if automatic).

You'll get an email when status changes. If rejected, the email will name the specific issue and link to the resolution center; address the issue, bump the build number, re-archive, re-upload, re-submit.

---

## 11. Subsequent releases

Once the listing is set up, shipping a new version is short:

```bash
# In Xcode: bump Build (and Version if applicable) in Project → General
# Then:
pnpm run sync:ios
pnpm run open:ios
# In Xcode: Product → Archive → Distribute App → Upload
```

In App Store Connect:
1. **+ Version or Platform** → enter new version number
2. Fill in **What's New in This Version** (release notes, 4000 char limit)
3. Attach the new build
4. Submit for review

Subsequent reviews are usually faster than the first (often <24h).

---

## Common rejection reasons (and how to avoid them)

**"Guideline 5.1.1 - Privacy Policy"** — Privacy Policy URL must be reachable, the policy must accurately describe the app's data practices, and must be on a stable domain. We've got this covered as long as the URL is live.

**"Guideline 2.1 - Performance: App Completeness"** — Reviewers couldn't get the app to do anything. Mitigation: in App Review Information notes (step 4), point them at the "Log a brew" button as the core flow.

**"Guideline 4.0 - Design"** — App looks like a website wrapped in a webview. Mitigation: our app uses native-feeling navigation patterns (bottom tab bar, safe-area handling, OS-native pickers / share sheet / file picker), so this should not fire. If it does, point to those native integrations in your appeal.

**"Guideline 2.3.10 - Performance: Accurate Metadata"** — Screenshots show features not actually in the app, or description claims something that isn't. Mitigation: keep screenshots and description aligned with what v1 actually does. The description here is honest.

**Missing privacy nutrition label** — Apple won't even queue review if **App Privacy** is not filled in. Mitigation: complete step 6 before submitting.

**Build number not higher than previous** — every upload must have a build number strictly higher than the last one accepted. If you ever upload, then re-upload without bumping, the second upload silently fails.

---

## Quick reference: the actual numbers

- Bundle ID: `io.tonyschmidt.brewtuner`
- App name: `Brew Tuner`
- Subtitle: `Your brew-by-brew dial-in log` (29 chars)
- Version: `0.1.0`
- Build (first upload): `1`
- Category: Food & Drink (primary), Lifestyle (secondary)
- Age rating: 4+
- Keywords: `coffee,grinder,brew,espresso,pour over,V60,aeropress,dial in,recipe,barista,grind` (81 chars)
- Copyright: `© 2026 Tony Schmidt`
- App icon: `ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png` (after `pnpm run assets:generate`)
- Privacy URL: `https://YOURDOMAIN/brewtuner/privacy`
- Support URL: `https://YOURDOMAIN/brewtuner/support`
