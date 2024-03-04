<script lang="ts">
    let dialog: HTMLDialogElement;

    function showModal() {
        dialog.showModal();
    }
</script>

<button on:click={showModal}>
    <slot name="modal-button" />
</button>

<dialog
    class="modal modal-bottom sm:modal-middle"
    bind:this={dialog}
>
    <div class="modal-box">
        <slot name="modal-body" />
    </div>
    <form
        method="dialog"
        class="modal-backdrop"
    >
        <button class="cursor-default"></button>
    </form>
</dialog>
