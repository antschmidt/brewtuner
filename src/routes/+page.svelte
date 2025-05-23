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
	const showRoasterSelector = writable(true);
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
		if (!get(selectedBeanId)) {
			showBeanSelector.set(true);
		}
		// default to showing roaster selector if no roaster was selected
		if (!get(selectedRoaster)) {
			showRoasterSelector.set(true);
		}
		isRestoring = false;
	});

	selectedRoaster.subscribe(async (id) => {
		// clear any previous bean selection and search when roaster changes
		selectedBeanId.set('');
		beanSearch.set('');
		if (!isRestoring) showBeanSelector.set(true);
		// auto-open roaster selector if cleared
		if (!id) {
			showRoasterSelector.set(true);
			return beans.set([]);
		}
		if (!id) return beans.set([]);
		loading.set(true);
		beans.set(await getBeans(id));
		loading.set(false);
		showRoasterSelector.set(false);
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
			const profile = await upsertProfile(beanId, get(selectedGrinder), get(selectedMethod), setting, grams, tamped);
			console.log('submitLog (initial profile creation):', profile);
			lastProfile = { setting: profile.profile_setting, grams: profile.grams, tamped: profile.tamped };
			profileId = profile.id;
		} else if (adjustment === 'good') {
			const profile = await upsertProfile(beanId, get(selectedGrinder), get(selectedMethod), setting, grams, tamped);
			console.log('submitLog (profile upsert):', profile);
			lastProfile = { setting: profile.profile_setting, grams: profile.grams, tamped: profile.tamped };
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
		<!-- <div class="new-input">
			<img src="/roaster.png" width="64px" alt="Roaster" class="icon" />
			<select id="roaster" bind:value={$selectedRoaster}>
				<option value="" disabled>Select Roaster</option>
				{#each $roasters as r}
					<option value={r.id}>{r.name}</option>
				{/each}
			</select>
		</div> -->
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
			<img src="/roaster.png" width="64px" alt="Roaster" class="icon" />
			<span>{$roasters.find((r) => r.id === $selectedRoaster)?.name || `Add New Roaster`}</span>
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
				<img width="64px" src="/bag-of-coffee.png" alt="Bean" class="icon" />
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
				<img src="/grinder.png" height="64px" alt="Grinder" class="icon" />
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
					<img src="/method.png" width="64px" alt="Method" class="icon" />
					<span id="selected-method">{$selectedMethodObj?.name || `Select a method`}</span>
				</div>
			</Selector>
			{#if $selectedMethod}
				<span class="log-inputs">
					<div>
						<span class="dial unit-input">
							<input id="setting-input" type="number" step="0.1" bind:value={setting} />
							<Dial bind:value={setting} min={-30} max={30} step={0.5} />
						</span>
					</div>
					<div class="unit-input">
						<label for="grams-input" class="right-setting"
							><img height="64px" src="/coffee-scale.png" alt="grams" /></label
						>
						<input id="grams-input" type="number" min="0" bind:value={grams} />
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
						<img alt="adjustment" height="64px" src="idea.png" />
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

				<LogDisplay {logs} loading={$loadingLogs} show={$showLogs} toggle={toggleLogs} />
			{/if}
		{/if}
	{/if}
</div>

<style>
	.container {
		display: flex;
		min-height: 100vh;
		flex-direction: column;
		align-items: stretch;
		gap: 1.8rem;
		justify-content: stretch;
		max-width: 400px;
		margin: 0 auto;
		background: rgb(167, 94, 42);
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		font-family: system-ui, sans-serif;
	}
	select {
		height: 2.6rem;
		margin-bottom: 1rem;
		color: black;
	}
	select,
	input {
		width: 93%;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		height: 2rem;
		background: rgb(120, 23, 23);
	}

	.new-input input {
		width: 100%;
	}
	.dial {
		display: flex;
		gap: 1rem;
	}
	textarea {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1.2rem;
		resize: none;
		background-color: rgba(222, 184, 135, 0.678);
	}

	.new-input button {
		width: 30%;
		margin-right: 1.6rem;
		background: rgb(37, 30, 20);
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}
	.new-input {
		display: flex;
		justify-self: center;
		gap: 0.5rem;
		margin-top: 0.5rem;
		width: 100%;
	}

	.right-setting {
		margin-right: 0.5rem;
		font-size: 1rem;
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
	.summary-button {
		display: flex;
		width: 100%;
		font: initial;
		font-family: serif;
		font-variant: small-caps;
		font-size: xx-large;
		align-items: center;
		justify-content: space-around;
		gap: 0.5rem;
		background: transparent;
		border: none;
		cursor: pointer;
	}
	.log-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.log-inputs {
		display: flex;
		justify-content: space-between;
	}

	#adjustment-select {
		background-color: #ffffff1a;
		margin: 1rem 0;
		border: 0px;
		height: 3rem;
	}

	#setting-input,
	#grams-input {
		width: 3rem;
		background-color: #ffffff1a;
		border: 0px;
		height: 2rem;
		width: 2rem;
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
		width: 1.6rem;
		height: 1.6rem;
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

	.submit {
		background: black;
		color: white;
		width: 50%;
		align-self: center;
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 2rem;
		margin-top: 1rem;
	}

	.unit {
		margin-left: 0.5rem;
		font-size: 1rem;
	}

	.unit-input {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.summary-select-wrapper {
		position: relative;
	}
	.summary-select-wrapper select {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		cursor: pointer;
	}

	@media (max-width: 600px) {
		.container {
			max-width: 100%;
			margin: 0;
			padding: 2rem 1rem 1rem 1rem;
			border-radius: 0;
			min-height: 100vh;
		}
	}
</style>
