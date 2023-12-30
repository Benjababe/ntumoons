<script lang="ts">
    import { Confetti } from 'svelte-confetti';
    import Header from './Header.svelte';
    import InfoBar from './InfoBar.svelte';
    import Keywords from './Keywords.svelte';
    import MiscCategories from './MiscCategories.svelte';
    export let data;

    const { staff } = data;
</script>

{#if staff.email === 'yrloke@ntu.edu.sg'}
    <div
        class="fixed -top-14 left-0 h-screen w-screen flex justify-center overflow-hidden pointer-events-none"
    >
        <Confetti
            x={[-5, 5]}
            y={[0, 5]}
            delay={[500, 3000]}
            duration={6000}
            amount={1000}
            size={20}
            fallDistance="100vh"
        />
    </div>
{/if}

<div class="flex justify-center">
    <div class="flex flex-col justify-center items-center max-w-1200">
        <div class="flex flex-row gap-8 m-auto w-full max-h-96">
            <Header {staff} />
        </div>
        <div class="flex justify-center mt-6 w-full">
            <InfoBar {staff} />
        </div>
        <div class="flex w-full mt-8 gap-x-8">
            <div class="w-1/3">
                <Keywords {staff} />
            </div>
            <div class="w-2/3">
                <MiscCategories {staff} />
            </div>
        </div>
    </div>
</div>
