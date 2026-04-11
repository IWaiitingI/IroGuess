<script lang="ts">
	// On définit les classes manuellement au lieu d'utiliser tailwind-variants
	let {
		class: className = "",
		variant = "default",
		size = "md",
		count = 3,
		duration = 0.5,
		delayStep = 100,
		...restProps
	} = $props();

	// Logique de styles simplifiée (équivalent de loaderVariants)
	const variants = {
		default: "[&>div]:bg-white [&>div]:border-white/20",
		secondary: "[&>div]:bg-black [&>div]:border-white/10",
		outline: "[&>div]:bg-transparent [&>div]:border-white/20",
	};

	const sizes = {
		sm: "[&>div]:w-2 [&>div]:h-2",
		md: "[&>div]:w-3 [&>div]:h-3",
		lg: "[&>div]:w-4 [&>div]:h-4",
	};
</script>

<div
	data-slot="loader"
	class="flex gap-1 {variants[variant]} {sizes[size]} {className}"
	role="status"
	aria-label="Loading..."
	{...restProps}
>
	{#each Array.from({ length: count }) as _, i}
		<div
			class="animate-bounce border-2 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]"
			style="animation-duration: {duration}s; animation-iteration-count: infinite; animation-delay: {i * delayStep}ms;"
		></div>
	{/each}
</div>