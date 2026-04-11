<script lang="ts">
  let { players, currentName } = $props<{
    players: Record<string, { name: string; score: number; answer: string | null }>;
    currentName: string;
  }>();
</script>

<div class="flex flex-col gap-3 items-end">
  {#each Object.values(players) as player}
    <div class="flex items-center bg-black/60 border-l-8 {player.answer ? 'border-green-500' : 'border-white/20'} px-5 py-2 shadow-lg">
      <span class="text-xs uppercase font-bold {player.answer ? 'text-green-400' : 'text-white/50'}">
        {player.name}
      </span>
      <span class="ml-6 font-bold text-lg">{player.score}</span>
    </div>
  {/each}
</div>