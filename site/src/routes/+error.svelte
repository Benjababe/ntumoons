<script lang="ts">
    import { page } from '$app/stores';
    import NewTabLink from '$lib/components/generic/NewTabLink.svelte';
    import { t } from '$lib/translations';

    const errorMap: Record<number, string> = {
        400: 'Error.Bad request, the server could not fulfill the request',
        404: 'Error.The page you are looking for doesnt exist'
    };
</script>

<div class="flex flex-col items-center justify-center text-xl font-semibold h-full w-full">
    <h1 class="text-5xl font-bold mb-8">
        {$t('Error.Status:')}
        <span class="text-red-600">{$page.status}</span>
    </h1>
    <div class="text-2xl mb-4">
        {$t('Error.Oops!')}
        <span class="text-3xl font-bold underline underline-offset-2">{$page.error?.message}</span>
    </div>
    <span class="mb-12">
        {$t($page.status in errorMap ? errorMap[$page.status] : errorMap[400])}
    </span>
    <span class="mb-4">
        {$t('Error.If this is unexpected, raise an issue on GitHub')}
    </span>
    <NewTabLink
        class="btn btn-sm btn-neutral"
        url="https://github.com/Benjababe/ntumoons/issues/new"
        text={$t('Error.Raise Issue')}
    ></NewTabLink>
</div>
