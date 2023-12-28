<script lang="ts">
    import TypesenseSearch from '$lib/components/search/TypesenseSearch.svelte';
    import { t } from '$lib/translations';
</script>

<TypesenseSearch
    collection="staff"
    searchPlaceholder={$t('Staff.Search.Enter name or description')}
    let:hit
>
    <div class="flex gap-4 mt-8 mb-4">
        <div class="m-auto w-1/6">
            <a href="/staff/{hit.document.email}">
                <img
                    class="w-full aspect-staff-photo object-cover object-center"
                    src={hit.document.profile_pic_url}
                    alt={hit.document.title}
                />
            </a>
        </div>
        <div class="w-5/6 text-sm">
            <a
                href="/staff/{hit.document.email}"
                class="text-primary text-xl"
            >
                {@html hit.highlight.title ? hit.highlight.title.snippet : hit.document.title}
            </a>
            <div>{hit.document.tag}</div>
            <div class="divider mt-0 mb-2" />
            <div>
                {#if hit.document.description !== ''}
                    {@html hit.highlight.description
                        ? hit.highlight.description.snippet
                        : hit.document.description}
                {:else}
                    {$t('Staff.Search.No description provided')}
                {/if}
            </div>
            <div class="mt-4">
                <div class="font-semibold">Appointments:</div>
                {#each hit.document.appointments as appointment}
                    <div>{appointment}</div>
                {/each}
            </div>
        </div>
    </div>
</TypesenseSearch>
