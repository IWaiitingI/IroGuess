<script lang="ts">
  let { mode } = $props<{
    mode: "classic" | "sudden_death" | "bombs_ticking" | "whos_next";
  }>();

  const styles = {
    sudden_death: "border-red-600 text-red-600",
    bombs_ticking: "border-orange-500 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]",
    whos_next: "border-blue-500 text-blue-500",
    classic: "border-white text-white",
  };

  const labels = {
    sudden_death: "! Sudden death",
    bombs_ticking: "! Bomb's Ticking !",
    whos_next: "? Who's Next ?",
    classic: "Classic Mode",
  };
</script>

<div class="px-8 py-3 border-4 font-black italic text-sm uppercase tracking-[0.3em] {styles[mode]}">
  {labels[mode]}
</div>