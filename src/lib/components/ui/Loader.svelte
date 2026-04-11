<script lang="ts">
  let {
    size = "md",
    count = 3,
    duration = 0.5,
    delayStep = 100,
  } = $props<{
    size?: "sm" | "md" | "lg";
    count?: number;
    duration?: number;
    delayStep?: number;
  }>();

  const dotSize = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };
</script>

<div class="flex gap-1" role="status" aria-label="Loading...">
  {#each Array.from({ length: count }) as _, i}
    <div
      class="rounded-full bg-white border-2 border-white/20 animate-bounce {dotSize[size]}"
      style="animation-duration: {duration}s; animation-delay: {i * delayStep}ms; animation-iteration-count: infinite;"
    ></div>
  {/each}
</div>