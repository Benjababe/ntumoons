<script lang="ts">
    import sanitizeHtml from 'sanitize-html';
    import { t } from '$lib/translations';
    import StaffFallbackImage from '$lib/assets/images/StaffFallbackImage.svelte';
    import NewTab from '$lib/assets/images/NewTab.svelte';
    import TypesenseSearch from '$lib/components/search/TypesenseSearch.svelte';
    import type { SearchResponseHit } from 'typesense/lib/Typesense/Documents';
    import type { StaffDoc } from '$lib/types/Typesense';

    let hits: SearchResponseHit<StaffDoc>[] = [];
</script>

<TypesenseSearch
    collection="staff"
    searchPlaceholder={$t('Staff.Search.Enter name or description')}
    bind:staffHits={hits}
>
    <div slot="results">
        {#each hits as hit}
            <div class="flex gap-4 mt-8 mb-4">
                <div class="m-auto w-1/6">
                    <a
                        href="/staff/{hit.document.email}"
                        target="_blank"
                    >
                        {#if hit.document.profile_pic_url}
                            <img
                                class="w-full aspect-staff-photo object-cover object-center rounded-md"
                                src={hit.document.profile_pic_url}
                                alt={hit.document.title}
                            />
                        {:else}
                            <div class="w-full object-cover object-center rounded-xl">
                                <StaffFallbackImage class="fill-neutral" />
                            </div>
                        {/if}
                    </a>
                </div>
                <div class="w-5/6 text-sm">
                    <a
                        href="/staff/{hit.document.email}"
                        target="_blank"
                        class="flex items-center gap-x-1 fill-primary text-primary text-xl"
                    >
                        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                        {@html hit.highlight.title && hit.highlight.title.snippet
                            ? sanitizeHtml(hit.highlight.title.snippet)
                            : sanitizeHtml(hit.document.title)}
                        <NewTab />
                    </a>
                    <div>{hit.document.tag}</div>
                    <div class="divider mt-0 mb-2" />
                    <div>
                        {#if hit.document.description !== ''}
                            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                            {@html hit.highlight.description && hit.highlight.description.snippet
                                ? sanitizeHtml(hit.highlight.description.snippet)
                                : sanitizeHtml(hit.document.description)}
                        {:else}
                            {$t('Staff.Search.No description provided')}
                        {/if}
                    </div>
                    <div class="mt-4">
                        <div class="font-semibold">{$t('Staff.Search.Appointments: ')}</div>
                        {#each hit.document.appointments as appointment}
                            <div>{appointment}</div>
                        {/each}
                    </div>
                </div>
            </div>
        {/each}
    </div>
</TypesenseSearch>
