<script lang="ts">
  import "../app.css";
  let { children } = $props();
</script>

<div class="mx-auto min-h-screen w-full max-w-[900px] px-4">
  <main class="mx-auto flex w-full grow flex-col space-y-5">
    {@render children()}
  </main>
  <footer
    class="bg-neutral text-neutral-content shadow-base-300 flex w-full items-center rounded-lg p-4 shadow-lg"
  >
    <nav class="flex w-full flex-row justify-between gap-4">
      <div>
        Made by <a
          href="https://github.com/The-LukeZ"
          target="_blank"
          class="link-link-hover link-primary"
        >
          LukeZ
        </a>
      </div>
      <div class="tooltip tooltip-primary tooltip-left" data-tip="GitHub Repository">
        <a
          href="https://github.com/The-LukeZ/DiscordDataViewer"
          target="_blank"
          aria-label="GitHub Repository"
        >
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
            class="hover:text-primary text-primary/70"
          >
            <path
              d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
            />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
        </a>
      </div>
    </nav>
  </footer>
</div>
