<script lang="ts">
  import { enhance } from "$app/forms";
  import DataViewer from "$lib/components/DataViewer.svelte";

  let { data } = $props();
  let loading = $state(false);
</script>

{#if !data.loggedIn}
  <div class="grid h-screen place-items-center">
    <div class="card bg-base-300 w-96 shadow-sm">
      <div class="card-body items-center">
        <h2 class="card-title">Log in with Discord</h2>
        <form
          action="?/login"
          method="POST"
          use:enhance={() => {
            loading = true;
            return async ({ update, result }) => {
              console.log("Form submitted", result);
              await update();
              if (result.type === "success" && result.data) {
                open(result.data.url as string, "_self");
              } else {
                console.error("Error during login");
              }
              loading = false;
            };
          }}
        >
          <button type="submit" class="btn btn-primary" disabled={loading}
            >Log in with Discord</button
          >
        </form>
      </div>
    </div>
  </div>
{:else}
  <DataViewer />
{/if}
