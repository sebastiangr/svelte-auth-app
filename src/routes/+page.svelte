<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';

	let username = '';
	let password = '';
	let mensaje: string | null = null;
	let mensajeExito: string | null = null; // Mensaje de éxito
  let loading = false; // Estado de loading

	// Manejo de toasts
	const toastStore = getToastStore();

	async function login() {
		mensaje = null;
    loading = true; // Activar loading

		const res = await fetch('/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password })
		});

		const data = await res.json();

		if (res.ok) {
			localStorage.setItem('token', data.token);
			toastStore.trigger({ message: 'Login exitoso', background: 'green' });
			goto('/dashboard');
		} else {
			mensaje = data.error;
			toastStore.trigger({ message: data.error, background: 'red' });
		}

    loading = false; // Desactivar loading
	}

	onMount(() => {
		const token = localStorage.getItem('token');
		if (token) goto('/dashboard');

		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.get('registered') === 'true') {
			mensajeExito = 'Usuario creado exitosamente. Ingrese sus credenciales para continuar.'; // Asignar mensaje de éxito
		}
	});
</script>

<!-- TODO: Agregar validación de campos no vacíos -->
<!-- TODO: Deshabilitar botón al enviar -->
<div class="flex flex-col items-center justify-center min-h-screen">
	<h1 class="text-2xl font-bold">Iniciar sesión</h1>
	{#if mensajeExito}
		<p class="text-green-500">{mensajeExito}</p> <!-- Mostrar mensaje de éxito -->
	{/if}
	<input bind:value={username} type="text" placeholder="Nombre de usuario" class="input" disabled={loading}/>
	<input bind:value={password} type="password" placeholder="Contraseña" class="input" disabled={loading}/>
	<button on:click={login} class="btn-login btn-primary" style="pointer-events: {loading ? 'none' : 'auto'}" disabled={loading}>
    {#if loading}
      <span class="loader"></span>Verificando... <!-- Spinner -->
    {:else}
      Ingresar
    {/if}
  </button>
	{#if mensaje}
		<p class="text-red-500">{mensaje}</p>
	{/if}
  <hr>
	<p>¿No tienes cuenta? <a href="/signup" class="text-blue-500">Regístrate</a></p>
</div>
