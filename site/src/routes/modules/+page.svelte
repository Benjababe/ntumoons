<script lang="ts">
    import DOMPurify from 'dompurify';
    import TypesenseSearch from '$lib/components/search/TypesenseSearch.svelte';
    import { t } from '$lib/translations';
</script>

<TypesenseSearch
    collection="modules"
    searchPlaceholder={$t('Modules.Search.Enter course code, name or descriptions')}
    let:hit
>
    <div class="mt-8 mb-4">
        <a
            href="/modules/{hit.document.year}/{hit.document.semester_num}/{hit.document.code}"
            class="text-primary text-xl"
        >
            {@html DOMPurify.sanitize(
                hit.highlight.code && hit.highlight.code.snippet
                    ? hit.highlight.code.snippet
                    : hit.document.code
            )}
            {@html DOMPurify.sanitize(
                hit.highlight.name_pretty && hit.highlight.name_pretty.snippet
                    ? hit.highlight.name_pretty.snippet
                    : hit.document.name_pretty
            )}
        </a>
        <div class="divider mt-0 mb-2" />
        <div class="module-results-desc">
            {@html DOMPurify.sanitize(
                hit.highlight.description && hit.highlight.description.snippet
                    ? hit.highlight.description.snippet
                    : hit.document.description
            )}
        </div>
    </div>
</TypesenseSearch>
