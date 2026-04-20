<script lang="ts">
  import { page } from '$app/stores';
  import { gameStore, gameActions } from '$lib/stores/game';
  import ColorPicker from '$lib/components/game/ColorPicker.svelte';
  import ColorSequence from '$lib/components/game/ColorSequence.svelte';
  import ModeTag from '$lib/components/game/ModeTag.svelte';
  import TimerBar from '$lib/components/game/TimerBar.svelte';
  import PlayerList from '$lib/components/game/PlayerList.svelte';
  import Loader from '$lib/components/ui/Loader.svelte';
  import { onDestroy } from 'svelte';
  

  const roomId = $page.params.id;
  let name = $state("");
  let hasJoined = $state(false);

  let copied = $state(false);

  function copyRoomLink() {
    const url = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(url).then(() => {
      copied = true;
      setTimeout(() => (copied = false), 2000);
    });
  }

  const btnClass = "group relative px-10 py-4 bg-yellow-400 text-black border-b-4 border-r-4 border-yellow-700 active:border-0 active:translate-y-1 active:translate-x-1 transition-all uppercase font-bold text-sm tracking-[0.2em]";

  function handleJoin() {
    if (name.length < 2) return;
    gameActions.connect(roomId, name);
    hasJoined = true;
  }

  let myPlayerId = $derived(
    hasJoined && $gameStore
      ? Object.keys($gameStore.players).find(id => $gameStore.players[id].name === name)
      : null
  );

  let hasAnswered = $derived(
    myPlayerId != null && $gameStore?.players[myPlayerId]?.answer !== null
  );

  onDestroy(() => gameActions.leave());
</script>

<div class="w-full max-w-6xl px-6 flex flex-col items-center min-h-screen font-mono mx-auto relative">

  {#if !hasJoined}
    <div class="flex flex-col items-center gap-10 mt-40 animate-in fade-in zoom-in duration-500">
      <h1 class="text-5xl font-black tracking-widest uppercase italic text-white drop-shadow-[6px_6px_0px_#facc15]">
        How do I call you?
      </h1>
      <div class="flex flex-col items-center gap-8">
        <input
          bind:value={name}
          onkeydown={(e) => e.key === 'Enter' && handleJoin()}
          class="bg-black border-4 border-white p-6 text-center text-3xl outline-none focus:border-yellow-400 transition-colors uppercase w-80"
          autofocus
        />
        <button onclick={handleJoin} class="px-16 py-5 border-2 border-white hover:bg-white hover:text-black transition-all uppercase tracking-[0.3em] text-sm font-bold">
          Join
        </button>
      </div>
    </div>

  {:else if $gameStore}
    <div class="w-full mt-8 flex justify-between items-start pointer-events-none z-50 px-4">
      <div class="bg-black border-2 border-white/10 px-4 py-2 text-xs opacity-50 uppercase tracking-widest">
        Room: {roomId}
      </div>
      <PlayerList players={$gameStore.players} currentName={name} />
    </div>

    <main class="flex-1 w-full flex flex-col items-center justify-center py-10 relative">

      {#if $gameStore.subStatus === "pick" && $gameStore.timerEnd}
        <TimerBar timerEnd={$gameStore.timerEnd} mode={$gameStore.currentMode} />
      {/if}

      <div class="w-full flex flex-col items-center gap-12">

        {#if $gameStore.status === "waiting"}
          <div class="text-center space-y-12">
            <p class="text-white/40 animate-pulse uppercase text-sm tracking-[0.5em]">
              You don't have any more friends than that ?
            </p>
            <div class="flex flex-col items-center gap-4">
              <button onclick={gameActions.start} class="{btnClass} text-xl px-20 py-6">
                Let's play !
              </button>
              <button
                onclick={copyRoomLink}
                class="px-10 py-3 border border-white/20 hover:border-white/60 text-white/40 hover:text-white/80 transition-all uppercase tracking-[0.3em] text-xs font-bold flex items-center gap-3"
              >
                {#if copied}
                  <span class="text-green-400">✓</span>
                  <span class="text-green-400">Link copied !</span>
                {:else}
                  <span>⎘</span>
                  Copy Room Link
                {/if}
              </button>
            </div>
          </div>

        {:else if $gameStore.status === "playing"}
          <div class="w-full flex flex-col items-center gap-10">

            <ModeTag mode={$gameStore.currentMode} />
            <p class="text-[10px] uppercase tracking-[0.5em] text-white/20">
              Round {$gameStore.round} / {$gameStore.maxRounds}
            </p>

            {#if $gameStore.subStatus === "memorize"}
              <div class="flex flex-col items-center gap-12 animate-in zoom-in duration-300">
                {#if $gameStore.currentMode === 'whos_next' && $gameStore.sequenceColors}
                  <ColorSequence
                    colors={$gameStore.sequenceColors}
                    targetColor={$gameStore.currentColor}
                    phase="memorize"
                  />
                {:else}
                  <div class="p-3 bg-white shadow-[12px_12px_0px_rgba(255,255,255,0.1)]">
                    <div class="w-72 h-72 border-4 border-black" style="background: {$gameStore.currentColor}"></div>
                  </div>
                  <p class="text-sm uppercase tracking-[0.4em] animate-pulse italic text-yellow-400">
                    Don't stare at me like that !
                  </p>
                {/if}
              </div>

            {:else if $gameStore.subStatus === "pick"}
              <div class="w-full flex flex-col items-center gap-8 animate-in fade-in duration-300">
                {#if !hasAnswered}
                  {#if $gameStore.currentMode === 'whos_next' && $gameStore.sequenceColors}
                    <ColorSequence
                      colors={$gameStore.sequenceColors}
                      targetColor={$gameStore.currentColor}
                      phase="pick"
                    />
                  {:else}
                    <div class="w-20 h-20 border border-white/10 flex items-center justify-center opacity-20">
                      <span class="text-2xl">?</span>
                    </div>
                  {/if}
                  <ColorPicker onSelect={(color) => gameActions.sendAnswer(color)} />
                {:else}
                  <div class="flex flex-col items-center gap-10 py-20">
                    <div class="text-center space-y-4">
                      <p class="text-green-500 text-xl font-black uppercase tracking-widest">Answer sent</p>
                      <p class="text-[10px] uppercase tracking-[0.2em] text-white/20 italic">Waiting for others...</p>
                    </div>
                    <Loader size="lg" duration={0.4} count={4} />
                  </div>
                {/if}
              </div>

            {:else if $gameStore.subStatus === "review"}
              <div class="flex flex-col items-center gap-12 w-full animate-in fade-in">
                <div class="flex flex-col items-center gap-6">
                  <p class="text-[10px] uppercase tracking-[0.5em] text-yellow-400 font-bold">
                    {$gameStore.currentMode === 'whos_next' ? 'The complete sequence' : 'The color was'}
                  </p>
                  {#if $gameStore.currentMode === 'whos_next' && $gameStore.sequenceColors}
                    <ColorSequence
                      colors={$gameStore.sequenceColors}
                      targetColor={$gameStore.currentColor}
                      phase="review"
                    />
                  {:else}
                    <div class="p-2 bg-white shadow-xl">
                      <div class="w-48 h-48 border-4 border-black" style="background: {$gameStore.currentColor}"></div>
                    </div>
                  {/if}
                </div>

                <div class="w-full h-1 bg-white/5"></div>

                <div class="flex flex-wrap justify-center gap-10">
                  {#each Object.values($gameStore.players) as player}
                    <div class="flex flex-col items-center gap-4">
                      <div class="w-24 h-24 border-4 {player.name === name ? 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)]' : 'border-white/20'}"
                           style="background: {player.answer || '#111'}"></div>
                      <p class="text-xs font-bold {player.name === name ? 'text-yellow-400' : 'opacity-40'} uppercase tracking-widest">
                        {player.name}
                      </p>
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </main>

    {#if $gameStore.status === "results"}
      <div class="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center gap-12 animate-in fade-in duration-500">
        <h2 class="text-7xl font-black italic tracking-tighter uppercase text-white drop-shadow-[6px_6px_0px_#facc15]">
          Like a true winner
        </h2>
        <div class="bg-white/5 p-10 border-l-8 border-yellow-400 w-full max-w-md shadow-2xl">
          <div class="space-y-6">
            {#each Object.values($gameStore.players).sort((a, b) => b.score - a.score) as p, i}
              <div class="flex justify-between items-center">
                <span class="uppercase tracking-widest text-lg {i === 0 ? 'text-yellow-400' : 'text-white/60'}">
                  {i + 1}. {p.name}
                </span>
                <span class="font-bold text-2xl">{p.score}</span>
              </div>
            {/each}
          </div>
        </div>
        <button onclick={gameActions.start} class="{btnClass} text-xl px-16 py-6">
          I want more
        </button>
      </div>
    {/if}
  {/if}
</div>

<style>
  :global(body) { background-color: #050505; color: white; overflow-x: hidden; }
  :global(.animate-in) { animation-fill-mode: both; }
</style>