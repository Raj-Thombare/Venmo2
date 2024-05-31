import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { Card } from "@repo/ui/card";

async function getP2pTransactions() {
  const session = await getServerSession(authOptions);
  const txns = await prisma.p2pTransfer.findMany({
    where: {
      fromUserId: Number(session?.user?.id),
    },
    include: {
      toUser: true,
    },
  });

  return txns.map((t) => ({
    id: t.id,
    time: t.timestamp,
    amount: t.amount,
    username: t.toUser.name,
    number: t.toUser.number,
  }));
}

export default async function Page() {
  const transactions = await getP2pTransactions();

  if (!transactions.length) {
    return (
      <Card title='Recent Transactions'>
        <div className='text-center pb-8 pt-8'>No Recent transfers</div>
      </Card>
    );
  }

  return (
    <div className='w-screen'>
      <div className='text-4xl text-blue-600 pt-8 mb-8 font-bold'>Transfer</div>
      <Card title='Recent P2P Transfers'>
        <div className='pt-2'>
          {transactions.map((t) => (
            <div className='flex justify-between'>
              <div>
                <div className='text-sm'>Sent INR</div>
                <div className='text-slate-600 text-xs'>
                  {t.time.toDateString()}
                </div>
              </div>
              <div className='flex flex-col justify-center'>
                + Rs {t.amount / 100}
              </div>
              <div className='flex flex-col justify-center'>{t.number}</div>
              <div className='flex flex-col justify-center'>{t.username}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
