<script lang="ts">
    import { timetableModules } from '$lib/store';
    import { onMount } from 'svelte';

    onMount(() => {
        const timetableModulesStr = localStorage.getItem('timetableModules') ?? '[]';
        $timetableModules = JSON.parse(timetableModulesStr);
        console.log($timetableModules);
    });
</script>
