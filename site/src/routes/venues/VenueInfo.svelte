<script lang="ts">
    import { t } from '$lib/translations';
    import NewTabLink from '$lib/components/generic/NewTabLink.svelte';
    import Timetable from '$lib/components/timetable/Timetable.svelte';
    import { activeSemester } from '$lib/stores';
    import type { Venue } from '$lib/types/Firebase';

    export let activeVenueName = '';
    let activeVenue: Venue | undefined;
    let issueTitle = '';

    $: activeVenueName && getVenueLessons(activeVenueName);

    async function getVenueLessons(venue: string) {
        const res = await fetch('/search/firebase/venue', {
            method: 'POST',
            body: JSON.stringify({ venue, semesterId: $activeSemester.id })
        });

        if (!res.ok) return -1;

        try {
            activeVenue = await res.json();
            issueTitle = `Issue with venue ${activeVenue?.name}`;
        } catch (ex) {
            activeVenue = undefined;
            return -1;
        }
    }
</script>

{#if activeVenueName === ''}
    lol
{:else if activeVenue !== undefined}
    <div class="flex flex-col justify-center gap-4">
        <Timetable lessons={activeVenue.lessons} />
        <div class="flex justify-center">
            <NewTabLink
                class="btn btn-sm btn-neutral w-fit"
                url="https://github.com/Benjababe/ntumoons/issues/new?title={issueTitle}"
                text={$t('Venues.Report Inaccurate Information')}
            ></NewTabLink>
        </div>
    </div>
{/if}
