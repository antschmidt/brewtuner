<svelte:head>
	<title>Brew Tuner — your brew-by-brew dial-in log</title>
	<meta
		name="description"
		content="Brew Tuner is a coffee dial-in companion for iOS and Android. Track beans, grinders, and brew methods. Log every brew. Chase the sweet spot one variable at a time."
	/>
</svelte:head>

<section class="hero">
	<div class="container hero-inner">
		<p class="eyebrow">For iOS &amp; Android</p>
		<h1>Your brew-by-brew dial-in log.</h1>
		<p class="lede">
			Pick a bean, pick a grinder, pick a brew method, then log every brew with grind setting, dose,
			yield, time, and rating. Tap <strong>Adjust &amp; re-brew</strong> to chase the sweet spot one
			variable at a time.
		</p>

		<div class="badges">
			<a
				class="store-badge"
				href="https://apps.apple.com/app/idXXXXXXXXXX"
				aria-label="Download on the App Store"
			>
				<span class="store-eyebrow">Download on the</span>
				<span class="store-name">App Store</span>
			</a>
			<a
				class="store-badge"
				href="https://play.google.com/store/apps/details?id=io.tonyschmidt.brewtuner"
				aria-label="Get it on Google Play"
			>
				<span class="store-eyebrow">Get it on</span>
				<span class="store-name">Google Play</span>
			</a>
		</div>
		<p class="muted coming-soon">Coming soon on both platforms.</p>
	</div>
</section>

<section class="container section">
	<h2>What it does</h2>
	<div class="features">
		<div class="feature">
			<h3>Track beans</h3>
			<p>Roaster, name, origin, varietal, process, roast level, notes.</p>
		</div>
		<div class="feature">
			<h3>Track grinders</h3>
			<p>
				Any dial pattern works: integer steps, fractional, stepless, even negative settings
				(1Zpresso-style).
			</p>
		</div>
		<div class="feature">
			<h3>Track brew methods</h3>
			<p>V60, Chemex, AeroPress, espresso, French press, Moka, Turkish, cold brew — or whatever you invent.</p>
		</div>
		<div class="feature">
			<h3>Log brews</h3>
			<p>Full recipe, 1–10 rating, tasting notes, flavor tags.</p>
		</div>
		<div class="feature">
			<h3>Adjust &amp; re-brew</h3>
			<p>Duplicate any past brew so you can change one variable and try again.</p>
		</div>
		<div class="feature">
			<h3>Per-bean dial-in view</h3>
			<p>See your attempts grouped by (grinder, brew method) and watch the grind move across tries.</p>
		</div>
		<div class="feature">
			<h3>Independent unit prefs</h3>
			<p>Grams for grounds, ounces for liquid, °C or °F — mix freely.</p>
		</div>
		<div class="feature">
			<h3>Fully offline</h3>
			<p>Every screen works without a network connection.</p>
		</div>
		<div class="feature">
			<h3>No accounts. No ads. No tracking.</h3>
			<p>Your data lives on your device.</p>
		</div>
	</div>
</section>

<section class="container section">
	<div class="callout">
		<h2>Backup, not sync</h2>
		<p>
			Brew Tuner doesn't use the cloud. <strong>Settings → Backup &amp; restore</strong> exports your
			data to a single JSON file you can save anywhere — iCloud Drive, Google Drive, email, AirDrop. Restore
			on a new device by picking the file back up.
		</p>
		<p>
			There's no account to lose, no server to outage, no privacy trade. Just a coffee log that's
			actually yours.
		</p>
	</div>
</section>

<section class="container section screenshots-section">
	<h2>What it looks like</h2>

	<!-- Hero shot: the per-bean dial-in view. The single most distinctive
	     screen in the app — visitors who get this image get the whole pitch. -->
	<figure class="hero-shot">
		<img
			src="/screenshots/dial-in-arc.png"
			alt="Per-bean dial-in view showing 4 brews on a Sweet Bloom Ibonia, grouped by grinder and method, with the best brew (a 10/10 V60 at grind 17) called out at the top."
			loading="lazy"
			width="1242"
			height="2688"
		/>
		<figcaption>
			<strong>The per-bean dial-in view.</strong>
			Every brew you've logged on a bean, grouped by (grinder, brew method), with your best brew surfaced
			at the top. Open it on a returning bean and you're back where you left off.
		</figcaption>
	</figure>

	<!-- Supporting shots: 3 smaller, equal-weight. -->
	<div class="screenshots">
		<figure class="screenshot">
			<img
				src="/screenshots/brew-detail.png"
				alt="Brew detail screen showing grind setting 17, rating 10, recipe (30g dose, 350g yield, 3:00 time, 85°C), with Adjust this brew, Re-brew from this recipe, and Delete brew action buttons."
				loading="lazy"
				width="1242"
				height="2688"
			/>
			<figcaption>
				<strong>Brew detail.</strong> Adjust this brew to fill in what you missed in the moment.
				Re-brew to start a new attempt from this recipe.
			</figcaption>
		</figure>
		<figure class="screenshot">
			<img
				src="/screenshots/home.png"
				alt="Brew Tuner home screen with a Today card, library stats (6 grinders, 8 methods), and a recent brews list."
				loading="lazy"
				width="1242"
				height="2688"
			/>
			<figcaption>
				<strong>Home.</strong> Tap once to log a brew, see your library at a glance, jump back into recent
				attempts.
			</figcaption>
		</figure>
		<figure class="screenshot">
			<img
				src="/screenshots/grinders-library.png"
				alt="Grinders library showing 1Zpresso JX-Pro (-1 to 9 clicks, step 0.1), Baratza Encore (1-40 numbers), Comandante C40 MK4 (0-40 clicks), Niche Zero, and more."
				loading="lazy"
				width="1242"
				height="2688"
			/>
			<figcaption>
				<strong>Any grinder.</strong> Integer steps, fractional, stepless, even negative
				settings. Common models pre-loaded.
			</figcaption>
		</figure>
	</div>
</section>

<section class="container section">
	<div class="cta">
		<h2>Questions or feedback?</h2>
		<p>
			Email <a href="mailto:support@brewtuner.app">support@brewtuner.app</a> — or read the
			<a href="/support">support page</a> for common questions.
		</p>
	</div>
</section>

<style>
	.hero {
		background: linear-gradient(180deg, var(--color-surface-alt) 0%, var(--color-bg) 100%);
		padding: 4rem 0 3rem 0;
		text-align: center;
	}

	.hero-inner {
		max-width: 50rem;
	}

	.eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.12em;
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--color-accent);
		margin-bottom: 0.5rem;
	}

	.lede {
		font-size: 1.15rem;
		color: var(--color-text-secondary);
		max-width: 36rem;
		margin: 1rem auto 2rem auto;
	}

	.badges {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
		margin: 1.5rem 0 0.5rem 0;
	}

	.store-badge {
		display: inline-flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		text-align: left;
		padding: 0.6rem 1.25rem;
		min-width: 11rem;
		background: var(--color-primary);
		color: var(--color-bg);
		border-radius: var(--radius-md);
		text-decoration: none;
		transition: transform var(--transition), background-color var(--transition);
	}

	.store-badge:hover {
		text-decoration: none;
		background: var(--color-accent);
		transform: translateY(-1px);
		color: var(--color-bg);
	}

	.store-eyebrow {
		font-size: 0.7rem;
		opacity: 0.85;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.store-name {
		font-family: var(--font-serif);
		font-weight: 600;
		font-size: 1.15rem;
	}

	.coming-soon {
		margin-top: 1rem;
	}

	.section {
		padding: 1.5rem 0;
	}

	.features {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
		gap: 1rem;
		margin-top: 1rem;
	}

	.feature {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: 1.25rem;
	}

	.feature h3 {
		margin-top: 0;
		font-size: 1.05rem;
		color: var(--color-accent);
	}

	.feature p {
		margin: 0;
		color: var(--color-text-secondary);
		font-size: 0.95rem;
	}

	.callout {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: 2rem;
		max-width: 42rem;
		margin: 0 auto;
		box-shadow: var(--shadow-sm);
	}

	.callout h2 {
		margin-top: 0;
		color: var(--color-accent);
	}

	.screenshots-section h2 {
		text-align: center;
		margin-bottom: 2rem;
	}

	.hero-shot {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		margin: 0 0 3rem 0;
	}

	.hero-shot img {
		width: auto;
		max-width: min(20rem, 100%);
		height: auto;
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-md);
		display: block;
	}

	.hero-shot figcaption {
		max-width: 32rem;
		text-align: center;
		font-size: 0.95rem;
		color: var(--color-text-secondary);
		line-height: 1.55;
	}

	.screenshots {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
		gap: 2rem 1.5rem;
		margin-top: 1rem;
	}

	.screenshot {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		margin: 0;
	}

	.screenshot img {
		width: auto;
		max-width: 100%;
		max-height: 26rem;
		height: auto;
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-sm);
		display: block;
	}

	.screenshot figcaption {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		text-align: center;
		line-height: 1.5;
	}

	.screenshots-note {
		text-align: center;
		margin-top: 1rem;
	}

	.cta {
		text-align: center;
		padding: 2rem 1rem;
	}

	.cta h2 {
		margin-top: 0;
	}
</style>
