import metadata from '$lib/data/staffMetadata.json';

export async function load() {
    const { keywords, tag } = metadata;
    return { keywords, tag };
}
