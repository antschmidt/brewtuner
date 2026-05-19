<svelte:head>
	<title>Changelog — Brew Tuner</title>
	<meta name="description" content="Release notes for Brew Tuner. Each version's changes, listed newest first." />
</svelte:head>

<article class="container prose">
	<h1>Changelog</h1>
	<p class="muted">Release notes for Brew Tuner, newest first.</p>

	<section class="release">
		<h2>v1.0.0 — <span class="muted">coming soon</span></h2>
		<p class="muted release-date">Initial release · TBD 2026</p>
		<p>The first public release of Brew Tuner. Core dial-in loop, no accounts, no servers.</p>
		<ul>
			<li>Add and edit beans (roaster, name, origin, varietal, process, roast level, notes).</li>
			<li>Add and edit grinders with custom step sizes, ranges, and optional negative settings.</li>
			<li>Add and edit brew methods (V60, Chemex, AeroPress, espresso, French press, Moka, Turkish, cold brew, custom).</li>
			<li>Log brews with grind setting, dose, yield, time, temperature, 1–10 rating, tasting notes, and flavor tags.</li>
			<li><strong>Adjust &amp; re-brew</strong> to duplicate any past brew with one change.</li>
			<li>Per-bean dial-in view grouping attempts by (grinder, brew method).</li>
			<li>Independent unit preferences (g/oz, °C/°F).</li>
			<li>Full offline operation — no network required.</li>
			<li>Backup &amp; restore via JSON export to the OS share sheet.</li>
		</ul>
	</section>

	<hr />

	<p class="muted"><a href="/">← Back to home</a></p>
</article>

<style>
	.release {
		margin-bottom: 2.5rem;
	}

	.release h2 {
		margin-bottom: 0.25rem;
	}

	.release-date {
		font-size: 0.9rem;
		margin-top: 0;
		margin-bottom: 1rem;
	}
</style>
