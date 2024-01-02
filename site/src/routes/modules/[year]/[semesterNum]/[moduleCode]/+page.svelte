<script lang="ts">
    import sanitizeHtml from 'sanitize-html';
    import { goto } from '$app/navigation';
    import Timetable from '$lib/components/timetable/Timetable.svelte';
    import { t } from '$lib/translations';
    import type { Lesson } from '$lib/types/Firebase';
    import Exam from './Exam.svelte';
    import Mutex from './Mutex.svelte';
    import Prerequisites from './Prerequisites.svelte';

    export let data;

    let indexNumbers: string[] = Object.keys(data.module.index_numbers);
    let indexNumber: string = '-1';
    let lessons: Lesson[] = [];

    $: {
        indexNumbers = Object.keys(data.module.index_numbers);
        lessons = [];
    }

    function openModule(e: CustomEvent<string>) {
        const moduleCode = e.detail.match(/([A-Z]{2}[\d|\w]{4})/g);
        if (moduleCode === null) return;
        goto(`/modules/${data.year}/${data.semesterNum}/${moduleCode}`);
    }

    function updateIndex() {
        if (indexNumber === '-1') {
            lessons = [];
            return;
        }

        lessons = data.module.index_numbers[indexNumber];
    }
</script>

<div>
    <div>
        <h1 class="text-5xl font-semibold">{data.module.code} {data.module.name_pretty}</h1>
        <div class="mt-4">
            <span>{$t('Modules.Details.Credits')}</span>
            <span class="text-center">{data.module.credits} AU</span>
        </div>
    </div>
    <div class="divider mt-1" />
    <div class="flex">
        <div class="max-w-xl">
            {#if data.module.prerequisites.length > 0}
                <Prerequisites
                    prerequisitesArr={data.module.prerequisites}
                    on:moduleStr={openModule}
                />
            {/if}
            {#if data.module.mutex.length > 0}
                <div class="first:mt-0 mt-8">
                    <Mutex
                        mutex={data.module.mutex}
                        on:moduleStr={openModule}
                    />
                </div>
            {/if}
            <div class="first:mt-0 mt-8">
                <h2 class="text-xl font-medium">{$t('Modules.Details.Description')}</h2>
                <div class="divider my-0" />
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                <div>{@html sanitizeHtml(data.module.description)}</div>
            </div>
            <div class="mt-10">
                <h2 class="text-xl font-medium">{$t('Modules.Details.Exam')}</h2>
                <div class="divider my-0" />
                {#if data.module.exam !== null}
                    <Exam exam={data.module.exam} />
                {:else}
                    <div>{$t('Modules.Details.NoExam')}</div>
                {/if}
            </div>
        </div>
        <div class="pl-8 ml-4">
            <h2 class="text-xl font-medium">{$t('Modules.Details.Schedule')}</h2>
            <div class="divider mt-0 mb-4" />
            <div class="flex justify-center items-center pb-4">
                <span>{$t('Modules.Details.Index Number')}</span>
                <select
                    class="select border border-solid border-neutral ml-4"
                    bind:value={indexNumber}
                    on:change={updateIndex}
                >
                    <!-- <option value="-1">-Select one-</option> -->
                    {#each indexNumbers as indexNumber}
                        <option value={indexNumber}>{indexNumber}</option>
                    {/each}
                </select>
            </div>
            <Timetable
                {lessons}
                orientation="portrait"
            />
        </div>
    </div>
</div>
