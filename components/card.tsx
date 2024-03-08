"use client"
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

export default function Card({ order, users, updateOrder }: { order: { name: string, order_id: string, value: number, id:number, users:string[]|null }, users: { name: string, user_id: string }[], updateOrder:(value:string[], id:number)=>void }) {


    return (
        <div className="flex flex-col items-start border-[1px] border-slate-300 p-2 rounded-lg ">
            <div className="flex justify-between w-full p-2 gap-4">
                <p className=" font-semibold text-sm">{order.name}</p>
                <p className="">${order.value}</p>
            </div>
            <div className="">
                <ToggleGroup className="flex flex-wrap justify-start" type="multiple" onValueChange={(e)=>updateOrder(e, order.id)} value={order.users||[]}>
                    {users.map(user => <ToggleGroupItem key={user.user_id} value={user.name} >{user.name}</ToggleGroupItem>)}
                </ToggleGroup>
            </div>
        </div>
    )
}