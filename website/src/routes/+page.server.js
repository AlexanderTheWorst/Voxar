export async function load({ locals }) {
    const { user: application = undefined, session } = locals;

    return { user: (application?.user ?? undefined) };
}