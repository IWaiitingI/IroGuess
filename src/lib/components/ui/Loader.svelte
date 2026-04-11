<script lang="ts" module>
  import { cn } from "$lib/utils.js";
  import { type VariantProps, tv } from "tailwind-variants";
  import type { HTMLAttributes } from "svelte/elements";

  export const loaderVariants = tv({
    base: "flex gap-1",
    variants: {
      variant: {
        default: "[&>div]:bg-white [&>div]:border-white/20",
        secondary: "[&>div]:bg-black [&>div]:border-black/20",
        outline: "[&>div]:bg-transparent [&>div]:border-white/40",
      },
      size: {
        sm: "[&>div]:w-2 [&>div]:h-2",
        md: "[&>div]:w-3 [&>div]:h-3",
        lg: "[&>div]:w-4 [&>div]:h-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  });

  export type LoaderVariant = VariantProps<typeof loaderVariants>["variant"];
  export type LoaderSize = VariantProps<typeof loaderVariants>["size"];
  export type LoaderProps = HTMLAttributes<HTMLDivElement> & {
    variant?: LoaderVariant;
    size?: LoaderSize;
    count?: number;
    duration?: number;
    delayStep?: number;
  };
</script>

<script lang="ts">
  let {
    class: className,
    variant = "default",
    size = "md",
    count = 3,
    duration = 0.5,
    delayStep = 100,
    ...restProps
  }: LoaderProps = $props();
</script>

<div
  data-slot="loader"
  class={cn(loaderVariants({ variant, size }), "retro-loader", className)}
  role="status"
  aria-label="Loading..."
  {...restProps}
>
  {#each Array.from({ length: count }) as _, i}
    <div
      class="border-2 pixel-dot"
      style="animation-duration: {duration}s; animation-iteration-count: infinite; animation-delay: {i * delayStep}ms;"
    ></div>
  {/each}
</div>

<style>
  .retro-loader {
    image-rendering: pixelated;
    gap: 4px;
  }

  .pixel-dot {
    border-radius: 0;
    animation-name: pixel-bounce;
    animation-timing-function: steps(4, end);
  }

  @keyframes pixel-bounce {
    0%   { transform: translateY(0);    opacity: 1; }
    25%  { transform: translateY(-8px); opacity: 1; }
    50%  { transform: translateY(-4px); opacity: 0.6; }
    75%  { transform: translateY(-8px); opacity: 1; }
    100% { transform: translateY(0);    opacity: 1; }
  }
</style>