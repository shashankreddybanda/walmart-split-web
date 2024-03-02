import { getOrders, getUsers, postUser, updateOrderUser } from "@/actions/db"
import Card from "@/components/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { revalidatePath } from "next/cache"

export default async function page({ params }: { params: { order_id: string } }) {

    type OrderType = {
        order_id: string,
        name: string,
        value: number,
        id: number,
        users: string[]|null
    }

    type user = {
        name: string,
        user_id: string
    }

    const orders: OrderType[] | null = await getOrders(params.order_id);


    async function handleSubmit(data: FormData) {
        'use server'
        await postUser(data.get('name') || "");
    }

    async function updateOrder(value: string[], id: number) {
        'use server'
        await updateOrderUser(value, id);
        console.log(`ARRAY['${value.join('\',\'')}']`);
        revalidatePath(`/${params.order_id}`)
    }

    const users: user[] = await getUsers();

    let totals = users.map(user => ({user:user.name, value:0}))
    console.log(totals);

    const updateTotals = (userName: string, value: number)=>{
        totals.forEach(total=> {
            if(total.user === userName){
                total.value += value;
            }
        })
    }

    orders?.forEach(order=>{
        order.users?.forEach(user=>{
            updateTotals(user, order.value/(order.users?.length || 1))
        })
    })

    return (
        <div className="flex flex-col p-16 gap-4">
            <div className="flex justify-between align-middle">
                <div className="flex gap-2 text-2xl">
                    <p className="font-bold">Order no.: </p>
                    <p className="font-light">{params.order_id}</p>
                </div>
                <div>
                    <Dialog>
                        <DialogTrigger className=" bg-slate-900 text-white rounded-md p-2 hover:bg-slate-800">Add user</DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Enter the user name to add to orders?</DialogTitle>
                            </DialogHeader>
                            <form action={handleSubmit} className="flex flex-col gap-4 w-full">
                                <Input type="text" placeholder="Name" name="name"></Input>
                                <Button>Submit</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            {orders?.map((order) => <Card updateOrder={updateOrder} key={order.id} order={order} users={users}></Card>)}
            <div className="flex flex-col">
                <p className="font-bold">Totals</p>
                {totals.map(total => (<div className="flex gap-2" key={total.user}><p className=" font-semibold">{total.user}:</p> <p>{total.value.toFixed(2)}</p></div>))}
            </div>
        </div>
    )
}