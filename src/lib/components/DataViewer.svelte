<script lang="ts">
  import { parseIconToURL } from "$lib";
  import type {
    APIUser,
    RESTGetAPICurrentUserGuildsResult,
    RESTAPIPartialCurrentUserGuild,
  } from "discord-api-types/v10";
  import { fade } from "svelte/transition";

  // Use this component when the user is logged in

  const copyFieldsLabels: Record<keyof RESTAPIPartialCurrentUserGuild, string> = {
    id: "ID",
    name: "Name",
    icon: "Icon",
    banner: "Banner",
    owner: "Owner",
    features: "Features",
    permissions: "Permissions",
    approximate_member_count: "Approximate Member Count",
    approximate_presence_count: "Approximate Presence Count",
  };

  const userFieldsLabels = {
    id: "ID",
    username: "Username",
    discriminator: "Discriminator",
    avatar: "Avatar URL",
    banner: "Banner URL",
    locale: "Locale",
    global_name: "Global Name (Display Name)",
    accent_color: "Banner Color",
    primaryGuildTag: "Primary Guild Tag",
    primaryGuildId: "Primary Guild ID",
    created: "Created At",
  };

  // What guild fields to copy
  const copyFields = $state<Record<keyof RESTAPIPartialCurrentUserGuild, boolean>>({
    id: true,
    name: true,
    icon: true,
    banner: true,
    owner: true,
    features: true,
    permissions: true,
    approximate_member_count: true,
    approximate_presence_count: true,
  });

  let user = $state<APIUser | null>(null);
  let guilds = $state<RESTGetAPICurrentUserGuildsResult>([]);
  let selectedGuild = $state<RESTAPIPartialCurrentUserGuild | null>(null);
  let jsonDialog: HTMLDialogElement;
  let copyDialog: HTMLDialogElement;

  function placeholderIcon(guild: RESTAPIPartialCurrentUserGuild): string {
    return guild.name
      .split(" ")
      .slice(0, 1)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  }

  async function fetchUser() {
    try {
      const response = await fetch("/api/user");
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      user = await response.json();
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  async function fetchGuilds() {
    try {
      const response = await fetch("/api/user/guilds");
      if (!response.ok) {
        throw new Error("Failed to fetch guilds");
      }
      guilds = await response.json();
    } catch (error) {
      console.error("Error fetching guilds:", error);
    }
  }

  function openCopyModal() {
    copyDialog.showModal();
  }

  function copyGuildsData() {
    const selectedFields = Object.entries($state.snapshot(copyFields))
      .filter(([, value]) => value)
      .map(([key]) => key);

    const dataToCopy = guilds.map((guild) => {
      const copiedData: Record<string, any> = {};
      selectedFields.forEach((field) => {
        copiedData[field] = guild[field as keyof RESTAPIPartialCurrentUserGuild];
      });
      return copiedData;
    });

    if (dataToCopy.length === 0) {
      console.warn("No fields selected for copying.");
      return;
    }

    const jsonData = JSON.stringify(dataToCopy, null, 2);
    navigator.clipboard
      .writeText(jsonData)
      .then(() => {
        console.log("Guilds data copied to clipboard");
        alert("✅ Guilds data copied to clipboard!");
        copyDialog.close();
      })
      .catch((error) => {
        console.error("Failed to copy guilds data:", error);
      });
  }
</script>

<div class="flex h-full w-full flex-col gap-4 p-2.5 sm:p-5">
  <!-- Controls -->
  <div class="flex w-full flex-row flex-wrap items-center justify-center gap-2">
    <button class="btn btn-primary" onclick={fetchUser}>Fetch User</button>
    <button class="btn btn-primary" onclick={fetchGuilds}>Fetch Guilds</button>
    {#if guilds.length > 0}
      <button class="btn btn-primary" onclick={openCopyModal}>Copy Guilds Data</button>
    {/if}
  </div>
</div>

<div class="bg-base-200 border-base-300 collapse overflow-x-auto border">
  <input type="checkbox" />
  <div class="collapse-title font-semibold">User Information</div>
  {#if !user}
    <div class="collapse-content">
      <ul class="list bg-base-100 rounded-box shadow-md">
        <li class="p-4 text-gray-500">User data not loaded. Click "Fetch User" to load.</li>
      </ul>
    </div>
  {:else}
    <!-- TODO: Add support for avatar decoration -->
    <div class="collapse-content gap-2" transition:fade>
      <div class="card bg-base-100 mb-2">
        <div class="card-body flex flex-row items-center gap-4">
          <img
            src={parseIconToURL(user.avatar, user.id, "user")}
            alt="User Avatar"
            class="h-16 w-16 rounded-full"
          />
          <div class="flex flex-col">
            <h2 class="card-title">{user.username}</h2>
            <span class="text-sm text-gray-500">#{user.discriminator}</span>
            <span class="text-sm text-gray-500">{user.id}</span>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-2 space-y-1">
        <p class="font-bold">Global Name:</p>
        <p>{user.global_name || user.username}</p>
        <p class="font-bold">Locale:</p>
        <p>{user.locale}</p>
        <p class="font-bold">Accent Color:</p>
        <div class="inline-flex gap-1">
          <div class="h-6 w-6 overflow-clip rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <rect
                width="100%"
                height="100%"
                fill={user.accent_color
                  ? `#${user.accent_color.toString(16).padStart(6, "0")}`
                  : "transparent"}
              />
            </svg>
          </div>
          <p>
            {user.accent_color ? `#${user.accent_color.toString(16).padStart(6, "0")}` : "None"}
          </p>
        </div>
        <p class="font-bold">Primary Guild Tag:</p>
        {#if user.primary_guild}
          <p>{user.primary_guild.tag}</p>
          <p class="font-bold">Primary Guild ID</p>
          <p class="text-sm text-gray-500">{user.primary_guild.identity_guild_id}</p>
        {:else}
          <p class="text-sm text-gray-500">No primary guild set</p>
        {/if}
      </div>
    </div>
  {/if}
</div>

<div class="bg-base-200 border-base-300 collapse overflow-x-auto border">
  <input type="checkbox" />
  <div class="collapse-title font-semibold">Your Guilds</div>
  <div class="collapse-content">
    <ul class="list bg-base-100 rounded-box shadow-md">
      {#if guilds.length === 0}
        <li class="p-4 text-gray-500">No guilds found. Click "Fetch Guilds" to load.</li>
      {:else}
        {#each guilds as guild (guild.id)}
          {@const guildIconUrl = parseIconToURL(guild.icon, guild.id, "guild")}
          <li class="list-row">
            <div>
              {#if guildIconUrl}
                <img class="rounded-box size-10" src={guildIconUrl} alt="Guild Icon" />
              {:else}
                <div class="rounded-box flex size-10 items-center justify-center bg-gray-200">
                  <span class="text-gray-500">{placeholderIcon(guild)}</span>
                </div>
              {/if}
            </div>
            <div>
              <div>{guild.name}</div>
              <div class="text-xs font-semibold uppercase opacity-60">{guild.id}</div>
            </div>
            <button
              class="btn btn-outline"
              onclick={() => {
                selectedGuild = guild;
                jsonDialog.showModal();
              }}>See JSON</button
            >
          </li>
        {/each}
      {/if}
    </ul>
  </div>
</div>

<dialog bind:this={jsonDialog} id="json-dialog" class="modal">
  <div class="modal-box flex max-h-screen w-full max-w-[700px] flex-col gap-2">
    <h3 class="text-lg font-bold">Guild JSON</h3>
    <div class="mockup-code w-full overflow-y-auto">
      <pre><code>{JSON.stringify(selectedGuild || {}, null, 2)}</code></pre>
    </div>
    <div class="modal-action cursor-default">
      <form method="dialog" class="gap-2">
        <button class="btn btn-secondary">Close</button>
      </form>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<dialog bind:this={copyDialog} id="copy-dialog" class="modal">
  <div class="modal-box">
    <h3 class="text-lg font-bold">Copy Guilds Data</h3>
    <fieldset class="fieldset space-y-1">
      <legend class="fieldset-legend">Select the fields you want to copy</legend>
      <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {#each Object.entries(copyFieldsLabels) as [key, label]}
          <label class="label text-sm">
            <input
              type="checkbox"
              bind:checked={copyFields[key as keyof typeof copyFields]}
              class="checkbox checkbox-lg"
              id={key}
            />
            {label}
          </label>
        {/each}
      </div>
    </fieldset>
    <div class="modal-action">
      <form method="dialog" class="gap-2">
        <button class="btn btn-secondary">Close</button>
        <button
          class="btn btn-primary"
          onclick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            copyGuildsData();
            copyDialog.close();
          }}
        >
          Copy
        </button>
      </form>
    </div>
  </div>
</dialog>
