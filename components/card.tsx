"use client"
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

export default async function Card({ order, users, updateOrder }: { order: { name: string, order_id: string, value: number, id:number, users:string[]|null }, users: { name: string, user_id: string }[], updateOrder:(value:string[], id:number)=>void }) {


    return (
        <div className="flex flex-col items-start border-2 border-slate-800 p-2 rounded-lg font-bold">
            <div className="flex justify-between w-full">
                <p className="">{order.name}</p>
                <p className="">${order.value}</p>
            </div>
            <div className="">
                <ToggleGroup type="multiple" onValueChange={(e)=>updateOrder(e, order.id)} value={order.users||[]}>
                    {users.map(user => <ToggleGroupItem key={user.user_id} value={user.name} >{user.name}</ToggleGroupItem>)}
                </ToggleGroup>
            </div>
        </div>
    )
}