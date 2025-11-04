<script lang="ts">
	import { scale } from 'svelte/transition';
	import type { Writable } from 'svelte/store';
	import type { Snippet } from 'svelte';

	let { show, expandTransition = scale, expandParams = { duration: 200 }, summary, children } = $props<{
		show: Writable<boolean>;
		expandTransition?: any;
		expandParams?: any;
		summary: Snippet;
		children: Snippet;
	}>();
</script>

<details class="selector" bind:open={$show}>
	<summary class="summary-button">
		{@render summary()}
	</summary>
	<div in:expandTransition={expandParams} class="expanded">
		{@render children()}
	</div>
</details>

<style>
	.selector {
		width: 100%;
		margin: 0;
		padding: 0;
	}
	summary {
		list-style: none;
		cursor: pointer;
		padding: 0;
	}
	summary::-webkit-details-marker {
		display: none;
	}
	.expanded {
		margin-top: 0.5rem;
	}
	/* reuse existing summary-button style */
	.summary-button {
		display: flex;
		width: 100%;
		background: transparent;
		border: none;
		align-items: center;
		justify-content: space-around;
		gap: 0.5rem;
		cursor: pointer;
	}
</style>
