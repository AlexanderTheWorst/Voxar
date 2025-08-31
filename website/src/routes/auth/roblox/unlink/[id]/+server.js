import { redirect } from "@sveltejs/kit";
import * as UserModel from "@voxar/mongodb/models/user";

export async function GET({ locals, params }) {
    const { user, user_data } = locals;
    const { id } = params;

    const robloxUser = user_data.linkedAccounts.find(a => a.id === id);
    if (!robloxUser) return new Response(null, {
        status: 404
    })

    try {
        UserModel.removeRobloxUser(user_data.id, robloxUser);
    } catch (err) {
        return new Response(null, {
            status: 404
        })
    }

    return new Response(null, {
        status: 200
    })
}