"use server"

import { Pool } from 'pg';
import { z } from "zod";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});

export async function getData() {
    const client = await pool.connect();
    try {
        const response = await client.query('SELECT version()');
        return response.rows[0].version;
    } finally {
        client.release();
    }
}

export async function postOrder(orders: Array<{ order_id: string, name: string, value: number }>) {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: true
    });
    console.log(process.env.DATABASE_URL);
    
    const client = await pool.connect();
    
    try {
        // orders.forEach(async (order) => {
        //     console.log(order.name);
            
        //     await client.query(`INSERT INTO "order" (order_id, name, value) VALUES (${order.order_id}, '${order.name}', ${order.value})`);
        // })
        const values = orders.map(order => `(${order.order_id}, '${order.name}', ${order.value})`).join(', ');
        console.log(values);
        await client.query(`INSERT INTO "order" (order_id, name, value) VALUES ${values}`);
    } finally {
        client.release();
    }
}

export async function getOrders(order_id: string): Promise<Array<any> | null> {
    const responseSchema = z.array(z.object({
        order_id: z.string(),
        name: z.string(),
        value: z.number(),
        id: z.number(),
        users: z.array(z.string()).nullable()
    }));

    const client = await pool.connect();
    try {
        const response = await client.query(`SELECT * FROM "order" WHERE order_id = '${order_id}' ORDER BY name`);
        responseSchema.parse(response.rows);
        return response.rows;
    } catch (error) {
        console.error(error);
        return [];
    } finally {
        client.release();
    }
}

export async function postUser(userName: FormDataEntryValue) {
    const client = await pool.connect();
    try {
        await client.query(`INSERT INTO "users" (name) VALUES ('${userName}')`);
    } finally {
        client.release();
    }
}

export async function getUsers(): Promise<{ name: string, user_id: string }[]> {
    const responseSchema = z.array(z.object({
        name: z.string()
    }))
    const client = await pool.connect();
    try {
        const response = await client.query(`SELECT * FROM "users"`);
        responseSchema.parse(response.rows);
        return response.rows;
    } catch (error) {
        return []
    } finally {
        client.release();
    }
}

export async function updateOrderUser(users:string[], order_id:number) {
    const client = await pool.connect();
    try {
        await client.query(`UPDATE "order" SET users = ARRAY['${users.join('\',\'')}'] WHERE id = ${order_id};`);
    } catch(error){
        console.error(error);
    }finally {
        client.release();
    }
}

export async function getOrderUsers(order_id:number) {
    const client = await pool.connect();
    try {
        const response = await client.query(`SELECT users FROM "order" WHERE id = ${order_id};`);
    } catch(error){
        console.error(error);
    }finally {
        client.release();
    }
}