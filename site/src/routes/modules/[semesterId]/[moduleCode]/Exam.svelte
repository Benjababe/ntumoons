<script lang="ts">
    import { t } from '$lib/translations';
    export let exam: Exam;
</script>

<div class="grid grid-cols-info gap-4 pt-2">
    <span>{$t('Modules.ExamDate')}</span>
    <span class="text-center">{exam.date}</span>

    <span>{$t('Modules.ExamDay')}</span>
    <span class="text-center">{exam.day}</span>

    <span>{$t('Modules.ExamDuration')}</span>
    <span class="text-center">{exam.duration}</span>

    <span>{$t('Modules.ExamTime')}</span>
    <span class="text-center">{exam.time}</span>
</div>
