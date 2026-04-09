<script lang="ts">
  import "$lib/app.css";
  let { children } = $props();
</script>

<div class="min-h-screen bg-black text-white flex flex-col items-center justify-center">
  {@render children()} 
</div>