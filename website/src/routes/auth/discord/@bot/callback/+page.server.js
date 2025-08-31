import { redirect } from '@sveltejs/kit';

export async function load({ url }) {
    const { searchParams } = url;

    const params = {};
    searchParams.keys().forEach(key => params[key] = searchParams.get(key));

    return params;
}