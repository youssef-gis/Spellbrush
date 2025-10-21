"use server";

import { headers } from "next/headers";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";

export const getUserCredits = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) return null;

    const user= await db.user.findUniqueOrThrow({
        where: { id: session.user.id},
        select: {credits: true},
    });


    return user.credits;
}