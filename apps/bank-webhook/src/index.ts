import express from "express";
import { z } from "zod";
import db from "@repo/db/client"

const app = express();

app.post("/hdfcWebhook", async (req, res) => {
    const paymentInfoSchema = z.object({
        token: z.string(),
        userId: z.string(),
        amount: z.string()
    })

    //TODO: HDFC bank should ideally send us a secret so we know this is sent by them
    const paymentInformation: {
        token: string;
        userId: string;
        amount: string
    } = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    };

    const { success } = paymentInfoSchema.safeParse(paymentInformation);

    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs",
        });
    }

    try {
        await db.$transaction([
            db.balance.update({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                data: {
                    amount: {
                        // You can also get this from DB
                        increment: Number(paymentInformation.amount)
                    }
                }
            }),
            db.onRampTransaction.update({
                where: {
                    token: paymentInformation.token
                },
                data: {
                    status: "Success",
                }
            })
        ])
    } catch (e) {
        console.error(e);
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }
})

app.listen(3003);
