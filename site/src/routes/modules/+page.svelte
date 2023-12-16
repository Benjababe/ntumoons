<script lang="ts">
    import { t } from '$lib/translations';

    let modules = [];
    let searchValue = '';
    let searching = false;
    let timeout: number;

    function handleSearch() {
        searching = true;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(searchModules, 500);
    }

    async function searchModules() {
        if (!searchValue) {
            modules = [];
            searching = false;
            return;
        }

        const data = await fetch('/search', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ q: searchValue })
        });
    }
</script>

<input
    type="text"
    placeholder={$t('Courses.Enter course code, name or descriptions')}
    class="input input-bordered w-full max-w-xl"
    bind:value={searchValue}
    on:input={handleSearch}
/>
