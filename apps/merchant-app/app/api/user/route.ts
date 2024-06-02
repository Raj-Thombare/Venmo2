import { NextResponse } from "next/server"
import db from "@repo/db/client";

export const GET = async () => {
    await db.user.create({
        data: {
            email: "merchant@gmail.com",
            name: "Merchant 1",
            number: "3333333333",
            password: "merchant"
        }
    })
    return NextResponse.json({
        message: "hi there"
    })
}