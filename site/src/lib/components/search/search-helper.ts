export async function callSearchPath(
    searchPath: string,
    searchValue: string,
    page = 1,
    found = 0,
    per_page = 10,
    activeFilters: { [key: string]: string[] } = {}
) {
    if (page === -1) {
        page = found === 0 ? page : Math.ceil(found / per_page);
    }

    const res = await fetch(searchPath, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            q: searchValue,
            page,
            per_page: per_page,
            filters: getFilters(activeFilters)
        })
    });

    return res;
}

function getFilters(activeFilters: { [key: string]: string[] }) {
    let tsFilters: string[] = [];
    for (const [name, filters] of Object.entries(activeFilters)) {
        if (filters.length == 0) continue;

        const filterStr = `[${filters.map((f) => `\`${f}\``).join(', ')}]`;
        tsFilters = [...tsFilters, `${name}:=${filterStr}`];
    }
    return tsFilters.join(' && ');
}
