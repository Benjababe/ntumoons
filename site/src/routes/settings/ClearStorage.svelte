<script lang="ts">
    import { t } from '$lib/translations';

    let dialog: HTMLDialogElement;

    function clearBtnPress() {
        dialog.showModal();
    }

    function clearLocalStorage() {
        localStorage.clear();
        window.location.reload();
    }
</script>

<div>
    <h3 class="text-xl font-semibold mb-4">
        {$t('Settings.ClearStorage.Clear Storage')}
    </h3>
    <div class="flex">
        <div class="flex-1 m-auto">
            {$t('Settings.ClearStorage.Removes all data stored')}
        </div>
        <div class="flex flex-row gap-2 items-center justify-center w-48">
            <button
                class="btn btn-error"
                on:click|preventDefault={clearBtnPress}
            >
                {$t('Settings.ClearStorage.Clear')}
            </button>
        </div>
    </div>
</div>

<dialog
    class="modal modal-bottom sm:modal-middle"
    bind:this={dialog}
>
    <div class="modal-box w-44 max-w-5xl">
        <h3 class="font-bold text-xl underline">{$t('Settings.ClearStorage.Are You Sure?')}</h3>
        <p class="py-4">
            {$t('Settings.ClearStorage.All your data will be wiped')}
        </p>
        <div class="modal-action">
            <form method="dialog">
                <button
                    class="btn btn-error"
                    on:click={clearLocalStorage}
                >
                    {$t('Settings.ClearStorage.Clear')}
                </button>
                <button class="btn ml-2">{$t('Settings.ClearStorage.Close')}</button>
            </form>
        </div>
    </div>
    <form
        method="dialog"
        class="modal-backdrop"
    >
        <button class="cursor-default">Close but this shouldn't be seen xd</button>
    </form>
</dialog>
