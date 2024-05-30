"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function CreateOnRampTrasaction(provider: string, amount: number) {
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user?.id) {
        return {
            message: "Unauthenticated request"
        }
    }
    // Ideally the token should come from the banking provider (hdfc/axis)
    var token = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
    await prisma.onRampTransaction.create({
        data: {
            provider,
            startTime: new Date(),
            amount: amount,
            status: 'Processing',
            userId: Number(session?.user?.id),
            token: token
        }
    })

    return {
        message: "on ramp transaction done"
    }
}