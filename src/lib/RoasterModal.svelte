<script lang="ts">
	export let show = false;
	export let onSave: (data: {
		name: string;
		address: { street: string; city: string; usstate: string; zip: string } | null;
		website: string | null;
		phone: string | null;
	}) => void = () => {};
	export let onCancel: () => void = () => {};

	let name = '';
	let street = '';
	let city = '';
	let usstate = '';
	let zip = '';
	let website = '';
	let phone = '';

	function save() {
		const address = street || city || usstate || zip ? { street, city, usstate, zip } : null;
		onSave({ name, address, website: website || null, phone: phone || null });
	}

	function cancel() {
		onCancel();
	}
</script>

{#if show}
	<div
		class="modal-card"
		on:click|stopPropagation
		role="dialog"
		aria-modal="true"
		on:click={cancel}
		tabindex="0"
		on:keydown={(e) => e.key === 'Enter' && cancel()}
	>
			<h3>New Roaster</h3>
			<div class="field">
				<label for="roaster-name">Name</label>
				<input id="roaster-name" type="text" bind:value={name} />
			</div>
			<fieldset>
				<legend>Address (optional)</legend>
				<div class="field"><input placeholder="Street" bind:value={street} /></div>
				<div class="field"><input placeholder="City" bind:value={city} /></div>
				<div class="field"><input placeholder="State" bind:value={usstate} /></div>
				<div class="field"><input placeholder="ZIP" bind:value={zip} /></div>
			</fieldset>
			<div class="field">
				<label for="roaster-website">Website</label><input
					id="roaster-website"
					type="url"
					bind:value={website}
				/>
			</div>
			<div class="field">
				<label for="roaster-phone">Phone</label><input
					id="roaster-phone"
					type="tel"
					bind:value={phone}
				/>
			</div>
			<div class="actions">
				<button on:click={save} disabled={!name.trim()}>Save</button>
				<button on:click={cancel}>Cancel</button>
			</div>
	</div>
{/if}

<style>
	.modal-card {
		background: var(--color-surface);
		padding: 1.5rem;
		border-radius: var(--border-radius-md);
		width: 100%;
		max-width: 400px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
	}
	.field {
		margin: 0.5rem 0;
	}
	.actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
		margin-top: 1rem;
	}
	.actions button {
		padding: 0.5rem 1rem;
	}
</style>
