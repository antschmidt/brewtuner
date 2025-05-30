<script lang="ts">
  import { onMount } from 'svelte';
  import { nhost } from '$lib/nhostClient';
  import { writable } from 'svelte/store';
  import { theme, toggleTheme } from '$lib/themeStore'; // Import theme store and toggle function


  const user = writable(nhost.auth.getUser());

  onMount(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(reg => {
        reg.addEventListener('updatefound', () => {
          // notify user to refresh
        });
      });
    }
    nhost.auth.onAuthStateChanged((_event, session) => {
      user.set(session?.user ?? null);
    });
  });

  let email = '';
  let password = '';

  const login = async () => {
    await nhost.auth.signIn({email, password});
  };

  const logout = async () => {
    await nhost.auth.signOut();
  };
</script>

<style>
  .login-container {
    background-color: var(--color-surface); /* Use theme variable */
    display: flex;
    flex-direction: column;
    min-width: 300px;
    margin: auto;
    padding: 2rem;
    border: 1px solid var(--color-border); /* Use theme variable */
    border-radius: var(--border-radius-md); /* Use theme variable */
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
		color: var(--color-text-primary); /* Use theme variable */
  }
  input {
    margin-bottom: 1rem;
    padding: 0.75rem;
    border: 1px solid var(--color-border); /* Use theme variable */
    border-radius: var(--border-radius-sm); /* Use theme variable */
    background-color: var(--color-input-bg); /* Use theme variable */
		color: var(--color-text-primary); /* Use theme variable */
  }
  button {
    padding: 0.75rem;
    border: none;
    background: var(--color-cta); /* Use theme variable */
    color: var(--color-surface); /* Use theme variable for text on CTA */
    border-radius: var(--border-radius-sm); /* Use theme variable */
    cursor: pointer;
		transition: background-color var(--transition-speed) ease;
  }
  button:hover {
    background: var(--color-primary); /* Use theme variable */
  }
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: var(--color-surface); /* Use theme variable */
    border-bottom: 1px solid var(--color-border); /* Use theme variable */
		color: var(--color-text-primary); /* Use theme variable */
  }

	.theme-toggle {
		bottom: 5rem;
		max-width: 4rem;
		z-index: 1000; /* Ensure it's above other content */
		background: transparent;
		font-size: 1.5rem;
		cursor: pointer;
		border-radius: var(--border-radius-sm);
		color: var(--color-text-primary);
		border: 0;
		border-style: none;
	}

	.theme-toggle:hover {
		background-color: var(--color-surface);
	}

  .login-page-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    width: 100%;
  }
</style>

{#if $user}
  <slot />
    <nav>
    <div>Welcome {$user.email}</div>
    	<button on:click={toggleTheme} aria-label="Toggle theme" class="theme-toggle">
		{$theme === 'light' ? '🌙' : '☀️'}
	</button>
    <button on:click={logout}>Logout</button>
  </nav>
{:else}
  <div class="login-page-wrapper">
    <div class="login-container">
      <h2>Login</h2>
      <input type="email" placeholder="Email" bind:value={email} />
      <input type="password" placeholder="Password" bind:value={password} />
      <button on:click={login}>Login</button>
    </div>
  </div>
{/if}