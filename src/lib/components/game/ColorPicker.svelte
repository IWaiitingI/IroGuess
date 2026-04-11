<script lang="ts">
    let { onSelect } = $props();
    let h = $state(180);
    let s = $state(50);
    let l = $state(50);

    const currentColor = $derived(`hsl(${h},${s}%,${l}%)`);
</script>

<div class="flex flex-col items-center gap-8 font-mono">
    <div class="p-1 bg-white">
        <div class="p-1 bg-black">
            <div class="w-40 h-40 border-4 border-white shadow-[inset_4px_4px_0px_rgba(255,255,255,0.3)]" 
                 style="background: {currentColor}">
            </div>
        </div>
    </div>
    
    <div class="w-full max-w-xs space-y-6">
        <div class="space-y-2">
            <div class="flex justify-between text-[10px] uppercase tracking-tighter text-yellow-400">
                <span>> Hue</span>
                <span>{h}°</span>
            </div>
            <input type="range" min="0" max="360" bind:value={h} class="retro-slider" />
        </div>

        <div class="space-y-2">
            <div class="flex justify-between text-[10px] uppercase tracking-tighter text-blue-400">
                <span>> Saturation</span>
                <span>{s}%</span>
            </div>
            <input type="range" min="0" max="100" bind:value={s} class="retro-slider" />
        </div>

        <div class="space-y-2">
            <div class="flex justify-between text-[10px] uppercase tracking-tighter text-white">
                <span>> Lightness</span>
                <span>{l}%</span>
            </div>
            <input type="range" min="0" max="100" bind:value={l} class="retro-slider" />
        </div>
    </div>

    <button 
        onclick={() => onSelect(currentColor)}
        class="group relative px-12 py-4 bg-yellow-400 text-black border-b-4 border-r-4 border-yellow-700 active:border-0 active:translate-y-1 transition-all uppercase font-bold text-xs tracking-[0.2em]"
    >
        Confirm Selection
    </button>
</div>

<style>
    /* Style Retro pour les sliders */
    .retro-slider {
        -webkit-appearance: none;
        width: 100%;
        height: 12px;
        background: #333;
        border: 2px solid #555;
        outline: none;
        image-rendering: pixelated;
    }

    .retro-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 24px;
        background: #fff;
        border: 3px solid #000;
        cursor: pointer;
        box-shadow: 2px 2px 0px #888;
    }

    .retro-slider::-moz-range-thumb {
        width: 16px;
        height: 24px;
        background: #fff;
        border: 3px solid #000;
        cursor: pointer;
        box-shadow: 2px 2px 0px #888;
        border-radius: 0;
    }

    /* Animation de clic sur le bouton pour l'effet "pressé" */
    button:active {
        box-shadow: none;
    }
</style>