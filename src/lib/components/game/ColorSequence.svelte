<script lang="ts">
  let { colors, targetColor, phase } = $props<{
    colors: string[];
    targetColor: string | null;
    phase: "memorize" | "pick" | "review";
  }>();
</script>

{#if phase === "memorize"}
  <div class="flex flex-col items-center gap-8">
    <p class="text-xs uppercase tracking-[0.3em] text-blue-400 italic">Use your brain, if you can...</p>
    <div class="flex gap-6 items-center">
      {#each colors as color, i}
        <div class="flex flex-col items-center gap-3">
          <div class="p-2 bg-white">
            <div class="w-24 h-24 border-2 border-black" style="background: {color}"></div>
          </div>
          <span class="font-bold opacity-20">{i + 1}</span>
        </div>
        {#if i < colors.length - 1}
          <div class="w-4 h-1 bg-white/10"></div>
        {/if}
      {/each}
      <div class="w-4 h-1 bg-white/10"></div>
      <div class="w-24 h-24 border-4 border-dashed border-blue-500/30 flex items-center justify-center text-5xl">?</div>
    </div>
    <p class="text-sm uppercase tracking-[0.4em] animate-pulse italic text-white/40 mt-4">Guess the next color</p>
  </div>

{:else if phase === "pick"}
  <div class="flex gap-3 items-center mb-4">
    {#each colors as color}
      <div class="w-8 h-8 border border-white/20" style="background: {color}"></div>
    {/each}
    <div class="w-8 h-8 border-2 border-dashed border-blue-500 flex items-center justify-center text-blue-500 text-xs">?</div>
  </div>

{:else if phase === "review"}
  <div class="flex gap-3 items-center">
    {#each colors as color}
      <div class="w-12 h-12 border border-white/20" style="background: {color}"></div>
    {/each}
    <div class="w-4 h-0.5 bg-white/20"></div>
    <div class="p-1 bg-white">
      <div class="w-16 h-16 border-2 border-black" style="background: {targetColor}"></div>
    </div>
  </div>
{/if}