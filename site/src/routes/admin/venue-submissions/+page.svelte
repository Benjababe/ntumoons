<script lang="ts">
    import Map from '$lib/components/generic/Map.svelte';
    import { t } from '$lib/translations';
    import type { VenueSubmissionStored } from '$lib/types/Venue';
    import { onMount } from 'svelte';

    let submissions: VenueSubmissionStored[] = [];
    let activeSubmissionIdx: number = -1;
    let activeSubmission: VenueSubmissionStored;

    onMount(async () => {
        submissions = (await (
            await fetch('/search/firebase/venue-submissions')
        ).json()) as VenueSubmissionStored[];
    });

    function updateActiveSubmission() {
        if (activeSubmissionIdx === -1) return;
        activeSubmission = submissions[activeSubmissionIdx];
    }

    function approveVenueSubmission() {}

    function rejectVenueSubmission() {}
</script>

<div class="flex flex-col gap-y-8 items-center">
    {#if submissions.length > 0}
        <div class="max-w-[30rem]">
            <select
                class="select w-full text-2xl bg-base-200"
                bind:value={activeSubmissionIdx}
                on:change={updateActiveSubmission}
            >
                <option
                    value="-1"
                    disabled
                >
                    {$t('Admin.Venue Submissions.Select Venue')}
                </option>
                {#each submissions as submission, i}
                    <option value={i}>{submission.venue}</option>
                {/each}
            </select>
        </div>

        {#if activeSubmission}
            {@const marker = { lat: activeSubmission.lat, lng: activeSubmission.lng }}
            <div class="w-3/4 max-w-screen-xl">
                <div class="text-3xl font-bold">{activeSubmission.venue}</div>
            </div>
            <div class="w-3/4 max-w-screen-xl h-[30rem] flex gap-x-8">
                <div class="h-full w-full">
                    {#key marker}
                        <Map
                            ctrlScroll={true}
                            markers={[marker]}
                            initView={marker}
                        />
                    {/key}
                </div>
                <div class="h-full min-w-48 flex flex-col gap-y-6 text-lg">
                    <div class="bg-base-200 p-4 rounded-lg flex justify-evenly">
                        <span class="font-semibold">{$t('Admin.Venue Submissions.Floor')}:</span>
                        <span>{activeSubmission.floor}</span>
                    </div>
                    <div class="bg-base-200 p-4 rounded-lg h-full">
                        {#if activeSubmission.comments.length > 0}
                            <span class="font-semibold"
                                >{$t('Admin.Venue Submissions.Comments')}:</span
                            >
                            <div>{activeSubmission.comments}</div>
                        {:else}
                            <div class="font-bold">
                                {$t('Admin.Venue Submissions.No comments')}
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
            <div class="flex gap-x-8">
                <button
                    on:click={approveVenueSubmission}
                    class="btn btn-success"
                >
                    {$t('Admin.Venue Submissions.Approve')}
                </button>
                <button
                    on:click={rejectVenueSubmission}
                    class="btn btn-error"
                >
                    {$t('Admin.Venue Submissions.Reject')}
                </button>
            </div>
        {/if}
    {:else}
        <div>Loading...</div>
    {/if}
</div>
