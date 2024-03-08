import { getOrdersList } from "@/actions/db";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {

  async function handleSubmit(data: FormData) {
    'use server'
    redirect(`/${data.get('order_id')}`)
  }

  const orders = await getOrdersList();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 md:p-24">
      <form action={handleSubmit} className="flex flex-col gap-4 w-full">
        <Input type="text" placeholder="order id" name="order_id"></Input>
        <Button>Submit</Button>
      </form>
      {orders?.map(order => (
        <Card key={order.order_id}>
          <CardHeader>
            <CardTitle><Link href={`/${order.order_id}`} >{order.order_id}</Link></CardTitle>
          </CardHeader>
        </Card>
      ))}
    </main>
  );
}
