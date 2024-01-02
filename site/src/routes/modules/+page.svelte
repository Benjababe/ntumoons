<script lang="ts">
    import sanitizeHtml from 'sanitize-html';
    import TypesenseSearch from '$lib/components/search/TypesenseSearch.svelte';
    import { t } from '$lib/translations';
    import type { ModuleDoc } from '$lib/types/Typesense';
    import type { SearchResponseHit } from 'typesense/lib/Typesense/Documents';

    let hits: SearchResponseHit<ModuleDoc>[] = [];
</script>

<TypesenseSearch
    collection="modules"
    searchPlaceholder={$t('Modules.Search.Enter course code, name or descriptions')}
    bind:moduleHits={hits}
>
    <div slot="results">
        {#each hits as hit}
            <div class="mt-8 mb-4">
                <a
                    href="/modules/{hit.document.year}/{hit.document.semester_num}/{hit.document
                        .code}"
                    class="text-primary text-xl"
                >
                    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                    {@html hit.highlight.code && hit.highlight.code.snippet
                        ? sanitizeHtml(hit.highlight.code.snippet)
                        : sanitizeHtml(hit.document.code)}

                    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                    {@html hit.highlight.name_pretty && hit.highlight.name_pretty.snippet
                        ? sanitizeHtml(hit.highlight.name_pretty.snippet)
                        : sanitizeHtml(hit.document.name_pretty)}
                </a>
                <div class="divider mt-0 mb-2" />
                <div class="module-results-desc">
                    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                    {@html hit.highlight.description && hit.highlight.description.snippet
                        ? sanitizeHtml(hit.highlight.description.snippet)
                        : sanitizeHtml(hit.document.description)}
                </div>
            </div>
        {/each}
    </div>
</TypesenseSearch>
