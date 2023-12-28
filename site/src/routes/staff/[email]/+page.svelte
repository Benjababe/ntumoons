<script lang="ts">
    import { t } from '$lib/translations/index.js';
    import NewTab from '$lib/assets/images/NewTab.svelte';
    export let data;

    const { staff } = data;
    console.log(staff);
</script>

<div class="flex justify-center">
    <div class="flex flex-col justify-center items-center w-3/4">
        <div class="flex flex-row gap-8 m-auto w-full max-h-96">
            <img
                class="w-1/3 aspect-staff-photo object-cover object-center rounded-xl"
                src={staff.profile_pic_url}
                alt={staff.title}
            />
            <div class="w-2/3 pr-4 overflow-y-scroll">
                <p class="font-bold underline text-lg mb-2">{$t('Staff.Details.Biography')}</p>
                <p>{staff.biography}</p>
            </div>
        </div>
        <div class="flex justify-center mt-6 w-full">
            <div class="collapse collapse-arrow w-full rounded-lg">
                <input type="checkbox" />
                <div
                    class="collapse-title flex justify-around items-center h-12 text-xl bg-base-300 font-semibold"
                >
                    <span>{staff.title}</span>
                </div>
                <div
                    class="collapse-content flex items-center w-full mx-auto justify-evenly bg-base-200 pt-4"
                >
                    <a
                        class="flex gap-1 btn btn-sm btn-neutral"
                        href="mailto:{staff.email}"
                    >
                        Email
                    </a>
                    <a
                        class="flex gap-1 btn btn-sm btn-neutral"
                        target="_blank"
                        href={staff.personal_url}
                    >
                        Personal Website <NewTab />
                    </a>
                    <a
                        class="flex gap-1 btn btn-sm btn-neutral"
                        target="_blank"
                        href={staff.url}
                    >
                        NTU Website <NewTab />
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
