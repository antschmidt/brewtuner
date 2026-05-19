<svelte:head>
	<title>Privacy Policy — Brew Tuner</title>
	<meta name="description" content="Brew Tuner privacy policy. We collect nothing — all data stays on your device." />
</svelte:head>

<article class="container prose">
	<h1>Privacy Policy</h1>
	<p class="muted"><em>Last updated: 2026-05-19</em></p>

	<p>
		Brew Tuner is a coffee dial-in app that stores everything on your device. This page explains what
		we do — and don't — do with your data.
	</p>

	<h2>What we collect</h2>
	<p>
		<strong>Nothing.</strong> Brew Tuner does not collect, transmit, or store any personal data on a
		server. There are no accounts, no analytics, no crash reporting, no advertising SDKs, and no
		third-party trackers in the app.
	</p>

	<h2>What you store</h2>
	<p>
		When you use Brew Tuner, the app saves the following information <strong>locally on your device only</strong>:
	</p>
	<ul>
		<li>Coffee beans you add (roaster, name, origin, varietal, process, roast level, notes)</li>
		<li>Coffee grinders you add (brand, model, settings range)</li>
		<li>Brew methods you add (name, type, default recipe)</li>
		<li>Brews you log (grind setting, dose, yield, time, temperature, rating, tasting notes, flavor tags)</li>
		<li>Your unit preferences (g/oz, °C/°F)</li>
	</ul>
	<p>
		All of this is stored in an SQLite database inside the app's private storage. It is not synced,
		backed up to our servers, or shared with anyone. The app developer has no access to it.
	</p>

	<h2>Backup files</h2>
	<p>
		The app includes a <strong>Backup &amp; restore</strong> feature in Settings. When you choose to
		export, the app creates a JSON file containing your data and hands it to the operating system's
		share sheet — you decide where it goes (iCloud Drive, Google Drive, email, AirDrop, etc.).
	</p>
	<p>
		Once a backup file leaves the app, it is governed by the privacy practices of wherever you chose
		to store it (Apple's iCloud, Google's Drive, etc.). Brew Tuner does not see or receive copies of
		these files.
	</p>
	<p>You can import a backup file the same way — pick a file from the OS file picker. The app reads it locally; no upload occurs.</p>

	<h2>Network usage</h2>
	<p>
		Brew Tuner does not make network requests. The app functions fully offline. If you grant the app
		any system permissions (e.g. files / photo library access in a future version), those grants are
		managed by your operating system, not by us.
	</p>

	<h2>Children's privacy</h2>
	<p>
		Brew Tuner is rated 4+ on the App Store. We do not knowingly collect data from anyone, including
		children, because we do not collect any data.
	</p>

	<h2>Changes to this policy</h2>
	<p>
		If this policy ever changes, the "Last updated" date at the top of this page will be updated and
		the new version will be available at the same URL. Substantive changes that affect what data is
		collected or how it's used will be noted in the app's release notes.
	</p>

	<h2>Contact</h2>
	<p>
		For privacy questions, email <a href="mailto:mail@tonyschmidt.io">mail@tonyschmidt.io</a>.
	</p>

	<hr />

	<p class="muted"><a href="/">← Back to home</a> · <a href="/support">Support</a></p>
</article>
