<script lang="ts">
	import { onMount } from 'svelte';
	import { writable, derived, get } from 'svelte/store';
	import {
		getRoasters,
		getBeans,
		addBean,
		getGrinders,
		getBrewMethods,
		upsertProfile,
		logGrind,
		addGrinder,
		addBrewMethod,
		getProfile,
		getGrindLogs,
		addRoaster
	} from '$lib/graphQLClient';
	import type { GrindLog } from '$lib/graphQLClient';
	import LogDisplay from '$lib/LogDisplay.svelte';

	interface Roaster {
		id: string;
		name: string;
	}
	interface Bean {
		id: string;
		name: string;
	}
	interface Grinder {
		id: string;
		name: string;
	}
	interface BrewMethod {
		id: string;
		name: string;
	}
	// Removed unused Profile interface since we use server types directly

	const roasters = writable<Roaster[]>([]);
	let lastProfile: { setting: number; grams: number; tamped: boolean } | null = null;
	const selectedRoaster = writable<string>('');
	const beans = writable<Bean[]>([]);
	const beanSearch = writable<string>('');
	const loading = writable(false);
	const selectedBeanId = writable<string>('');
	const showBeanSelector = writable(true);
	const showGrinderSelector = writable(true);
	const showMethodSelector = writable(true);
	const grinders = writable<Grinder[]>([]);
	const brewMethods = writable<BrewMethod[]>([]);
	const selectedGrinder = writable<string>('');
	const selectedMethod = writable<string>('');
	let newGrinder = '';
	let newMethod = '';
	let setting = 0;
	let outcomeText = '';
	let adjustment: 'coarser' | 'good' | 'finer' = 'good';
	let grams = 0;
	let tamped = false;
	let currentProfile: { id: string; profile_setting: number; grams: number; tamped: boolean } | null = null;
	let loadingProfile = false;
	let logs: GrindLog[] = [];
	let showLogs = false;
	let loadingLogs = false;
	const showRoasterSelector = writable(false);
	let newRoaster = '';

	onMount(async () => {
		const fetchedRoasters = await getRoasters();
		roasters.set(fetchedRoasters);

		// fetch grinders & methods
		grinders.set(await getGrinders());
		brewMethods.set(await getBrewMethods());

		// restore last selections if present
		const saved = localStorage.getItem('lastSelection');
		if (saved) {
			try {
				const {
					roaster,
					bean,
					grinder,
					method,
					setting: savedSetting,
					grams: savedGrams
				} = JSON.parse(saved);
				if (roaster) {
					// set roaster and its beans
					selectedRoaster.set(roaster);
					const beansList = await getBeans(roaster);
					beans.set(beansList);
					showBeanSelector.set(false);
					selectedBeanId.set(bean);
				}
				if (grinder) selectedGrinder.set(grinder);
				if (method) selectedMethod.set(method);
				// restore last numeric inputs
				if (savedSetting != null) setting = savedSetting;
				if (savedGrams != null) grams = savedGrams;
			} catch (e) {
				console.warn('Failed to restore last selections', e);
			}
		}
	});

	selectedRoaster.subscribe(async (id) => {
		// clear any previous bean selection and search when roaster changes
		selectedBeanId.set('');
		beanSearch.set('');
		showBeanSelector.set(true);

		if (!id) return beans.set([]);
		loading.set(true);
		beans.set(await getBeans(id));
		loading.set(false);
	});

	const filteredBeans = derived([beans, beanSearch], ([$beans, $search]) =>
		$search ? $beans.filter((b) => b.name.toLowerCase().includes($search.toLowerCase())) : $beans
	);

	const selectedBean = derived([beans, selectedBeanId], (values) => {
		const [$beans, $id] = values;
		return $beans.find((b) => b.id === $id) || null;
	});

	async function addNewBean() {
		const $selectedRoaster = get(selectedRoaster);
		const $beanSearch = get(beanSearch);
		if (!$selectedRoaster || !$beanSearch.trim()) return;
		const newBean = await addBean($selectedRoaster, $beanSearch.trim());
		beans.update((bs) => [newBean, ...bs]);
		beanSearch.set('');
		selectedBeanId.set(newBean.id);
		showBeanSelector.set(false);
	}

	async function submitLog() {
		const beanId = get(selectedBeanId);
		// ensure profile exists or is updated with setting
		const profile = await upsertProfile(
			beanId,
			get(selectedGrinder),
			get(selectedMethod),
			setting,
			grams,
			tamped
		);
        console.log('submitLog:', profile);
		// store last profile for display
		lastProfile = { setting: profile.profile_setting, grams: profile.grams, tamped: profile.tamped };
		await logGrind(profile.id, setting, outcomeText, adjustment, tamped, grams);
		// save last selections for next session
		localStorage.setItem(
			'lastSelection',
			JSON.stringify({
				roaster: get(selectedRoaster),
				bean: get(selectedBeanId),
				grinder: get(selectedGrinder),
				method: get(selectedMethod),
				setting,
				grams
			})
		);
		// reset form
		setting = 0;
		outcomeText = '';
		adjustment = 'good';
		grams = 0;
		tamped = false;
	}

	async function createGrinder() {
		const g = await addGrinder(newGrinder.trim());
		grinders.update((list) => [...list, g]);
		selectedGrinder.set(g.id);
	}

	async function createMethod() {
		const m = await addBrewMethod(newMethod.trim());
		brewMethods.update((list) => [...list, m]);
		selectedMethod.set(m.id);
	}

	async function createRoaster() {
		const r = await addRoaster(newRoaster.trim());
		roasters.update((list) => [...list, r]);
		selectedRoaster.set(r.id);
		newRoaster = '';
	}

	// toggle grinder selector when selectedGrinder changes
	selectedGrinder.subscribe((id) => {
		showGrinderSelector.set(!id);
		if (!id) newGrinder = '';
	});
	// toggle method selector when selectedMethod changes
	selectedMethod.subscribe((id) => {
		showMethodSelector.set(!id);
		if (!id) newMethod = '';
	});

	// derive the selected grinder object
	const selectedGrinderObj = derived(
		[grinders, selectedGrinder],
		([$grinders, $id]) => $grinders.find((g) => g.id === $id) || null
	);
	// derive the selected method object
	const selectedMethodObj = derived(
		[brewMethods, selectedMethod],
		([$methods, $id]) => $methods.find((m) => m.id === $id) || null
	);

	// load existing profile when bean, grinder, and method are all selected
	let lastCombo = { bean: '', grinder: '', method: '' };
	async function loadProfile() {
		loadingProfile = true;
		const beanId = get(selectedBeanId);
		const grinderId = get(selectedGrinder);
		const methodId = get(selectedMethod);
		console.log('loadProfile:', beanId, grinderId, methodId);
		const profile = await getProfile(beanId, grinderId, methodId);
		currentProfile = profile;
		if (currentProfile?.id) {
			logs = await getGrindLogs(currentProfile.id);
			if (logs.length) {
				const last = logs[0];
				setting = currentProfile.profile_setting;
				grams = currentProfile.grams;
				tamped = currentProfile.tamped;
				outcomeText = last.outcome;
				adjustment = last.adjustment as typeof adjustment;
			} else {
				// no logs: reset to defaults
				setting = 0;
				grams = 0;
				tamped = false;
				outcomeText = '';
				adjustment = 'good';
			}
		} else {
			// no existing profile: clear logs and reset inputs
			logs = [];
			setting = 0;
			grams = 0;
			tamped = false;
			outcomeText = '';
			adjustment = 'good';
		}
		loadingProfile = false;
	}

	/** Toggle display of grind logs and fetch if needed */
	async function toggleLogs() {
		showLogs = !showLogs;
		if (showLogs && currentProfile?.id && logs.length === 0) {
			loadingLogs = true;
			logs = await getGrindLogs(currentProfile.id);
			loadingLogs = false;
		}
	}

	// subscribe to selection changes to load profile
	function checkAndLoad() {
		const beanId = get(selectedBeanId);
		const grinderId = get(selectedGrinder);
		const methodId = get(selectedMethod);
		if (beanId && grinderId && methodId) {
			if (
				beanId !== lastCombo.bean ||
				grinderId !== lastCombo.grinder ||
				methodId !== lastCombo.method
			) {
				lastCombo = { bean: beanId, grinder: grinderId, method: methodId };
				lastProfile = null;  // clear previous profile summary
				loadProfile();
			}
		} else {
			currentProfile = null;
			lastProfile = null; // clear if incomplete
		}
	}
	selectedBeanId.subscribe(checkAndLoad);
	selectedGrinder.subscribe(checkAndLoad);
	selectedMethod.subscribe(checkAndLoad);
</script>

<div class="container">
	{#if lastProfile}
		<div class="log-section">
			<p>
				<strong>Current Profile:</strong> Setting {lastProfile.setting}, Grams {lastProfile.grams},
				Tamped? {lastProfile.tamped ? 'Yes' : 'No'}
			</p>
		</div>
	{/if}
	<h2>Select a Roaster</h2>
	<div class="new-input">
		<select bind:value={$selectedRoaster}>
			<option value="" disabled>Select Roaster</option>
			{#each $roasters as r}
				<option value={r.id}>{r.name}</option>
			{/each}
		</select>
		<button
			type="button"
			class="roaster-toggle"
			on:click={() => showRoasterSelector.update((v) => !v)}
		>
			{#if $showRoasterSelector}
				×
			{:else}
				+
			{/if}
		</button>
	</div>
	{#if $showRoasterSelector}
		<div class="new-input">
			<input type="text" placeholder="New roaster name" bind:value={newRoaster} />
			<button on:click={createRoaster} disabled={!newRoaster.trim()}>Save</button>
		</div>
	{/if}

	{#if $selectedRoaster}
		{#if $showBeanSelector}
			<input class="" type="text" placeholder="Search beans..." bind:value={$beanSearch} />
			{#if $loading}
				<p>Loading beans...</p>
			{:else if $filteredBeans.length}
				<ul class="bean-list">
					{#each $filteredBeans as b}
						<li>
							<button
								type="button"
								class:active={b.id === $selectedBeanId}
								on:click={() => {
									selectedBeanId.set(b.id);
									showBeanSelector.set(false);
								}}
								on:keydown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										selectedBeanId.set(b.id);
										showBeanSelector.set(false);
									}
								}}
							>
								<img src="/bag-of-coffee.png" alt="Bean" class="icon" />
								<span>{b.name}</span>
							</button>
						</li>
					{/each}
				</ul>
			{:else}
				<p>No beans found.</p>
			{/if}
			{#if $beanSearch && !$beans.find((b) => b.name.toLowerCase() === $beanSearch.toLowerCase())}
				<button on:click={addNewBean}>Add "{$beanSearch}"</button>
			{/if}
		{:else}
			<div class="selected-bean-display">
				<img src="/bag-of-coffee.png" alt="Bean" class="icon" />
				<span>{$selectedBean?.name}</span>
				<button class="change-btn" on:click={() => showBeanSelector.set(true)}>
					<img src="/pen-and-paper.png" alt="Change bean" class="icon" />
				</button>
			</div>
		{/if}
	{/if}

	{#if $selectedBean}
		<div class="log-section">
			<h3>Log Grind</h3>
			{#if $showGrinderSelector}
				<label for="grinder-select">Grinder</label>
				<select id="grinder-select" bind:value={$selectedGrinder}>
					<option value="" disabled>Select Grinder</option>
					{#each $grinders as g}
						<option value={g.id}>{g.name}</option>
					{/each}
				</select>
				<div class="new-input">
					<input class="grinder-select" type="text" placeholder="Add new grinder" bind:value={newGrinder} />
					<button on:click={createGrinder} disabled={!newGrinder.trim()}>Add Grinder</button>
				</div>
			{:else}
				<div class="selected-item-display">
					<img src="/grinder.png" alt="Grinder" class="icon" />
					<span>{$selectedGrinderObj?.name}</span>
					<button on:click={() => selectedGrinder.set('')}>
						<img src="/pen-and-paper.png" alt="Change grinder" class="icon" />
					</button>
				</div>
			{/if}

			{#if $showMethodSelector}
				<label for="method-select">Brew Method</label>
				<select id="method-select" bind:value={$selectedMethod}>
					<option value="" disabled>Select Brew Method</option>
					{#each $brewMethods as m}
						<option value={m.id}>{m.name}</option>
					{/each}
				</select>
				<div class="new-input">
					<input type="text" placeholder="Add new method" bind:value={newMethod} />
					<button on:click={createMethod} disabled={!newMethod.trim()}>Add Method</button>
				</div>
			{:else}
				<div class="selected-item-display">
					<label for="selected-method">Method:</label>
					<p id="selected-method">{$selectedMethodObj?.name}</p>
					<button on:click={() => selectedMethod.set('')}>
						<img src="/pen-and-paper.png" alt="Change method" class="icon" />
					</button>
				</div>
			{/if}
			<span class="log-inputs">
				<div>
					<label for="setting-input">Setting</label>
					<input id="setting-input" step="0.5" type="number" bind:value={setting} />
				</div>
				<div>
					<label for="grams-input">Grams</label>
					<input id="grams-input" type="number" min="0" bind:value={grams} />
				</div>
			</span>
			<span class="log-inputs">
				<div>
					<label for="adjustment-select">Adjustment</label>
					<select id="adjustment-select" bind:value={adjustment}>
						<option value="coarser">Coarser</option>
						<option value="good">Good</option>
						<option value="finer">Finer</option>
					</select>
				</div>

				<div class="tamped">
					<img src="/tamper-transparent.png" alt="Tamped?" class="icon" />
					<input id="tamped-checkbox" type="checkbox" bind:checked={tamped} />
				</div>
			</span>
			<span class="log-inputs">
				<input
					id="outcome-input"
					type="text"
					placeholder="e.g. short extraction, bitter, etc."
					bind:value={outcomeText}
				/>
			</span>
			<button on:click={submitLog}>Submit Log</button>

			<LogDisplay {logs} loading={loadingLogs} show={showLogs} toggle={toggleLogs} />
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 400px;
		margin: 2rem auto;
		padding: 1.5rem;
		background: saddlebrown;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		font-family: system-ui, sans-serif;
	}
	h2 {
		margin-bottom: 1rem;
	}
	select,
	input {
		width: 93%;
		padding: 0.75rem;
		margin-bottom: 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
	.bean-list {
		display: flex;
		padding: 0;
		margin: 0 0 1rem;
		max-height: 150px;
		overflow-y: auto;
		border: 1px solid #eee;
		border-radius: 4px;
	}
	.bean-list li {
		display: flex;
		align-items: center;
		padding: 0.5rem;
		cursor: pointer;
	}
	.bean-list li img {
		height: 48px;
		padding: 0.5rem;
	}
	.bean-list li button {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0.5rem;
		background: transparent;
		border: none;
		text-align: left;
	}
	.bean-list li button span {
		font-weight: bold;
	}
	.bean-list li:hover {
		background: #667652;
	}
	button {
		border: none;
		background: transparent;
		border-radius: 4px;
		cursor: pointer;
	}
	p {
		margin: 0.5rem 0;
	}
	.selected-bean-display {
		padding: 0.75rem;
		margin-bottom: 1rem;
		border: 1px solid #eee;
		border-radius: 4px;
		background: #f9f9f9;
		display: flex;
		align-items: center;
		justify-content: space-around;
		gap: 0.5rem;
	}
	.selected-bean-display .icon {
		height: 64px;
	}
	.change-btn {
		margin-top: 0.5rem;
		padding: 0.75rem;
		border: none;
		background: transparent;
		border-radius: 4px;
		cursor: pointer;
	}
	.change-btn:hover {
		background: #909090;
	}
	.log-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 1.5rem;
		padding: 1rem;
		border: 1px solid #eee;
		border-radius: 4px;
		background: #f9f9f9;
	}

	.log-inputs {
		display: flex;
		justify-content: space-around;
	}

    #adjustment-select {
        width: 6rem;
    }

	.log-section h3 {
		margin-top: 0;
		margin-bottom: 1rem;
	}
	.new-input {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}
	#setting-input,
	#grams-input {
		width: 3rem;
	}
	.selected-item-display {
        display: flex;
        justify-content: space-around;
		border: 1px solid #eee;
		border-radius: 4px;
		background: transparent;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.selected-item-display .icon {
		height: 64px;
	}

	.tamped {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.tamped .icon {
		width: 64px;
		height: 64px;
	}

	/* Custom checkbox styling */
	.tamped input[type='checkbox'] {
		-webkit-appearance: none;
		appearance: none;
		width: 1.2em;
		height: 1.2em;
		border: 1px solid #000;
		background: transparent;
		position: relative;
		cursor: pointer;
		margin: 0;
	}
	.tamped input[type='checkbox']::after {
		content: '';
		position: absolute;
		top: 1px;
		left: 8px;
		width: 0.4rem;
		height: 1rem;
		border: solid #000;
		border-width: 0 2px 2px 0;
		transform: rotate(45deg);
		opacity: 0;
	}
	.tamped input[type='checkbox']:checked::after {
		opacity: 1;
	}

	.roaster-toggle {
		padding: 0 0.5rem;
		border: none;
		background: #f0f0f0;
		border-radius: 100%;
		cursor: pointer;
		font-size: 1.2rem;
		height: 2.6rem;
        width: 2.6rem;
		line-height: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
