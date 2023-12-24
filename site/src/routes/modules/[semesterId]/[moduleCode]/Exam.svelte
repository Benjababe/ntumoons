<script lang="ts">
    import { t } from '$lib/translations';
    export let exam: Exam;
</script>

<div class="grid grid-cols-info gap-4 pt-2">
    <span>{$t('Modules.Details.ExamDate')}</span>
    <span class="text-center">{exam.date}</span>

    <span>{$t('Modules.Details.ExamDay')}</span>
    <span class="text-center">{exam.day}</span>

    <span>{$t('Modules.Details.ExamDuration')}</span>
    <span class="text-center">{exam.duration}</span>

    <span>{$t('Modules.Details.ExamTime')}</span>
    <span class="text-center">{exam.time}</span>
</div>
