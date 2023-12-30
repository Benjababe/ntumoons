<script lang="ts">
    import '../app.css';
    import Logo from '$lib/assets/images/Logo.svelte';
    import { Link, Settings } from '$lib/components/navbar';
    import { t } from '$lib/translations';
</script>

<nav class="navbar py-0 bg-base-300">
    <div class="flex-1">
        <Link
            class="group"
            href="/"
        >
            <div class="mr-2 group-hover:scale-120 transition-transform duration-300">
                <Logo />
            </div>
            NTUMoons
        </Link>
        <Link href="/timetable">{$t('Nav.Timetable')}</Link>
        <Link href="/modules">{$t('Nav.Modules')}</Link>
        <Link href="/staff">{$t('Nav.Staff')}</Link>
    </div>
    <!-- <span class="mr-4 select-none">
        {$semester.title}
    </span> -->
    <div class="mr-4">
        <Settings href="/settings" />
    </div>
</nav>
