<script lang="ts">
  let { timerEnd, mode } = $props<{
    timerEnd: number;
    mode: "classic" | "sudden_death" | "bombs_ticking" | "whos_next";
  }>();

  const totalDuration = mode === "bombs_ticking" ? 4 : 20;
  const isBomb = mode === "bombs_ticking";

  let timeLeft = $state(0);

  $effect(() => {
    const interval = setInterval(() => {
      timeLeft = Math.max(0, (timerEnd - Date.now()) / 1000);
      if (timeLeft <= 0) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  });
</script>

<div class="absolute -right-4 lg:right-4 xl:right-20 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 animate-in slide-in-from-right duration-300">
  <div class="flex flex-col gap-2 p-3 border-4 border-white/10 bg-black">
    {#each Array(10) as _, i}
      {@const threshold = ((9 - i) + 1) * (totalDuration / 10)}
      <div class="w-8 h-5 border border-black transition-all duration-300
        {timeLeft >= threshold
          ? isBomb ? 'bg-red-600 shadow-[0_0_10px_#dc2626]' : 'bg-yellow-400'
          : 'bg-white/5 border-white/5'}">
      </div>
    {/each}
  </div>
  <span class="font-black text-2xl {isBomb ? 'text-red-600' : 'text-yellow-400'} drop-shadow-[2px_2px_0px_#000]">
    {timeLeft.toFixed(1)}s
  </span>
</div>