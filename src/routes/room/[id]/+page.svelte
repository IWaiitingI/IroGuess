<script lang="ts">
    import { page } from '$app/stores';
    import { gameStore, gameActions } from '$lib/stores/game';
    import ColorPicker from '$lib/components/game/ColorPicker.svelte';
    import Loader from '$lib/components/ui/Loader.svelte';
    import { onDestroy } from 'svelte';

    const roomId = $page.params.id;
    let name = $state("");
    let hasJoined = $state(false);
    let timeLeft = $state(0);

    // Style de bouton Arcade
    const btnClass = "group relative px-10 py-4 bg-yellow-400 text-black border-b-4 border-r-4 border-yellow-700 active:border-0 active:translate-y-1 active:translate-x-1 transition-all uppercase font-bold text-sm tracking-[0.2em]";

    function handleJoin() {
        if (name.length < 2) return;
        gameActions.connect(roomId, name);
        hasJoined = true;
    }

    // Gestion du timer visuel
    $effect(() => {
        if ($gameStore?.timerEnd && $gameStore?.subStatus === "pick") {
            const interval = setInterval(() => {
                const now = Date.now();
                timeLeft = Math.max(0, ($gameStore.timerEnd - now) / 1000);
                if (timeLeft <= 0) clearInterval(interval);
            }, 50);
            return () => clearInterval(interval);
        }
    });

    let myPlayerId = $derived(
        hasJoined && $gameStore 
        ? Object.keys($gameStore.players).find(id => $gameStore.players[id].name === name) 
        : null
    );

    let hasAnswered = $derived(
        myPlayerId && $gameStore?.players[myPlayerId]?.answer !== null
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
            <div class="flex flex-col gap-3 items-end">
                {#each Object.values($gameStore.players) as player}
                    <div class="flex items-center bg-black/60 border-l-8 {player.answer ? 'border-green-500' : 'border-white/20'} px-5 py-2 shadow-lg">
                        <span class="text-xs uppercase font-bold {player.answer ? 'text-green-400' : 'text-white/50'}">
                            {player.name}
                        </span>
                        <span class="ml-6 font-bold text-lg">{player.score}</span>
                    </div>
                {/each}
            </div>
        </div>

        <main class="flex-1 w-full flex flex-col items-center justify-center py-10 relative">
            
            {#if $gameStore.subStatus === "pick" && $gameStore.timerEnd}
                {@const totalDuration = $gameStore.currentMode === "bombs_ticking" ? 4 : 20}
                {@const colorClass = $gameStore.currentMode === "bombs_ticking" ? 'bg-red-600 shadow-[0_0_10px_#dc2626]' : 'bg-yellow-400 '}
                
                <div class="absolute -right-4 lg:right-4 xl:right-20 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 animate-in slide-in-from-right duration-300">
                    <div class="flex flex-col gap-2 p-3 border-4 border-white/10 bg-black">
                        {#each Array(10) as _, i}
                            {@const threshold = ((9 - i) + 1) * (totalDuration / 10)}
                            <div class="w-8 h-5 border border-black transition-all duration-300 
                                {timeLeft >= threshold ? colorClass : 'bg-white/5 border-white/5'}">
                            </div>
                        {/each}
                    </div>
                    <span class="font-black text-2xl {colorClass.includes('red') ? 'text-red-600' : 'text-yellow-400'} drop-shadow-[2px_2px_0px_#000]">
                        {timeLeft.toFixed(1)}s
                    </span>
                </div>
            {/if}

            <div class="w-full flex flex-col items-center gap-12">
                {#if $gameStore.status === "waiting"}
                    <div class="text-center space-y-12">
                        <p class="text-white/40 animate-pulse uppercase text-sm tracking-[0.5em]">You don't have any more friends than that ?</p>
                        <button onclick={gameActions.start} class="{btnClass} text-xl px-20 py-6">Let's play !</button>
                    </div>

                {:else if $gameStore.status === "playing"}
                    <div class="w-full flex flex-col items-center gap-10">
                        
                        <div class="px-8 py-3 border-4 font-black italic text-sm uppercase tracking-[0.3em]
                            {$gameStore.currentMode === 'sudden_death' ? 'border-red-600 text-red-600' : ''}
                            {$gameStore.currentMode === 'bombs_ticking' ? 'border-orange-500 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : ''}
                            {$gameStore.currentMode === 'whos_next' ? 'border-blue-500 text-blue-500' : ''}
                            {$gameStore.currentMode === 'classic' ? 'border-white text-white' : ''}">
                            {#if $gameStore.currentMode === 'sudden_death'} ! Sudden death
                            {:else if $gameStore.currentMode === 'bombs_ticking'} ! Bomb's Ticking !
                            {:else if $gameStore.currentMode === 'whos_next'} ? Who's Next ?
                            {:else} Classic Mode {/if}
                        </div>

                        <p class="text-[10px] uppercase tracking-[0.5em] text-white/20">Round {$gameStore.round} / {$gameStore.maxRounds}</p>

                        {#if $gameStore.subStatus === "memorize"}
                            <div class="flex flex-col items-center gap-12 animate-in zoom-in duration-300">
                                {#if $gameStore.currentMode === 'whos_next' && $gameStore.sequenceColors}
                                    <div class="flex flex-col items-center gap-8">
                                        <p class="text-xs uppercase tracking-[0.3em] text-blue-400 italic">Use your brain, if you can...</p>
                                        <div class="flex gap-6 items-center">
                                            {#each $gameStore.sequenceColors as color, i}
                                                <div class="flex flex-col items-center gap-3">
                                                    <div class="p-2 bg-white"><div class="w-24 h-24 border-2 border-black" style="background: {color}"></div></div>
                                                    <span class="font-bold opacity-20">{i+1}</span>
                                                </div>
                                                {#if i < 2}<div class="w-4 h-1 bg-white/10"></div>{/if}
                                            {/each}
                                            <div class="w-4 h-1 bg-white/10"></div>
                                            <div class="w-24 h-24 border-4 border-dashed border-blue-500/30 flex items-center justify-center text-5xl">?</div>
                                        </div>
                                    </div>
                                {:else}
                                    <div class="p-3 bg-white shadow-[12px_12px_0px_rgba(255,255,255,0.1)]">
                                        <div class="w-72 h-72 border-4 border-black" style="background: {$gameStore.currentColor}"></div>
                                    </div>
                                    <p class="text-sm uppercase tracking-[0.4em] animate-pulse italic text-yellow-400">Don't stare at me like that !</p>
                                {/if}
                            </div>

                        {:else if $gameStore.subStatus === "pick"}
                            <div class="w-full flex flex-col items-center gap-8 animate-in fade-in duration-300">
                                {#if !hasAnswered}
                                    {#if $gameStore.currentMode === 'whos_next'}
                                        <div class="flex gap-3 items-center opacity-40 mb-4">
                                            {#each $gameStore.sequenceColors as color}
                                                <div class="w-8 h-8 border border-white/20" style="background: {color}"></div>
                                            {/each}
                                            <div class="w-8 h-8 border-2 border-dashed border-blue-500 flex items-center justify-center text-blue-500 text-xs">?</div>
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
                                        {$gameStore.currentMode === 'whos_next' ? 'The complete sequence' : 'The next color was'}
                                    </p>
                                    {#if $gameStore.currentMode === 'whos_next'}
                                        <div class="flex gap-3 items-center">
                                            {#each $gameStore.sequenceColors as color}
                                                <div class="w-12 h-12 border border-white/20" style="background: {color}"></div>
                                            {/each}
                                            <div class="w-4 h-0.5 bg-white/20"></div>
                                            <div class="p-1 bg-white">
                                                <div class="w-16 h-16 border-2 border-black" style="background: {$gameStore.currentColor}"></div>
                                            </div>
                                        </div>
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
                                            <p class="text-xs font-bold {player.name === name ? 'text-yellow-400' : 'opacity-40'} uppercase tracking-widest">{player.name}</p>
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
            <div class="fixed inset-0 bg-black/90 z- flex flex-col items-center justify-center gap-12 animate-in fade-in duration-500">
                <h2 class="text-7xl font-black italic tracking-tighter uppercase text-white drop-shadow-[6px_6px_0px_#facc15]">
                    Like a true winner
                </h2>
                <div class="bg-white/5 p-10 border-l-8 border-yellow-400 w-full max-w-md shadow-2xl">
                    <div class="space-y-6">
                        {#each Object.values($gameStore.players).sort((a,b) => b.score - a.score) as p, i}
                            <div class="flex justify-between items-center">
                                <span class="uppercase tracking-widest text-lg {i === 0 ? 'text-yellow-400' : 'text-white/60'}">
                                    {i + 1}. {p.name}
                                </span>
                                <span class="font-bold text-2xl">{p.score}</span>
                            </div>
                        {/each}
                    </div>
                </div>
                <button onclick={gameActions.start} class="{btnClass} text-xl px-16 py-6">I want more</button>
            </div>
        {/if}
    {/if}
</div>

<style>
    :global(body) { background-color: #050505; color: white; overflow-x: hidden; }
    :global(.animate-in) { animation-fill-mode: both; }
</style>