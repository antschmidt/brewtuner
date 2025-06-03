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
		logGrinderLog,
		addGrinder,
		addBrewMethod,
		getProfile,
		getGrindLogs,
		addRoaster
	} from '$lib/graphQLClient';
	import type { GrindLog } from '$lib/graphQLClient';
	import LogDisplay from '$lib/LogDisplay.svelte';
	import { fly, scale } from 'svelte/transition';
	import Dial from '$lib/Dial.svelte';
	import Selector from '$lib/Selector.svelte';
	import BeanSelector from '$lib/BeanSelector.svelte';

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
	const showBeanSelector = writable(false);
	let isRestoring = true;
	const showGrinderSelector = writable(false);
	const showMethodSelector = writable(false);
	const grinders = writable<Grinder[]>([]);
	const brewMethods = writable<BrewMethod[]>([]);
	const selectedGrinder = writable<string>('');
	const selectedMethod = writable<string>('');
	let newGrinder = '';
	let newMethod = '';
	let setting: number | null = 0;
	let outcomeText = '';
	let adjustment: 'coarser' | 'good' | 'finer' = 'good';
	let grams: number | null = 0;
	let tamped = false;
	let currentProfile: {
		id: string;
		profile_setting: number;
		grams: number;
		tamped: boolean;
	} | null = null;
	let loadingProfile = false;
	let logs: GrindLog[] = [];
	import { writable as writableLocal } from 'svelte/store';
	const showLogs = writableLocal(false);
	const loadingLogs = writableLocal(false);
	let showLogsLocal = false;
	const showRoasterSelector = writable(false);
	let newRoaster = '';
	let newBean = '';

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
					if (bean) showBeanSelector.set(false);
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
		// default to showing bean selector if no bean was restored
		// if (!get(selectedBeanId)) {
		// 	showBeanSelector.set(true);
		// }
		// default to showing roaster selector if no roaster was selected
		// if (!get(selectedRoaster)) {
		// 	showRoasterSelector.set(true);
		// }
		isRestoring = false;
	});

	selectedRoaster.subscribe(async (id) => {
		// clear any previous bean selection and search when roaster changes
		selectedBeanId.set('');
		beanSearch.set('');
		// auto-open roaster selector if cleared
		if (!id) {
			// showRoasterSelector.set(true);
			return beans.set([]);
		}
		if (!id) return beans.set([]);
		loading.set(true);
		beans.set(await getBeans(id));
		loading.set(false);
		showRoasterSelector.set(false);
		showBeanSelector.set(false);
		showGrinderSelector.set(false);
		showMethodSelector.set(false);
	});

	const filteredBeans = derived([beans, beanSearch], ([$beans, $search]) =>
		$search ? $beans.filter((b) => b.name.toLowerCase().includes($search.toLowerCase())) : $beans
	);

	const selectedBean = derived([beans, selectedBeanId], (values) => {
		const [$beans, $id] = values;
		return $beans.find((b) => b.id === $id) || null;
	});

	async function submitLog() {
		const beanId = get(selectedBeanId);
		let profileId: string;
		// create profile if none exists, update only on 'good'
		if (!currentProfile?.id) {
			const profile = await upsertProfile(
				beanId,
				get(selectedGrinder),
				get(selectedMethod),
				setting,
				grams,
				tamped
			);
			console.log('submitLog (initial profile creation):', profile);
			lastProfile = {
				setting: profile.profile_setting,
				grams: profile.grams,
				tamped: profile.tamped
			};
			profileId = profile.id;
		} else if (adjustment === 'good') {
			const profile = await upsertProfile(
				beanId,
				get(selectedGrinder),
				get(selectedMethod),
				setting,
				grams,
				tamped
			);
			console.log('submitLog (profile upsert):', profile);
			lastProfile = {
				setting: profile.profile_setting,
				grams: profile.grams,
				tamped: profile.tamped
			};
			profileId = profile.id;
		} else {
			// existing profile, no update
			profileId = currentProfile.id;
		}
		// always log the grind attempt
		await logGrind(profileId, setting, outcomeText, adjustment, tamped, grams);
		// also log to the grinder-specific logs when adjustment is 'good'
		if (adjustment === 'good') {
			await logGrinderLog(get(selectedGrinder), setting, outcomeText, adjustment, tamped, grams);
		}

		// Immediately refresh and show logs
		showLogs.set(true);
		loadingLogs.set(true);
		logs = await getGrindLogs(profileId);
		loadingLogs.set(false);

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

	async function addNewBean() {
		const b = await addBean($selectedRoaster, newBean.trim());
		beans.update((list) => [...list, b]);
		selectedBeanId.set(b.id);
		newBean = '';
		showBeanSelector.set(false);
	}

	// toggle grinder selector when selectedGrinder changes
	selectedGrinder.subscribe((id) => {
		showMethodSelector.set(false);
		if (!id) newGrinder = '';
	});
	// toggle method selector when selectedMethod changes
	selectedMethod.subscribe((id) => {
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
				adjustment = last.adjustment;
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
		showLogs.update((v) => !v);
		// fetch logs on first open
		if (get(showLogs) && currentProfile?.id && logs.length === 0) {
			loadingLogs.set(true);
			logs = await getGrindLogs(currentProfile.id);
			loadingLogs.set(false);
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
				lastProfile = null; // clear previous profile summary
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

	function handleLogUpdated(event: CustomEvent<GrindLog>) {
		const updatedLog = event.detail;
		// Update the local 'logs' array to be reactive
		logs = logs.map((log) => (log.id === updatedLog.id ? updatedLog : log));
	}
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
	<Selector show={showRoasterSelector} expandTransition={fly} expandParams={{ duration: 300 }}>
		<!-- expanded roaster selection -->
		<div class="new-input">
			<input type="text" placeholder="New roaster name" bind:value={newRoaster} />
			<button on:click={createRoaster} disabled={!newRoaster.trim()}>Save</button>
		</div>
		<!-- summary roaster view -->
		<div slot="summary" class="summary-select-wrapper summary-button">
			<select
				value={$selectedRoaster}
				on:change={(e) => {
					const v = e.target.value;
					if (v === '__add__') {
						showRoasterSelector.set(true);
					} else {
						selectedRoaster.set(v);
						showRoasterSelector.set(false);
					}
				}}
			>
				<option value="" disabled hidden>Select Roaster</option>
				<option value="__add__">+ Add New Roaster</option>
				{#each $roasters as r}
					<option value={r.id}>{r.name}</option>
				{/each}
			</select>
			<span class="icon">
				<img src="/roaster.png" alt="Roaster" />
			</span>
			<span>{$roasters.find((r) => r.id === $selectedRoaster)?.name || `Select a roaster`}</span>
		</div>
	</Selector>

	{#if $selectedRoaster}
		<Selector show={showBeanSelector} expandTransition={scale} expandParams={{ duration: 200 }}>
			<div class="new-input">
				<input type="text" placeholder="New bean name" bind:value={newBean} />
				<button on:click={addNewBean} disabled={!newBean.trim()}>Save</button>
			</div>
			<!-- summary bean view -->
			<div slot="summary" class="summary-select-wrapper summary-button">
				<select
					value={$selectedBeanId}
					on:change={(e) => {
						const v = e.target.value;
						if (v === '__add__') {
							showBeanSelector.set(true);
						} else {
							selectedBeanId.set(v);
							showBeanSelector.set(false);
						}
					}}
				>
					<option value="" disabled hidden>Select Bean</option>
					<option value="__add__">+ Add New Bean</option>
					{#each $beans as b}
						<option value={b.id}>{b.name}</option>
					{/each}
				</select>
				<span class="icon"><img src="/bag-of-coffee.png" alt="Bean" /></span>
				<span>{$selectedBean?.name || `Select a bean`}</span>
			</div>
		</Selector>
	{/if}

	{#if $selectedBean}
		<Selector show={showGrinderSelector} expandTransition={scale} expandParams={{ duration: 200 }}>
			<div class="new-input">
				<input type="text" placeholder="Add new grinder" bind:value={newGrinder} />
				<button on:click={createGrinder} disabled={!newGrinder.trim()}>Save</button>
			</div>
			<div slot="summary" class="summary-select-wrapper summary-button">
				<select
					value={$selectedGrinder}
					on:change={(e) => {
						const v = e.target.value;
						if (v === '__add__') {
							showGrinderSelector.set(true);
						} else {
							selectedGrinder.set(v);
							showGrinderSelector.set(false);
						}
					}}
				>
					<option value="" disabled hidden>Select Grinder</option>
					<option value="__add__">+ Add New Grinder</option>
					{#each $grinders as g}
						<option value={g.id}>{g.name}</option>
					{/each}
				</select>
				<span class="icon"><img src="/grinder.png" alt="Grinder" /></span>
				<span>{$selectedGrinderObj?.name || 'Select a grinder'}</span>
			</div>
		</Selector>
		{#if $selectedGrinder}
			<Selector show={showMethodSelector} expandTransition={scale} expandParams={{ duration: 200 }}>
				<div class="new-input">
					<input id="new-method" type="text" placeholder="Add new method" bind:value={newMethod} />
					<button on:click={createMethod} disabled={!newMethod.trim()}>Save</button>
				</div>
				<div slot="summary" class="summary-select-wrapper summary-button">
					<select
						value={$selectedMethod}
						on:change={(e) => {
							const v = e.target.value;
							if (v === '__add__') {
								showMethodSelector.set(true);
							} else {
								selectedMethod.set(v);
								showMethodSelector.set(false);
							}
						}}
					>
						<option value="" disabled hidden>Select Method</option>
						<option value="__add__">+ Add New Method</option>
						{#each $brewMethods as m}
							<option value={m.id}>{m.name}</option>
						{/each}
					</select>
					<span class="icon"><img src="/method.png" alt="Method" /></span>
					<span id="selected-method">{$selectedMethodObj?.name || `Select a method`}</span>
				</div>
			</Selector>
			{#if $selectedMethod}
				<span class="log-inputs">
					<div>
						<span class="dial unit-input">
							<input
								id="setting-input"
								type="number"
								step="0.1"
								bind:value={setting}
								on:focus={(e) => {
									if (e.target instanceof HTMLInputElement && parseFloat(e.target.value) === 0) {
										setting = null;
									}
								}}
								on:blur={(e) => {
									if (setting === null) {
										setting = 0;
									}
								}}
							/>
							<Dial bind:value={setting} min={-30} max={30} step={0.5} />
						</span>
					</div>
					<div class="unit-input">
						<label for="grams-input" class="right-setting icon"
							><img src="/coffee-scale.png" alt="grams" /></label
						>
						<input
							id="grams-input"
							type="number"
							min="0"
							bind:value={grams}
							on:focus={(e) => {
								if (e.target instanceof HTMLInputElement && parseFloat(e.target.value) === 0) {
									grams = null;
								}
							}}
							on:blur={(e) => {
								if (grams === null) {
									grams = 0;
								}
							}}
						/>
						<span class="unit">g</span>
					</div>
				</span>
				<span class="log-inputs">
					<div class="tamped">
						<select id="adjustment-select" bind:value={adjustment}>
							<option value="coarser">Coarser</option>
							<option value="good">Good</option>
							<option value="finer">Finer</option>
						</select>
						<label for="adjustment-select" class="icon">
							<img alt="adjustment" src="idea.png" />
						</label>
					</div>

					<div class="tamped">
						<img src="/tamper-transparent.png" alt="Tamped?" class="icon" />
						<input id="tamped-checkbox" type="checkbox" bind:checked={tamped} />
					</div>
				</span>
				<span class="log-inputs">
					<textarea
						id="outcome-input"
						rows="8"
						style="width: 100%;"
						placeholder="e.g. short extraction, bitter, etc."
						bind:value={outcomeText}
					></textarea>
				</span>
				<button class="submit" on:click|preventDefault={submitLog} type="button">Submit</button>
				<LogDisplay
					{logs}
					loading={$loadingLogs}
					show={$showLogs}
					toggle={toggleLogs}
					on:logupdated={handleLogUpdated}
				/>
			{/if}
		{/if}
	{/if}
</div>

<style>
	/* Import modern typefaces */
	@import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;700&family=Inter:wght@400;500;700&display=swap');

	:global(:root) {
		--color-bg: #F4F1EE;
		--color-accent: #C67B5C;
		--color-cta: #4B3F3F;
		--color-text: #1C1C1C;
		--color-secondary: #5A5A5A;
		--color-input-bg: #F8F5F2;
		--border-radius: 8px;
		--transition-speed: 0.2s;
	}

	.container {
		display: flex;
		flex-direction: column;
		gap: 1.8rem;
		justify-content: space-evenly;
		padding: 2rem 1rem;
		max-width: 480px;
		margin: 0 auto;
		min-height: 100vh;
		background: var(--color-bg);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		font-family: 'Inter', sans-serif;
		color: var(--color-text);
		border-radius: var(--border-radius);
	}

	select,
	input,
	textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--color-secondary);
		border-radius: var(--border-radius);
		background: var(--color-input-bg);
		font-family: inherit;
		color: var(--color-text);
		transition: border-color var(--transition-speed) ease;
	}

	select:hover,
	input:hover,
	textarea:hover {
		border-color: var(--color-accent);
	}

	textarea {
		resize: none;
		font-size: 1rem;
	}

	.new-input {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	.new-input button {
		flex-shrink: 0;
		background: var(--color-cta);
		color: white;
		border: none;
		border-radius: var(--border-radius);
		padding: 0 1rem;
		font-weight: 500;
		cursor: pointer;
		transition: opacity var(--transition-speed) ease;
	}

	.new-input button:hover {
		opacity: 0.9;
	}

	.summary-button {
		display: flex;
		align-items: center;
		justify-content: space-around;
		gap: 0.5rem;
		font-family: 'Clash Display', serif;
		font-variant: small-caps;
		font-size: 1.25rem;
		background: transparent;
		border: none;
		cursor: pointer;
		width: 100%;
		text-align: left;
		transition:
			border-color var(--transition-speed) ease,
			background-color var(--transition-speed) ease;
	}

	.log-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.log-inputs {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.unit-input,
	.dial {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	#adjustment-select {
		width: auto;
		padding: 0.5rem 1rem;
	}

	.tamped {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
	.tamped img.icon {
		/* Ensure icon class is used on img for this */
		height: 48px; /* Standardized icon size */
	}

	.tamped input[type='checkbox'] {
		appearance: none;
		width: 1.6rem;
		height: 1.6rem;
		border: 2px solid var(--color-text);
		border-radius: 4px;
		position: relative;
		cursor: pointer;
	}

	.tamped input[type='checkbox']::after {
		content: '';
		position: absolute;
		top: 2px;
		left: 5px;
		width: 0.4rem;
		height: 1rem;
		border: solid var(--color-text);
		border-width: 0 2px 2px 0;
		transform: rotate(45deg);
		opacity: 0;
		transition: opacity var(--transition-speed) ease;
	}

	.tamped input[type='checkbox']:checked::after {
		opacity: 1;
	}

	.submit {
		background: var(--color-cta);
		color: white;
		padding: 0.75rem 2rem;
		font-size: 1.25rem;
		font-weight: 600;
		border: none;
		border-radius: var(--border-radius);
		cursor: pointer;
		align-self: center;
		transition: transform var(--transition-speed) ease;
	}

	.submit:hover {
		transform: scale(1.03);
	}

	@media (max-width: 600px) {
		.container {
			padding: 1.5rem;
			border-radius: 0;
		}
	}
</style>
