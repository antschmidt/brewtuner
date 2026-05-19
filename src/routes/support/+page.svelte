<svelte:head>
	<title>Support — Brew Tuner</title>
	<meta name="description" content="Help and FAQ for Brew Tuner. Common questions, troubleshooting, and how to contact the developer." />
</svelte:head>

<article class="container prose">
	<h1>Support</h1>
	<p class="muted">
		Brew Tuner is a coffee dial-in app for tracking beans, grinders, brew methods, and the brews you
		make with them. This page covers common questions and how to get help.
	</p>

	<h2>Getting started</h2>
	<p>
		After installing the app, you'll see a coffee bean icon and a <strong>Log a brew</strong> button
		on the Home tab. Before logging your first brew, take a moment to:
	</p>
	<ol>
		<li>Open the <strong>Library</strong> tab and tap <strong>Beans → +</strong> to add the coffee you're currently brewing.</li>
		<li>Verify your <strong>Grinder</strong> is in the library — a handful of common grinders are seeded by default; add yours if it isn't there.</li>
		<li>Pick a <strong>Brew method</strong> that matches what you're brewing today.</li>
	</ol>
	<p>
		Then tap <strong>Log a brew</strong> on Home, fill in the form, and save. You'll land on the brew
		detail page with an <strong>Adjust &amp; re-brew</strong> button — tap it when you want to try the
		same brew with a small tweak.
	</p>

	<h2>Common questions</h2>

	<h3>Where does my data live?</h3>
	<p>
		On your device. Brew Tuner stores everything in a private SQLite database. Nothing is uploaded to
		any server.
	</p>

	<h3>How do I move my data to a new phone?</h3>
	<p>
		<strong>Settings → Backup &amp; restore → Export backup.</strong> Save the file somewhere
		(iCloud Drive, Google Drive, AirDrop to your new device). On the new device, install Brew Tuner,
		then <strong>Settings → Backup &amp; restore → Choose backup file → Restore</strong>.
	</p>

	<h3>My grinder has fractional or negative settings (like 1Zpresso). Does that work?</h3>
	<p>
		Yes. When adding a grinder, set the step size to whatever matches your dial (0.1 for fine
		adjustments, 0 for stepless) and enable "Allows negative settings" if applicable.
	</p>

	<h3>Can I measure in ounces and Fahrenheit?</h3>
	<p>
		Yes. <strong>Settings → Units</strong> lets you independently choose grams or ounces for dose and
		yield, and °C or °F for temperature. You can mix freely — e.g. grams for grounds, ounces for liquid
		output, °F for water temperature.
	</p>

	<h3>How do I see all my brews on one specific bean?</h3>
	<p>
		Open any brew on that bean, tap the bean row at the top of the detail screen, and you'll see a
		per-bean dial-in view with brews grouped by (grinder, brew method) and a best-brew callout.
	</p>

	<h3>Why is there no sync to iCloud / a cloud backup?</h3>
	<p>
		By design — keeping the app account-free and server-free means there's nothing for an outage or
		company change to break. The <strong>Backup &amp; restore</strong> feature gives you the same
		end-state with full control over where your data goes.
	</p>

	<h3>The app crashes / behaves unexpectedly.</h3>
	<p>
		Try fully closing the app and reopening it. If the issue persists, email me with what you were
		doing when it happened (steps to reproduce help a lot).
	</p>

	<h2>Contact</h2>
	<p>
		Email <a href="mailto:mail@tonyschmidt.io">mail@tonyschmidt.io</a>. Replies typically within a few
		days. Bug reports, feature requests, and "I love this app" notes are all welcome.
	</p>

	<hr />

	<p class="muted"><a href="/">← Back to home</a> · <a href="/privacy">Privacy policy</a></p>
</article>
