<script lang="ts">
  import { onMount } from 'svelte';
  import { nhost } from '$lib/nhostClient';
  import { writable } from 'svelte/store';

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
  .login-container { display: flex; flex-direction: column; max-width: 300px; margin: auto; padding: 2rem; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
  input { margin-bottom: 1rem; padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px; }
  button { padding: 0.75rem; border: none; background: #0070f3; color: white; border-radius: 4px; cursor: pointer; }
  button:hover { background: #005bb5; }
  nav { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #f4f4f4; border-bottom: 1px solid #ddd; }
</style>

{#if $user}
  <nav>
    <div>Welcome {$user.email}</div>
    <button on:click={logout}>Logout</button>
  </nav>
  <slot />
{:else}
  <div class="login-container">
    <h2>Login</h2>
    <input type="email" placeholder="Email" bind:value={email} />
    <input type="password" placeholder="Password" bind:value={password} />
    <button on:click={login}>Login</button>
  </div>
{/if}