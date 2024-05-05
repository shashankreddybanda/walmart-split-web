import { getOrders, getUsers, postUser, updateOrderUser } from "@/actions/db"
import Card from "@/components/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import { revalidatePath } from "next/cache"
import Link from "next/link"

export const revalidate = 0;

export default async function page({ params }: { params: { order_id: string } }) {

    type OrderType = {
        order_id: string,
        name: string,
        value: number,
        id: number,
        users: string[] | null
    }

    type user = {
        name: string,
        user_id: string
    }

    const orders: OrderType[] | null = await getOrders(params.order_id);
    const users: user[] = await getUsers();


    async function handleSubmit(data: FormData) {
        'use server'
        await postUser(data.get('name') || "");
    }

    async function updateOrder(value: string[], id: number) {
        'use server'
        await updateOrderUser(value, id);
        revalidatePath(`/${params.order_id}`)
    }


    let totals = users.map(user => ({ user: user.name, value: 0, items: [""] }))
    let total = 0

    const updateTotals = (userName: string, orderName: string, value: number) => {
        totals.forEach(total => {
            if (total.user === userName) {
                total.value += value;
                total.items.push(orderName + ": " + value);
            }
        })
        total += value;
    }

    orders?.forEach(order => {
        if (order.users) {
            order.users = order.users.filter(str => str !== "")
        }
        order.users?.forEach(user => {
            updateTotals(user, order.name, order.value / (order.users?.length || 1))
        })
    })

    return (
        <div className="flex flex-col p-8 md:p-16 gap-4">
            <div className="flex justify-between align-middle flex-col md:flex-row gap-4">
                <Link href={'/'} className="flex text-2xl flex-col md:flex-row underline items-center">
                    <ArrowLeft></ArrowLeft> <span className="font-bold flex">Order no.: <span className="font-light">{params.order_id}</span></span>
                </Link>
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
                <p className="font-bold">Totals: {total.toFixed(2)}</p>
                {totals.map(total => (<div className="flex flex-col" key={total.user}><div className="flex gap-2" ><p className=" font-semibold">{total.user}:</p> <p>{total.value.toFixed(2)}</p></div>{total.items}</div>))}
            </div>
        </div>
    )
}