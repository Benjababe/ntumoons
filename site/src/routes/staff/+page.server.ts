import metadata from '$lib/data/staffMetadata.json';

export async function load() {
    const { keywords, tags } = metadata;
    return { keywords, tags };
}
