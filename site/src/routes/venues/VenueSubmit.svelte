<script lang="ts">
    import { t } from '$lib/translations';
    import Modal from '$lib/components/generic/Modal.svelte';
    import Map from '$lib/components/generic/Map.svelte';

    export let venueName: string;
</script>

<div class="flex flex-col justify-center max-w-full gap-3">
    <span class="text-center">
        {$t('Venues.Submit.This venue is currently unmapped in our database')}
    </span>
    <div class="text-center">
        <Modal>
            <button
                class="btn btn-sm btn-primary"
                slot="modal-button"
            >
                {$t('Venues.Submit.Submit venue location')}
            </button>
            <div
                class="w-full"
                slot="modal-body"
            >
                <h3 class="text-xl font-bold underline">
                    {$t('Venues.Submit.Mapping venue', { venueName })}
                </h3>
                <div class="flex flex-wrap justify-center gap-x-8 gap-y-6">
                    <div class="flex-none flex-grow-0 w-[40%] max-w-[40%]">
                        <div class="label">
                            <span class="label-text">
                                {$t('Venues.Submit.Floor')}
                            </span>
                        </div>
                        <input
                            type="number"
                            placeholder="{$t("Venues.Submit.Use negatives for basement")}"
                            class="input input-bordered w-full max-w-xs"
                        />
                    </div>
                    <div class="flex-none flex-grow-0 w-[45%] max-w-[45%]">
                        <div class="label">
                            <span class="label-text">
                                {$t('Venues.Submit.Comments')}
                            </span>
                        </div>
                        <input
                            type="text"
                            placeholder="{$t("Venues.Submit.Anything to note about the venue")}"
                            class="input input-bordered w-full max-w-xs"
                        />
                    </div>
                    <div class="w-full h-[28rem]">
                        <Map ctrlScroll={true}/>
                    </div>
                </div>
                <div class="modal-action">
                    <form method="dialog">
                        <button class="btn btn-success">
                            {$t('Venues.Submit.Submit')}
                        </button>
                        <button class="ml-2 btn">{$t('Settings.ClearStorage.Close')}</button>
                    </form>
                </div>
            </div>
        </Modal>
    </div>
</div>
