<script lang="ts">
	import { scale } from 'svelte/transition';
	import type { Writable } from 'svelte/store';

	let { show, expandTransition = scale, expandParams = { duration: 200 } } = $props();
</script>

<details class="selector" bind:open={$show}>
	<summary class="summary-button">
		<slot name="summary" />
	</summary>
	<div in:expandTransition={expandParams} class="expanded">
		<slot />
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
