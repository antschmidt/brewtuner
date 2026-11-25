<script lang="ts">
	const APP_STORE = 'https://apps.apple.com/us/app/brew-tuner/id6771189315';
	// The Android app (package app.brewtuner.brewtuner) has no public Google Play
	// listing yet, so a link there opens Google's "Not Found" page. Until it does,
	// the badge says so and is not a link. When the listing is public, set this to
	// 'https://play.google.com/store/apps/details?id=app.brewtuner.brewtuner'.
	const PLAY_STORE: string | null = null;
	const PRICE = '$1.99';
	const title = 'Brew Tuner — your brew-by-brew dial-in log';
	const description =
		'Brew Tuner is a coffee dial-in companion for iPhone and iPad, with Android on the way. Track beans, grinders, and brew methods. Log every brew. Chase the sweet spot one variable at a time.';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
</svelte:head>

{#snippet playBadge()}
	{#if PLAY_STORE}
		<a class="store-badge" href={PLAY_STORE} aria-label="Get it on Google Play">
			<span class="store-eyebrow">Get it on</span>
			<span class="store-name">Google Play</span>
		</a>
	{:else}
		<span class="store-badge store-badge--soon">
			<span class="store-eyebrow">Coming soon to</span>
			<span class="store-name">Google Play</span>
		</span>
	{/if}
{/snippet}

<section class="hero">
	<div class="container hero-inner">
		<div class="hero-copy">
			<p class="eyebrow">
				Brew-by-brew dial-in log · {PLAY_STORE ? 'iOS & Android' : 'iPhone & iPad'}
			</p>
			<h1>Stop guessing your grind.</h1>
			<p class="lede">
				Log every brew — grind setting, dose, yield, time, rating — then change one variable and
				brew again. Brew Tuner keeps the trail, so the next bag starts where the last one landed.
			</p>

			<div class="badges">
				<a class="store-badge" href={APP_STORE} aria-label="Download on the App Store">
					<span class="store-eyebrow">Download on the</span>
					<span class="store-name">App Store</span>
				</a>
				{@render playBadge()}
			</div>
			<p class="hero-note">
				<strong>{PRICE} on the App Store.</strong> Pay once. No accounts. No ads. No tracking. Works
				fully offline.
			</p>
		</div>

		<figure class="phone hero-phone">
			<img
				src="/screenshots/dial-in-arc-640.webp"
				srcset="/screenshots/dial-in-arc-640.webp 640w, /screenshots/dial-in-arc-960.webp 960w"
				sizes="(max-width: 480px) 72vw, 320px"
				alt="Per-bean dial-in view showing 4 brews on a Sweet Bloom Ibonia, grouped by grinder and method, with the best brew (a 10/10 V60 at grind 17) called out at the top."
				width="1242"
				height="2688"
				fetchpriority="high"
			/>
		</figure>
	</div>
</section>

<section class="container pillars">
	<article class="pillar">
		<div class="pillar-copy">
			<p class="eyebrow">The dial-in loop</p>
			<h2>Change one thing. Taste the difference.</h2>
			<p>
				Every brew keeps its full recipe, a 1–10 rating, tasting notes, and flavor tags. Tap
				<strong>Re-brew</strong> to start the next attempt from the same recipe, nudge the grind,
				and see whether it got better.
			</p>
			<ul>
				<li>
					<strong>Per-bean dial-in view</strong> — attempts grouped by (grinder, brew method), best
					brew surfaced at the top.
				</li>
				<li>
					<strong>Adjust later</strong> — fill in what you missed while the kettle was still hot.
				</li>
			</ul>
		</div>
		<figure class="phone">
			<img
				src="/screenshots/brew-detail-640.webp"
				srcset="/screenshots/brew-detail-640.webp 640w, /screenshots/brew-detail-960.webp 960w"
				sizes="(max-width: 480px) 72vw, 288px"
				alt="Brew detail screen showing grind setting 17, rating 10, recipe (30g dose, 350g yield, 3:00 time, 85°C), with Adjust this brew, Re-brew from this recipe, and Delete brew action buttons."
				loading="lazy"
				width="1242"
				height="2688"
			/>
		</figure>
	</article>

	<article class="pillar">
		<div class="pillar-copy">
			<p class="eyebrow">Your gear</p>
			<h2>Works with the grinder you actually own.</h2>
			<p>
				Any dial pattern: integer steps, fractional clicks, stepless, even negative settings
				(1Zpresso-style). Common models come pre-loaded; add your own in a minute.
			</p>
			<ul>
				<li>
					<strong>Any brew method</strong> — V60, Chemex, AeroPress, espresso, French press, Moka,
					Turkish, cold brew, or whatever you invent.
				</li>
				<li>
					<strong>Beans in detail</strong> — roaster, origin, varietal, process, roast level, notes.
				</li>
				<li>
					<strong>Units your way</strong> — grams for grounds, ounces for liquid, °C or °F. Mix
					freely.
				</li>
			</ul>
		</div>
		<figure class="phone">
			<img
				src="/screenshots/grinders-library-640.webp"
				srcset="/screenshots/grinders-library-640.webp 640w, /screenshots/grinders-library-960.webp 960w"
				sizes="(max-width: 480px) 72vw, 288px"
				alt="Grinders library showing 1Zpresso JX-Pro (-1 to 9 clicks, step 0.1), Baratza Encore (1-40 numbers), Comandante C40 MK4 (0-40 clicks), Niche Zero, and more."
				loading="lazy"
				width="1242"
				height="2688"
			/>
		</figure>
	</article>

	<article class="pillar">
		<div class="pillar-copy">
			<p class="eyebrow">Backup, not sync</p>
			<h2>A coffee log that's actually yours.</h2>
			<p>
				Brew Tuner doesn't use the cloud. Your data lives on your device and every screen works
				without a network connection. There's no account to lose, no server to outage, no privacy
				trade.
			</p>
			<p>
				<strong>Settings → Backup &amp; restore</strong> exports everything to a single JSON file
				you can save anywhere — iCloud Drive, Google Drive, email, AirDrop. Restore on a new phone
				by picking the file back up.
			</p>
		</div>
		<figure class="phone">
			<img
				src="/screenshots/backup-strategy-640.webp"
				srcset="/screenshots/backup-strategy-640.webp 640w, /screenshots/backup-strategy-960.webp 960w"
				sizes="(max-width: 480px) 72vw, 288px"
				alt="Backup and restore screen with an Export backup button, a preview of a 24-record backup file, and a choice between Merge and Replace all restore strategies."
				loading="lazy"
				width="1242"
				height="2688"
			/>
		</figure>
	</article>
</section>

<section class="container">
	<div class="cta">
		<h2>Dial in your next bag.</h2>
		<div class="badges">
			<a class="store-badge" href={APP_STORE} aria-label="Download on the App Store">
				<span class="store-eyebrow">Download on the</span>
				<span class="store-name">App Store</span>
			</a>
			{@render playBadge()}
		</div>
		<p class="cta-price">{PRICE} on the App Store. Pay once.</p>
		<p class="muted">
			Questions or feedback? Email <a href="mailto:support@brewtuner.app">support@brewtuner.app</a>
			or read the <a href="/support">support page</a>.
		</p>
	</div>
</section>

<style>
	.hero {
		background: linear-gradient(180deg, var(--color-surface-alt) 0%, var(--color-bg) 100%);
		padding: 4rem 0 3rem 0;
	}

	.hero-inner {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 3rem;
	}

	.hero-copy {
		max-width: 34rem;
	}

	.eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.12em;
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--color-accent);
		margin-bottom: 0.5rem;
	}

	.hero h1 {
		font-size: clamp(2.25rem, 6vw, 3.5rem);
		margin-bottom: 0;
	}

	.lede {
		font-size: 1.15rem;
		color: var(--color-text-secondary);
		margin: 1rem 0 0 0;
	}

	.badges {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		margin: 2rem 0 0 0;
	}

	.hero-note {
		margin: 1rem 0 0 0;
		font-size: 0.9rem;
		color: var(--color-text-secondary);
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
		transition:
			transform var(--transition),
			background-color var(--transition);
	}

	.store-badge:hover {
		text-decoration: none;
		background: var(--color-accent);
		transform: translateY(-1px);
		color: var(--color-bg);
	}

	/* Not out yet: reads as a badge, but plainly is not a button. */
	.store-badge--soon {
		background: transparent;
		color: var(--color-text-secondary);
		border: 1px dashed var(--color-border);
		cursor: default;
	}

	.store-badge--soon:hover {
		background: transparent;
		color: var(--color-text-secondary);
		transform: none;
	}

	.hero-note strong {
		color: var(--color-text-primary);
	}

	.cta-price {
		margin: 0 0 1rem 0;
		font-weight: 600;
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

	/* Screenshot in a simple device bezel. */
	.phone {
		margin: 0;
		width: 18rem;
		max-width: 100%;
		padding: 0.4rem;
		background: #14100e;
		border-radius: 2.1rem;
		box-shadow: var(--shadow-md);
		justify-self: center;
	}

	.phone img {
		display: block;
		width: 100%;
		height: auto;
		border-radius: 1.75rem;
	}

	.hero-phone {
		width: 20rem;
	}

	.pillars {
		padding-top: 1rem;
	}

	.pillar {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 3rem 4rem;
		padding: 3.5rem 0;
	}

	.pillar + .pillar {
		border-top: 1px solid var(--color-border);
	}

	.pillar:nth-child(even) .phone {
		order: -1;
	}

	.pillar-copy {
		max-width: 32rem;
	}

	.pillar:nth-child(even) .pillar-copy {
		justify-self: end;
	}

	.pillar h2 {
		margin-top: 0;
	}

	.pillar p,
	.pillar li {
		color: var(--color-text-secondary);
	}

	.pillar ul {
		list-style: none;
		padding: 0;
		margin: 1.25rem 0 0 0;
	}

	.pillar li {
		padding: 0.75rem 0;
		margin: 0;
		border-top: 1px solid var(--color-border);
		font-size: 0.95rem;
	}

	.cta {
		text-align: center;
		padding: 3rem 0 1rem 0;
		border-top: 1px solid var(--color-border);
	}

	.cta h2 {
		margin-top: 0;
	}

	.cta .badges {
		justify-content: center;
		margin: 1.5rem 0;
	}

	@media (max-width: 760px) {
		.hero {
			padding: 2.5rem 0 2rem 0;
		}

		.hero-inner,
		.pillar {
			grid-template-columns: minmax(0, 1fr);
			gap: 2rem;
		}

		.hero-copy,
		.pillar-copy {
			max-width: none;
		}

		.pillar {
			padding: 2.5rem 0;
		}

		.pillar:nth-child(even) .phone {
			order: 0;
		}

		.pillar:nth-child(even) .pillar-copy {
			justify-self: stretch;
		}

		.phone,
		.hero-phone {
			width: min(17rem, 78vw);
		}
	}
</style>
