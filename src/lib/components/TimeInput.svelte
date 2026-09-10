<script lang="ts">
  type Props = {
    hour: string;
    minute: string;
    disabled?: boolean;
    onsubmit: () => void;
  };

  let { hour = $bindable(), minute = $bindable(), disabled = false, onsubmit }: Props = $props();

  // Two boxes rather than one: no punctuation to get wrong, and a number pad on
  // tablets and phones.
  const field =
    'w-24 rounded-2xl border-2 border-ink/20 bg-white px-3 py-4 text-center text-4xl ' +
    'font-semibold tabular-nums text-ink focus:border-orange focus:outline-none ' +
    'disabled:opacity-60 sm:w-28 sm:text-5xl';
</script>

<form
  class="flex items-center justify-center gap-3"
  onsubmit={(event) => {
    event.preventDefault();
    onsubmit();
  }}
>
  <label class="sr-only" for="hour-input">Hour</label>
  <input
    id="hour-input"
    class={field}
    type="text"
    inputmode="numeric"
    autocomplete="off"
    maxlength="2"
    placeholder="–"
    bind:value={hour}
    {disabled}
  />
  <span class="text-4xl font-semibold text-ink/50 sm:text-5xl">:</span>
  <label class="sr-only" for="minute-input">Minute</label>
  <input
    id="minute-input"
    class={field}
    type="text"
    inputmode="numeric"
    autocomplete="off"
    maxlength="2"
    placeholder="–"
    bind:value={minute}
    {disabled}
  />
  <button
    type="submit"
    class="ml-2 min-h-14 rounded-full bg-ink px-6 py-3 text-base font-bold text-white
           transition hover:bg-orange focus-visible:outline-3 focus-visible:outline-offset-4
           focus-visible:outline-orange disabled:opacity-40"
    disabled={disabled || hour.trim() === '' || minute.trim() === ''}
  >
    Check
  </button>
</form>
