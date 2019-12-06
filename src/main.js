import App from './App.svelte';

// https://svelte.dev/docs#Creating_a_component
const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export default app;
