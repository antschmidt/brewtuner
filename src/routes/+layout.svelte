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
  let isLoginView = true; // Added to toggle between login and signup

  const login = async () => {
    await nhost.auth.signIn({email, password});
  };

  const logout = async () => {
    await nhost.auth.signOut();
  };

  const signup = async () => {
    const { error } = await nhost.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
      return;
    }
    alert('Signup successful! Please check your email to verify your account.');
    isLoginView = true;
  };

  const signInWithGoogle = async () => {
    const { error } = await nhost.auth.signIn({
      provider: 'google'
    });
    if (error) {
      alert(`Error signing in with Google: ${error.message}`);
    }
  };

  const signInWithGitHub = async () => {
    const { error } = await nhost.auth.signIn({
      provider: 'github'
    });
    if (error) {
      alert(`Error signing in with GitHub: ${error.message}`);
    }
  };

  const sendMagicLink = async () => {
    if (!email) {
      alert('Please enter your email address.');
      return;
    }
    // Corrected based on Nhost documentation: use signIn with only email for magic link
    const { error } = await nhost.auth.signIn({ email }); // `session` is not directly returned here for magic link initiation
    if (error) {
      alert(`Error sending magic link: ${error.message}`);
    } else {
      // If signIn with email only is successful, Nhost sends the magic link.
      // The session will typically become active after the user clicks the link in their email.
      // onAuthStateChanged will handle the session update.
      alert('Magic link sent! Check your email to complete the sign-in process.');
    }
  };

  const signUpWithSecurityKey = async () => {
    if (!email) {
      alert('Please enter your email address to register with a security key.');
      return;
    }
    // Using the method from the provided documentation
    const { error, session } = await nhost.auth.signUp({
      email,
      securityKey: true
    });

    if (error) {
      alert(`Error signing up with security key: ${error.message}`);
    } else {
      // Nhost handles the redirect and flow for WebAuthn
      alert('Follow the browser prompts to register your security key. You might be asked to verify your email first if this is a new account.');
      // 'session' will be populated on successful sign-up and key registration
      if (session) {
        user.set(session.user);
      }
    }
  };

  const signInWithSecurityKey = async () => {
    if (!email) {
      alert('Please enter your email address to sign in with a security key.');
      return;
    }
    // Using the method from the provided documentation
    const { error, session } = await nhost.auth.signIn({
      email,
      securityKey: true
    });

    if (error) {
      alert(`Error signing in with security key: ${error.message}`);
      // Common errors: user not found, no security key registered for this user, or user cancelled.
    } else {
      // On success, Nhost handles the rest, and onAuthStateChanged will update the UI.
      // 'session' will be populated on successful sign-in
      if (session) {
        user.set(session.user);
      }
    }
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

  .toggle-auth-mode {
    background: none;
    border: none;
    color: var(--color-accent);
    cursor: pointer;
    padding: 0.5rem 0;
    margin-top: 1rem;
    text-decoration: underline;
  }
  .toggle-auth-mode:hover {
    color: var(--color-primary);
  }

  .oauth-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
  }

  .passwordless-options {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border); /* Optional: visual separator */
  }

  .oauth-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    transition: background-color var(--transition-speed) ease;
    border: 1px solid var(--color-border);
    background-color: var(--color-surface);
    color: var(--color-text-primary);
  }
  .oauth-button:hover {
    background-color: var(--color-input-bg); /* Slightly different hover for distinction */
  }

  .oauth-button img {
    width: 20px;
    height: 20px;
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
      {#if isLoginView}
        <h2>Login</h2>
        <input type="email" placeholder="Email" bind:value={email} />
        <input type="password" placeholder="Password" bind:value={password} />
        <button on:click={login}>Login</button>
        <div class="passwordless-options">
          <button class="oauth-button" on:click={signInWithSecurityKey}>Sign in with Security Key</button>
          <button class="oauth-button" on:click={sendMagicLink}>Send Magic Link</button>
        </div>
        <button class="toggle-auth-mode" on:click={() => isLoginView = false}>
          Don't have an account? Sign up
        </button>
      {:else}
        <h2>Sign Up</h2>
        <input type="email" placeholder="Email" bind:value={email} />
        <input type="password" placeholder="Password" bind:value={password} />
        <button on:click={signup}>Sign Up</button>
        <div class="passwordless-options">
          <button class="oauth-button" on:click={signUpWithSecurityKey}>Sign up with Security Key</button>
           <!-- Magic link is typically for sign-in, but can be initiated from signup if user already has an account -->
          <button class="oauth-button" on:click={sendMagicLink}>Send Magic Link (if account exists)</button>
        </div>
        <button class="toggle-auth-mode" on:click={() => isLoginView = true}>
          Already have an account? Log in
        </button>
      {/if}

      <div class="oauth-buttons">
        <button class="oauth-button" on:click={signInWithGoogle}>
          <!-- Add Google icon here if you have one -->
          <span>Sign in with Google</span>
        </button>
        <button class="oauth-button" on:click={signInWithGitHub}>
          <!-- Add GitHub icon here if you have one -->
          <span>Sign in with GitHub</span>
        </button>
      </div>
    </div>
  </div>
{/if}