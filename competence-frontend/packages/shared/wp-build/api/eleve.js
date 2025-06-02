export async function fetchEleves() {
    const res = await fetch('https://nathabee.de/api/eleves');
    if (!res.ok)
        throw new Error('Failed to load eleves');
    return res.json();
}
