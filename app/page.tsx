import { getOrdersList } from "@/actions/db";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function Page() {

  async function handleSubmit(data: FormData) {
    'use server'
    redirect(`/${data.get('order_id')}`)
  }

  const orders = await getOrdersList();

  return (
    <main className="flex min-h-screen flex-col items-start justify-between p-8 md:p-24">
      <form action={handleSubmit} className="flex flex-col gap-4 w-full">
        <Input type="text" placeholder="order id" name="order_id"></Input>
        <Button>Submit</Button>
      </form>
      {orders?.map(order => (
        <Link href={`/${order.order_id}`} key={order.order_id}>
          <Card key={order.order_id} className=" w-64">
            <CardHeader>
              <CardTitle>{order.order_id}</CardTitle>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </main>
  );
}
