<script lang="ts">
    import Header from './Header.svelte';
    import InfoBar from './InfoBar.svelte';
    export let data;

    const { staff } = data;
</script>

<div class="flex justify-center">
    <div class="flex flex-col justify-center items-center w-3/4">
        <div class="flex flex-row gap-8 m-auto w-full max-h-96">
            <Header {staff} />
        </div>
        <div class="flex justify-center mt-6 w-full">
            <InfoBar {staff} />
        </div>
    </div>
</div>
