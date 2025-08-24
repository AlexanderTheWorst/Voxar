export async function GET({ locals }) {
    return new Response(
        JSON.stringify({ 
            user: locals.user.user
        }),
        {
            headers: new Headers({
                "Content-Type": "application/json"
            })
        }
    )
}