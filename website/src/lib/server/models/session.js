import SessionModel from "@voxar/mongodb/models/sessions";

export async function create(data) {
    const session = new SessionModel(data);
    return await session.save();
}

export async function findById(id) {
    return await SessionModel.findOne({ id }).exec();
}

export async function remove(id) {
    return await SessionModel.deleteOne({ id }).exec();
}