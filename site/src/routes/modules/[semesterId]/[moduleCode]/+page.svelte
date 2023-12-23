<script lang="ts">
    import { goto } from '$app/navigation';
    import { t } from '$lib/translations';
    import Exam from './Exam.svelte';
    import Mutex from './Mutex.svelte';
    import Prerequisites from './Prerequisites.svelte';

    export let data;

    function openModule(e: CustomEvent<string>) {
        const moduleCode = e.detail.match(/([A-Z]{2}[\d|\w]{4})/g);
        if (moduleCode === null) return;
        goto(`/modules/${data.semesterId}/${moduleCode}`);
    }
</script>

<div>
    <h1 class="text-5xl font-semibold">{data.module.code} {data.module.name_pretty}</h1>
    <div class="divider" />
    <div class="max-w-xl">
        <div class="grid grid-cols-info pb-4">
            <span>{$t('Modules.Credits')}</span>
            <span class="text-center">{data.module.credits}</span>
        </div>
        {#if data.module.prerequisites.length > 0}
            <Prerequisites
                prerequisitesArr={data.module.prerequisites}
                on:moduleStr={openModule}
            />
        {/if}
        {#if data.module.mutex.length > 0}
            <Mutex
                mutex={data.module.mutex}
                on:moduleStr={openModule}
            />
        {/if}
        <div class="mt-6">
            <h2 class="text-xl font-medium">{$t('Modules.Description')}</h2>
            <div class="divider my-0" />
            <div>{@html data.module.description}</div>
        </div>
        <div class="mt-10">
            <h2 class="text-xl font-medium">{$t('Modules.Exam')}</h2>
            <div class="divider my-0" />
            {#if data.module.exam !== null}
                <Exam exam={data.module.exam} />
            {:else}
                <div>{$t('Modules.NoExam')}</div>
            {/if}
        </div>
    </div>
</div>
