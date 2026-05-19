<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';

	const nav = [
		{ href: '/', label: 'Home' },
		{ href: '/support', label: 'Support' },
		{ href: '/privacy', label: 'Privacy' },
		{ href: '/changelog', label: 'Changelog' }
	];

	$: pathname = $page.url.pathname;
	function isActive(href: string) {
		if (href === '/') return pathname === '/';
		return pathname === href || pathname.startsWith(href + '/');
	}
</script>

<header class="site-header">
	<div class="container header-inner">
		<a class="brand" href="/" aria-label="Brew Tuner home">
			<span class="brand-mark" aria-hidden="true">☕</span>
			<span class="brand-name">Brew Tuner</span>
		</a>
		<nav aria-label="Primary">
			{#each nav as item}
				<a href={item.href} class:active={isActive(item.href)}>{item.label}</a>
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
			Made by <a href="https://tonyschmidt.io">Tony Schmidt</a>. Contact: <a href="mailto:mail@tonyschmidt.io">mail@tonyschmidt.io</a>.
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
		flex-wrap: wrap;
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
	}

	.brand:hover {
		text-decoration: none;
		color: var(--color-accent);
	}

	.brand-mark {
		font-size: 1.25rem;
	}

	nav {
		display: flex;
		gap: 0.25rem;
		flex-wrap: wrap;
	}

	nav a {
		padding: 0.4rem 0.75rem;
		border-radius: var(--radius-sm);
		font-size: 0.95rem;
		color: var(--color-text-secondary);
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
		padding: 2rem 0 4rem 0;
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
		.header-inner {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}
		nav {
			width: 100%;
		}
		nav a {
			padding: 0.4rem 0.6rem;
		}
	}
</style>
