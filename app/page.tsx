import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";

export default function Page() {

  async function handleSubmit(data: FormData) {
    'use server'
    redirect(`/${data.get('order_id')}`)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form action={handleSubmit} className="flex flex-col gap-4 w-full">
        <Input type="text" placeholder="order id" name="order_id"></Input>
        <Button>Submit</Button>
      </form>
    </main>
  );
}
