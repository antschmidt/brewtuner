<script lang="ts">
	import type { GrindLog } from '$lib/graphQLClient';
	import Dial from './Dial.svelte';

	export let logs: GrindLog[] = [];
	export let loading: boolean = false;
	export let show: boolean = false;
	export let toggle: () => void;
</script>

<div>
	<button
		class="logs"
		on:click={() => {
			console.log('LogDisplay: toggle clicked');
			toggle();
		}}
	>
		{#if show}
			<img src="/open-log.png" alt="Hide Logs" />
		{:else}
			<img src="/closed-log.png" alt="Show Logs" />
		{/if}
	</button>
	{#if show}
		<div class="log-display">
			<h4>Recent Logs</h4>
			{#if loading}
				<p>Loading logs...</p>
			{:else if logs.length}
				{#each logs as log}
					<div class="log-item">
						<div class="log-field"><span class="log-dial"><Dial value={log.setting}/><strong> {log.setting}</strong></span></div>
                        {#if log.adjustment !== 'good'}
                            <div class="log-field"><strong>Try </strong> {log.adjustment}</div>
                        {:else}
                            <div class="log-field"><strong>Just right {`:)`}</strong></div>
                        {/if}
                        <div class="log-field"><strong>Grams:</strong> {log.grams}</div>
						<div class="log-field"><strong>Notes:</strong> {log.outcome}</div>

						<div class="log-date">{new Date(log.created_at).toLocaleString()}</div>
					</div>
				{/each}
			{:else}
				<p>No logs yet.</p>
			{/if}
		</div>
	{/if}
</div>

<style>
	.logs {
		/* circular toggle with subtle background */
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: #f5f5f5;
		transition: background 0.2s;
		border: none;
		cursor: pointer;
	}
	.logs img {
		width: 20px;
		transition: transform 0.2s;
	}

	.logs:hover {
		background: #e0e0e0;
	}
    .log-dial {
        display: flex;
        margin-right: 0.5rem;
        align-items: center;
        gap: 1rem;
    }

	.log-display {
		margin-top: 1rem;
		padding: 1rem;
		background: #fff;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.log-display h4 {
		margin-top: 0;
		margin-bottom: 1rem;
		color: #333;
		font-size: 1.1rem;
		border-bottom: 1px solid #ddd;
		padding-bottom: 0.5rem;
	}

	.log-item {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		background: #fafafa;
		margin-bottom: 0.75rem;
		padding: 0.75rem;
		border-radius: 6px;
		align-items: center;
	}
	.log-item:last-child {
		margin-bottom: 0;
	}

	.log-field {
		flex: 1 1 120px;
		font-size: 0.9rem;
		color: #555;
	}
	.log-field strong {
		color: #333;
	}
	.log-date {
		flex: 1 1 200px;
		font-size: 0.8rem;
		color: #777;
		text-align: right;
	}
</style>
