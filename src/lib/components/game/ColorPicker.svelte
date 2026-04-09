<script lang="ts">
    let { onSelect } = $props();
    let h = $state(180);
    let s = $state(50);
    let l = $state(50);

    const currentColor = $derived(`hsl(${h},${s}%,${l}%)`);
</script>

<div class="flex flex-col items-center gap-8">
    <div class="w-48 h-48 rounded-xl border-4 border-white/10" style="background: {currentColor}"></div>
    
    <div class="w-full max-w-xs space-y-4">
        <input type="range" min="0" max="360" bind:value={h} class="w-full accent-white" />
        <div class="flex justify-between text-xs opacity-50 uppercase tracking-widest">
            <span>Saturation {s}%</span>
            <span>Luminosité {l}%</span>
        </div>
        <input type="range" min="0" max="100" bind:value={s} class="w-full accent-white" />
        <input type="range" min="0" max="100" bind:value={l} class="w-full accent-white" />
    </div>

    <button 
        onclick={() => onSelect(currentColor)}
        class="px-12 py-4 border border-white hover:bg-white hover:text-black transition-all uppercase tracking-[0.3em] text-xs"
    >
        Valider
    </button>
</div>