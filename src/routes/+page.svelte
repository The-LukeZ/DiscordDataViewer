<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import DataViewer from "$lib/components/DataViewer.svelte";

  let { data } = $props();
  let loading = $state(false);
  let reason = $state<LoggedOutReason | null>(null);
  let reasonText = $derived.by(() => {
    switch (reason) {
      case "session_expired":
        return "Your session has expired. Please log in again.";
      case "logout":
        return "You have been logged out successfully.";
      default:
        return reason;
    }
  });

  $effect(() => {
    const _reason = data.reason;
    if (_reason) {
      reason = structuredClone(_reason);
      goto("/");
    }
  });
</script>

{#if !data.loggedIn}
  <div class="flex h-full grow flex-col items-center justify-center gap-4">
    {#if reason}
      <div class="alert alert-info">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-info-icon lucide-info"
          ><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg
        >
        <span>{reasonText}</span>
      </div>
    {/if}
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
