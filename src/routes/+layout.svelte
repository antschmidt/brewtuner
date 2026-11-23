<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';

	const nav = [
		{ href: '/support', label: 'Support' },
		{ href: '/privacy', label: 'Privacy' },
		{ href: '/changelog', label: 'Changelog' }
	];

	const SITE = 'https://brewtuner.app';

	$: pathname = $page.url.pathname;
	$: canonical = SITE + (pathname === '/' ? '/' : pathname);
	function isActive(href: string) {
		if (href === '/') return pathname === '/';
		return pathname === href || pathname.startsWith(href + '/');
	}
</script>

<svelte:head>
	<link rel="canonical" href={canonical} />
	<meta property="og:site_name" content="Brew Tuner" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content="{SITE}/og.png" />
	<meta property="og:image:width" content="1024" />
	<meta property="og:image:height" content="500" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content="{SITE}/og.png" />
</svelte:head>

<header class="site-header">
	<div class="container header-inner">
		<a class="brand" href="/" aria-label="Brew Tuner home">
			<img class="brand-mark" src="/icon.svg" alt="" width="28" height="28" />
			<span class="brand-name">Brew Tuner</span>
		</a>
		<nav aria-label="Primary">
			{#each nav as item}
				<a href={item.href} class:active={isActive(item.href)} class:hide-sm={item.href === '/changelog'}>{item.label}</a>
			{/each}
		</nav>
	</div>
</header>

<main>
	<slot />
</main>

<footer class="site-footer">
	<div class="container footer-inner">
		<p class="muted">
			Brew Tuner — a coffee dial-in app for iOS &amp; Android.<br />
			Made by <a href="https://tonyschmidt.io">Tony Schmidt</a>. Contact: <a href="mailto:support@brewtuner.app">support@brewtuner.app</a>.
		</p>
		<p class="muted footer-links">
			<a href="/support">Support</a> · <a href="/privacy">Privacy</a> ·
			<a href="/changelog">Changelog</a>
		</p>
		<p class="muted">© {new Date().getFullYear()} Tony Schmidt. All rights reserved.</p>
	</div>
</footer>

<style>
	.site-header {
		background: var(--color-surface);
		border-bottom: 1px solid var(--color-border);
		position: sticky;
		top: 0;
		z-index: 10;
		backdrop-filter: saturate(160%) blur(8px);
	}

	.header-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 0.85rem;
		padding-bottom: 0.85rem;
		gap: 1rem;
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--color-text-primary);
		text-decoration: none;
		font-family: var(--font-serif);
		font-weight: 700;
		font-size: 1.15rem;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.brand:hover {
		text-decoration: none;
		color: var(--color-accent);
	}

	.brand-mark {
		width: 1.75rem;
		height: 1.75rem;
		border-radius: 22%;
		display: block;
	}

	nav {
		display: flex;
		gap: 0.25rem;
	}

	nav a {
		padding: 0.4rem 0.75rem;
		border-radius: var(--radius-sm);
		font-size: 0.95rem;
		color: var(--color-text-secondary);
		white-space: nowrap;
		transition: background-color var(--transition), color var(--transition);
	}

	nav a:hover {
		text-decoration: none;
		background-color: var(--color-surface-alt);
		color: var(--color-text-primary);
	}

	nav a.active {
		color: var(--color-accent);
		font-weight: 600;
	}

	main {
		min-height: calc(100vh - 12rem);
		padding: 0 0 4rem 0;
	}

	.site-footer {
		background: var(--color-surface);
		border-top: 1px solid var(--color-border);
		padding: 2rem 0;
		margin-top: 2rem;
	}

	.footer-inner {
		text-align: center;
	}

	.footer-inner p {
		margin: 0.25rem 0;
		font-size: 0.875rem;
	}

	@media (max-width: 480px) {
		.site-header {
			position: static;
		}
		.header-inner {
			gap: 0.5rem;
		}
		.brand {
			font-size: 1.05rem;
		}
		nav {
			gap: 0;
		}
		nav a {
			padding: 0.4rem 0.5rem;
			font-size: 0.9rem;
		}
		nav a.hide-sm {
			display: none;
		}
	}
</style>
