import { client } from "../prisma";

export async function create(data) {
    return client.sessions.create({ data });
}

export async function findById(id) {
    return client.sessions.findUnique({ where: { id } });
}

export async function remove(id) {
    return client.sessions.delete({ where: { id } });
}