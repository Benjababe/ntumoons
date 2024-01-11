<script>
    import Confetti from 'svelte-confetti';
</script>

<div
    class="fixed left-0 flex justify-center w-screen h-screen overflow-hidden pointer-events-none -top-14"
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
