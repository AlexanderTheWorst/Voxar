export async function load({ locals }) {
    const { user: application = undefined } = locals;

    return { user: (application?.user ?? undefined) };
}