import { redirect } from "@sveltejs/kit";

export async function load() {
    return redirect(307, "/oauth2?platform=discord");
}