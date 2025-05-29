<script lang="ts">
    import type { GrindLog } from '$lib/graphQLClient';
    import { updateGrinderLog } from '$lib/graphQLClient'; // Import the new function
    import Dial from './Dial.svelte';
    import { createEventDispatcher } from 'svelte';

    export let logs: GrindLog[] = [];
    export let loading: boolean = false;
    export let show: boolean = false;
    export let toggle: () => void;

    const dispatch = createEventDispatcher();

    let editingLogId: string | null = null;
    let currentEditValues: Partial<GrindLog> = {};

    function startEdit(log: GrindLog) {
        editingLogId = log.id;
        currentEditValues = { ...log }; // Create a copy to edit
    }

    function cancelEdit() {
        editingLogId = null;
        currentEditValues = {};
    }

    async function saveEdit(logId: string) {
        if (!editingLogId || !currentEditValues) return;
        try {
            // Construct the updates object, ensuring types are correct
            const updates = {
                setting: currentEditValues.setting !== undefined ? Number(currentEditValues.setting) : undefined,
                outcome: currentEditValues.outcome,
                adjustment: currentEditValues.adjustment as 'coarser' | 'finer' | 'good' | undefined,
                tamped: currentEditValues.tamped,
                grams: currentEditValues.grams !== undefined ? Number(currentEditValues.grams) : undefined,
            };
            
            // Filter out undefined values explicitly before sending
            Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

            const updatedLog = await updateGrinderLog(logId, updates);
            dispatch('logupdated', updatedLog); // Notify parent to update the logs array
            cancelEdit();
        } catch (error) {
            console.error('Failed to save log:', error);
            // Handle error (e.g., show a message to the user)
        }
    }
</script>

<div>
    <button
        class="logs-toggle-button"
        on:click={() => {
            console.log('LogDisplay: toggle clicked');
            toggle();
        }}
        aria-expanded={show}
        aria-controls="log-display-content"
    >
        {#if show}
            <img src="/open-log.png" alt="Hide Logs" />
        {:else}
            <img src="/closed-log.png" alt="Show Logs" />
        {/if}
    </button>
    {#if show}
        <div class="log-display" id="log-display-content">
            <h4>Recent Logs</h4>
            {#if loading}
                <p>Loading logs...</p>
            {:else if logs.length}
                {#each logs as log (log.id)}
                    <div class="log-item">
                        {#if editingLogId === log.id}
                            <!-- Edit Form -->
                            <div class="log-field edit-field">
                                <label for="edit-setting-{log.id}">Setting:</label>
                                <input id="edit-setting-{log.id}" type="number" step="0.1" bind:value={currentEditValues.setting} />
                            </div>
                            <div class="log-field edit-field">
                                <label for="edit-adjustment-{log.id}">Adjustment:</label>
                                <select id="edit-adjustment-{log.id}" bind:value={currentEditValues.adjustment}>
                                    <option value="coarser">Coarser</option>
                                    <option value="good">Good</option>
                                    <option value="finer">Finer</option>
                                </select>
                            </div>
                            <div class="log-field edit-field">
                                <label for="edit-grams-{log.id}">Grams:</label>
                                <input id="edit-grams-{log.id}" type="number" step="0.1" bind:value={currentEditValues.grams} />g
                            </div>
                            <div class="log-field edit-field tamped-edit">
                                <label for="edit-tamped-{log.id}">Tamped:</label>
                                <input id="edit-tamped-{log.id}" type="checkbox" bind:checked={currentEditValues.tamped} />
                            </div>
                            <div class="log-field edit-field outcome-edit">
                                <label for="edit-outcome-{log.id}">Notes:</label>
                                <textarea id="edit-outcome-{log.id}" bind:value={currentEditValues.outcome} rows="3"></textarea>
                            </div>
                            <div class="log-actions">
                                <button class="save-button" on:click={() => saveEdit(log.id)}>Save</button>
                                <button class="cancel-button" on:click={cancelEdit}>Cancel</button>
                            </div>
                        {:else}
                            <!-- Display Mode -->
                            <div class="log-field"><Dial value={log.setting}/><strong> {log.setting}</strong></div>
                            {#if log.adjustment !== 'good'}
                                <div class="log-field"><strong>Try </strong> {log.adjustment}</div>
                            {:else}
                                <div class="log-field"><img alt="adjustment" height="42px" src="blind-justice.png" /><strong>Just right {`:)`}</strong></div>
                            {/if}
                            <div class="log-field"><img alt="grams" height="42px" src="/coffee-scale.png" /> {log.grams}g</div>
                            {#if log.tamped}
                                <div class="log-field"><img alt="tamped" height="42px" src="/tamper-transparent.png" /></div>
                            {/if}
                            <div class="log-field notes-display">{log.outcome}</div>
                            <div class="log-date">{new Date(log.created_at).toLocaleString()}</div>
                            <button class="edit-button" on:click={() => startEdit(log)}>Edit</button>
                        {/if}
                    </div>
                {/each}
            {:else}
                <p>No logs yet.</p>
            {/if}
        </div>
    {/if}
</div>

<style>
    .logs-toggle-button { /* Renamed from .logs to be more specific */
        display: inline-flex;
        align-items: center;
        justify-content: center; /* Centered icon */
        width: 36px;
        height: 36px;
        border-radius: 50%;
        transition: background 0.2s;
        border: none;
        cursor: pointer;
        background-color: transparent; /* Ensure it's clickable */
        padding: 0;
    }
    .logs-toggle-button img {
        width: 20px;
        height: 20px; /* Ensure consistent icon size */
        transition: transform 0.2s;
    }

    .logs-toggle-button:hover {
        background: #e0e0e03a; /* Subtle hover */
    }
    .log-item .log-field {
        display: flex;
        margin-right: 0.5rem;
        align-items: center;
        gap: 0.8rem;
    }

    .log-display {
        margin-top: 1rem;
        padding: 1rem;
        background: #ffffff15;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .log-display h4 {
        margin-top: 0;
        margin-bottom: 1rem;
        /* color: #333; */ /* Already white from global */
        font-size: 1.1rem;
        border-bottom: 1px solid #ddd3;
        padding-bottom: 0.5rem;
    }

    .log-item {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        background: #fafafa3d;
        margin-bottom: 0.75rem;
        padding: 0.75rem;
        border-radius: 6px;
        align-items: center;
        position: relative; /* For positioning edit button if needed */
    }
    .log-item:last-child {
        margin-bottom: 0;
    }

    .log-field {
        flex: 1 1 120px; /* Allow wrapping */
        font-size: 0.9rem;
        /* color: #555; */ /* Already white from global */
        justify-content: flex-start; /* Align items to start for better readability */
    }
    .log-field strong {
        /* color: #333; */ /* Already white from global */
    }
    .log-date {
        flex: 1 1 100%; /* Take full width on new line if wrapped */
        font-size: 0.8rem;
        /* color: #777; */ /* Already white from global */
        text-align: right;
        margin-top: 0.5rem; /* Add some space if it wraps */
    }

    .edit-button, .save-button, .cancel-button {
        padding: 0.3rem 0.7rem;
        border: 1px solid #ccc3;
        background-color: #f0f0f02a;
        /* color: #333; */ /* Already white from global */
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.85rem;
        margin-left: auto; /* Pushes button to the right if space allows */
    }
    .edit-button:hover, .save-button:hover, .cancel-button:hover {
        background-color: #e0e0e03a;
    }
    .save-button {
        background-color: #4CAF506b; /* Greenish */
    }
    .cancel-button {
        background-color: #f443366b; /* Reddish */
        margin-left: 0.5rem;
    }
    .log-actions {
        display: flex;
        width: 100%;
        justify-content: flex-end;
        margin-top: 0.5rem;
        gap: 0.5rem;
    }
    .edit-field {
        flex-direction: column; /* Stack label and input */
        align-items: flex-start;
        flex-basis: 45%; /* Adjust basis for two items per row */
        min-width: 150px;
    }
    .edit-field.outcome-edit {
        flex-basis: 100%; /* Full width for textarea */
    }
    .edit-field label {
        font-size: 0.8rem;
        margin-bottom: 0.2rem;
    }
    .edit-field input[type="number"],
    .edit-field select,
    .edit-field textarea {
        width: 100%;
        padding: 0.4rem;
        border: 1px solid #ccc3;
        border-radius: 4px;
        background-color: #fff2;
        /* color: #333; */ /* Already white from global */
        font-size: 0.9rem;
    }
    .edit-field input[type="checkbox"] {
       width: auto;
       margin-top: 0.25rem;
    }
    .tamped-edit {
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
    }
    .notes-display {
        word-break: break-word; /* Ensure long notes wrap */
    }
</style>
