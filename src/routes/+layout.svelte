<script lang="ts">
  import "../app.css";
  let { children } = $props();
</script>

<div class="mx-auto min-h-screen w-full max-w-[900px] space-y-5">
  {@render children()}
</div>
