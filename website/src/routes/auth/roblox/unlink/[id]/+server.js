import { redirect } from "@sveltejs/kit";
import * as UserModel from "@voxar/mongodb/models/user";

export async function GET({ locals, params }) {
    const { user, user_data } = locals;
    const { id } = params;

    const robloxUser = user_data.linkedAccounts.find(a => a.id === id);
    if (!robloxUser) throw redirect(307, "/dashboard");

    await UserModel.removeRobloxUser(user_data.id, robloxUser);

    throw redirect(307, "/dashboard");
}