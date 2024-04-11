<script lang="ts">
    import Modal from '$lib/components/generic/Modal.svelte';
    import { t } from '$lib/translations';

    function clearLocalStorage() {
        localStorage.clear();
        window.location.reload();
    }
</script>

<div>
    <h3 class="mb-4 text-xl font-semibold">
        {$t('Settings.ClearStorage.Clear Storage')}
    </h3>
    <div class="flex">
        <div class="flex-1 m-auto">
            {$t('Settings.ClearStorage.Removes all data stored')}
        </div>
        <div class="flex flex-row items-center justify-center w-48 gap-2">
            <Modal>
                <button
                    class="btn btn-error"
                    slot="modal-button"
                >
                    {$t('Settings.ClearStorage.Clear')}
                </button>
                <div
                    class="max-w-5xl w-full"
                    slot="modal-body"
                >
                    <h3 class="text-xl font-bold underline">
                        {$t('Settings.ClearStorage.Are You Sure?')}
                    </h3>
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
                            <button class="ml-2 btn">{$t('Settings.ClearStorage.Close')}</button>
                        </form>
                    </div>
                </div>
            </Modal>
        </div>
    </div>
</div>
