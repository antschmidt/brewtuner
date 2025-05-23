<script lang="ts">
	import { scale } from 'svelte/transition';
	import type { Writable } from 'svelte/store';

	/**
	 * A wrapper that toggles between an expanded selector and a summary view.
	 * Default and summary content are provided via slots.
	 */
	export let show: Writable<boolean>;
	export let expandTransition = scale;
	export let expandParams = { duration: 200 };
</script>

{#if $show}
	<div in:expandTransition={expandParams}>
		<slot />
	</div>
{:else}
	<div class="selected-item-display" in:expandTransition={expandParams}>
		<slot name="summary" />
	</div>
{/if}

<style>
	.selected-item-display {
		display: flex;
		justify-content: space-around;
        width: 100%;
        align-items: center;;
		background: transparent;
		align-items: center;
		gap: 0.5rem;
	}
    .selected-item-display:hover {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
    }
</style>
