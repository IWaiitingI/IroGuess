<script lang="ts">
  import { goto } from "$app/navigation";
  import { nanoid } from "nanoid";

  function createRoom() {
    const id = nanoid(8);
    goto(`/room/${id}`);
  }

  // Style de bouton
  const btnClass = "group relative w-full py-4 text-center text-xs font-bold tracking-[0.2em] uppercase transition-all duration-75 active:translate-y-1 active:shadow-none";
</script>

<main class="flex flex-col items-center justify-center min-h-[80vh] gap-16 font-mono">
  
  <div class="flex flex-col items-center gap-6">
    <div class="relative">
      <h1 class="text-7xl sm:text-8xl font-black tracking-tighter uppercase italic text-white drop-shadow-[6px_6px_0px_#facc15]">
        IroGuess
      </h1>
    </div>
    
    <div class="bg-white/10 px-4 py-1 border-l-4 border-yellow-400">
        <p class="text-yellow-400 text-[10px] uppercase tracking-[0.3em] animate-pulse">
            Crush your friends... or at least try
        </p>
    </div>
  </div>

  <div class="flex flex-col gap-6 w-72">

    <button onclick={createRoom} class="{btnClass} bg-yellow-400 text-black border-b-4 border-r-4 border-yellow-700 shadow-none">
      [ 2 ] Multiplayer
    </button>

    <div class="mt-8 flex justify-center gap-4 opacity-20">
        <div class="w-2 h-2 bg-white"></div>
        <div class="w-2 h-2 bg-white"></div>
        <div class="w-2 h-2 bg-white"></div>
    </div>
  </div>

  <div class="fixed bottom-8 text-[8px] uppercase tracking-[0.5em] text-white/10">
    Insert Coin to Continue • © 2026 IroGuess System
  </div>
</main>

<style>
    :global(body) {
        background-color: #000; /* Assure un noir profond */
        overflow-x: hidden;
    }
</style>