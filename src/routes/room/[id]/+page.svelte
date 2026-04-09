<script lang="ts">
    import { page } from '$app/stores';
    import { gameStore, gameActions } from '$lib/stores/game';
    import ColorPicker from '$lib/components/game/ColorPicker.svelte';
    import { onDestroy } from 'svelte';

    const roomId = $page.params.id;
    let name = $state("");
    let hasJoined = $state(false);
    let timeLeft = $state(0);

    const btnClass = "border border-white/20 px-6 py-2 uppercase tracking-[0.3em] text-[10px] hover:bg-white hover:text-black transition-all duration-300";

    function handleJoin() {
        if (name.length < 2) return;
        gameActions.connect(roomId, name);
        hasJoined = true;
    }

    // Gestion du timer visuel (uniquement pour Bombe et Classic/Sudden)
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

    onDestroy(() => gameActions.leave());
</script>

<div class="w-full max-w-3xl px-6 flex flex-col items-center min-h-screen">
    {#if !hasJoined}
        <div class="flex flex-col items-center gap-6 mt-20">
            <h1 class="text-2xl font-light tracking-[0.5em] uppercase">Ton Pseudo</h1>
            <input 
                bind:value={name} 
                onkeydown={(e) => e.key === 'Enter' && handleJoin()}
                class="bg-transparent border-b border-white/20 py-2 text-center text-2xl outline-none focus:border-white transition-colors"
                autofocus
            />
            <button onclick={handleJoin} class="{btnClass} mt-4">Rejoindre</button>
        </div>
    {:else if $gameStore}
        <div class="fixed top-8 left-8 right-8 flex justify-between items-start pointer-events-none z-50">
            <div class="text-[10px] opacity-30 uppercase tracking-widest">Room: {roomId}</div>
            <div class="flex flex-col gap-2 items-end">
                {#each Object.values($gameStore.players) as player}
                    <div class="text-right">
                        <span class="text-xs uppercase tracking-tighter {player.answer ? 'text-green-400' : 'text-white/50'}">
                            {player.name}
                        </span>
                        <span class="ml-3 font-mono text-sm">{player.score}</span>
                    </div>
                {/each}
            </div>
        </div>

        {#if $gameStore.subStatus === "pick" && $gameStore.timerEnd}
            {@const maxTime = $gameStore.currentMode === "bombs_ticking" ? 4 : 10}
            {@const color = $gameStore.currentMode === "bombs_ticking" ? 'bg-red-600' : 'bg-white/40'}
            <div class="fixed right-6 sm:right-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 animate-in slide-in-from-right duration-300">
                <div class="w-1 h-64 bg-white/5 rounded-full relative overflow-hidden">
                    <div class="absolute bottom-0 left-0 w-full transition-all duration-100 {color}" 
                         style="height: {(timeLeft / maxTime) * 100}%"></div>
                </div>
                <span class="font-mono {$gameStore.currentMode === 'bombs_ticking' ? 'text-red-500 font-bold' : 'opacity-40'} text-lg">{timeLeft.toFixed(1)}s</span>
            </div>
        {/if}

        <main class="mt-32 w-full flex flex-col items-center">
            {#if $gameStore.status === "waiting"}
                <div class="text-center space-y-8">
                    <p class="text-white/40 animate-pulse uppercase text-xs tracking-[0.3em]">En attente de joueurs...</p>
                    <button onclick={gameActions.start} class="{btnClass} py-4 px-12">Commencer la partie</button>
                </div>

            {:else if $gameStore.status === "playing"}
                <div class="w-full flex flex-col items-center gap-8">
                    
                    <div class="flex flex-col items-center gap-2">
                         <div class="px-4 py-1 rounded-full border transition-all duration-300
                            {$gameStore.currentMode === 'sudden_death' ? 'border-red-500/50 bg-red-500/10' : ''}
                            {$gameStore.currentMode === 'bombs_ticking' ? 'border-orange-500/50 bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : ''}
                            {$gameStore.currentMode === 'whos_next' ? 'border-blue-500/50 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : ''}
                            {$gameStore.currentMode === 'classic' ? 'border-white/10' : ''}">
                            
                            <span class="text-[10px] uppercase tracking-[0.3em] font-bold">
                                {#if $gameStore.currentMode === 'sudden_death'} ⚠️ Mort Subite
                                {:else if $gameStore.currentMode === 'bombs_ticking'} 💣 Bomb's Ticking !
                                {:else if $gameStore.currentMode === 'whos_next'} 🧠 Who's Next ?
                                {:else} Mode Classique {/if}
                            </span>
                        </div>
                        <p class="text-[10px] uppercase tracking-[0.5em] text-white/20">Round {$gameStore.round} / {$gameStore.maxRounds}</p>
                    </div>

                    {#if $gameStore.subStatus === "memorize"}
                        <div class="flex flex-col items-center gap-12 py-4 animate-in zoom-in duration-300">
                            {#if $gameStore.currentMode === 'whos_next' && $gameStore.sequenceColors}
                                <div class="flex flex-col items-center gap-6">
                                    <p class="text-xs uppercase tracking-[0.3em] text-blue-400">Analyse la suite logique</p>
                                    <div class="flex gap-4 sm:gap-6 items-center">
                                        {#each $gameStore.sequenceColors as color, i}
                                            <div class="flex flex-col items-center gap-3">
                                                <div class="w-20 h-20 sm:w-28 sm:h-28 rounded-xl border-2 border-white/5 transition-all" style="background: {color}"></div>
                                                <span class="font-mono text-xl opacity-20">{i+1}</span>
                                            </div>
                                            {#if i < 2}
                                                <div class="w-4 h-0.5 bg-white/10 rounded-full"></div>
                                            {/if}
                                        {/each}
                                        <div class="w-4 h-0.5 bg-white/10 rounded-full"></div>
                                        <div class="w-20 h-20 sm:w-28 sm:h-28 rounded-xl border-2 border-dashed border-blue-500/30 flex items-center justify-center text-4xl text-blue-500/30">?</div>
                                    </div>
                                    <p class="text-sm uppercase tracking-[0.4em] animate-pulse italic mt-4">Devine la 4ème couleur...</p>
                                </div>
                            {:else}
                                <div class="w-64 h-64 rounded-full shadow-[0_0_50px_rgba(255,255,255,0.1)] scale-110" 
                                     style="background: {$gameStore.currentColor}">
                                </div>
                                <p class="text-sm uppercase tracking-[0.4em] animate-pulse italic">Mémorise...</p>
                            {/if}
                        </div>

                    {:else if $gameStore.subStatus === "pick"}
                        <div class="flex flex-col items-center gap-8 w-full animate-in fade-in duration-300">
                            {#if $gameStore.currentMode === 'whos_next'}
                                <div class="flex gap-3 items-center opacity-50 mb-4 scale-90">
                                    {#each $gameStore.sequenceColors as color}
                                        <div class="w-10 h-10 rounded-md border border-white/10" style="background: {color}"></div>
                                    {/each}
                                    <div class="w-4 h-0.5 bg-white/10 rounded-full"></div>
                                    <div class="w-10 h-10 rounded-md border border-dashed border-blue-500/50 flex items-center justify-center text-blue-500/50">?</div>
                                </div>
                            {:else}
                                <div class="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center opacity-20">
                                    <span class="text-2xl">?</span>
                                </div>
                            {/if}
                            <ColorPicker onSelect={(color) => gameActions.sendAnswer(color)} />
                        </div>

                    {:else if $gameStore.subStatus === "review"}
                        <div class="flex flex-col items-center gap-12 w-full animate-in fade-in duration-700">
                            <div class="flex flex-col items-center gap-4">
                                <p class="text-[10px] uppercase tracking-[0.5em] text-white/30">
                                    {$gameStore.currentMode === 'whos_next' ? 'La 4ème couleur était' : 'Couleur Cible'}
                                </p>
                                <div class="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)]" 
                                     style="background: {$gameStore.currentColor}"></div>
                            </div>

                            <div class="w-full h-px bg-white/5"></div>

                            <div class="flex flex-wrap justify-center gap-8 w-full">
                                {#each Object.values($gameStore.players) as player}
                                    <div class="flex flex-col items-center gap-3">
                                        <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-white/10" 
                                             style="background: {player.answer || '#111'}"></div>
                                        <p class="text-[10px] uppercase tracking-widest {player.name === name ? 'text-blue-400 font-bold' : 'opacity-60'}">
                                            {player.name}
                                        </p>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {/if}
                </div>

            {:else if $gameStore.status === "results"}
                <div class="text-center space-y-8 animate-in fade-in duration-1000">
                    <h2 class="text-5xl font-bold tracking-tighter uppercase">Tableau des scores</h2>
                    <div class="space-y-4">
                        {#each Object.values($gameStore.players).sort((a,b) => b.score - a.score) as p}
                            <div class="flex justify-between w-64 border-b border-white/10 pb-2 mx-auto">
                                <span class="uppercase tracking-widest text-sm">{p.name}</span>
                                <span class="font-mono font-bold">{p.score}</span>
                            </div>
                        {/each}
                    </div>
                    <button onclick={gameActions.start} class="{btnClass} px-10 mt-8">Lancer une revanche</button>
                </div>
            {/if}
        </main>
    {/if}
</div>

<style>
    /* Correction pour s'assurer que Tailwind charge les animations fade-in/out */
    :global(.animate-in) {
        animation-fill-mode: both;
    }
</style>