<script lang="ts">
  import { goto } from "$app/navigation";
  import { nanoid } from "nanoid";

  function createRoom() {
    const id = nanoid(8);
    goto(`/room/${id}`);
  }

  // Classe réutilisable pour tes boutons
  const btnClass = "w-full py-3 text-center text-sm tracking-widest border border-white/20 hover:border-white/60 hover:bg-white/5 transition-all rounded-sm uppercase";
</script>

<main class="flex flex-col items-center gap-12">
  <div class="flex flex-col items-center gap-3">
    <h1 class="text-6xl font-bold tracking-tight">color.</h1>
    <p class="text-white/40 text-sm">teste ta mémoire des couleurs</p>
  </div>

  <div class="flex flex-col gap-3 w-64">
    <a href="/solo" class={btnClass}>solo</a>
    <a href="/daily" class={btnClass}>daily</a>
    <button onclick={createRoom} class={btnClass}>multijoueur</button>
  </div>
</main>