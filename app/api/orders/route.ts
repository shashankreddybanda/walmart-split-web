import { postOrder } from "@/actions/db"
import { NextResponse } from "next/server"
import {z} from "zod"

export async function POST(request: Request, response: NextResponse) {
    const reqSchema = z.array(z.object({
        name: z.string(),
        value: z.number()
    }))
    const req = await request.json();
    console.log(req);
    
    try{
        reqSchema.parse(req);
        await postOrder(req);
        return Response.json({status: 200});
    }catch(err){
        console.error(err);
    }
    return Response.json({ name: 'shashank' })
  }