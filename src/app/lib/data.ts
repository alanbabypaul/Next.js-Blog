import { createClient } from '@vercel/postgres';
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export async  function connectToDb(){
    const client = createClient();
    await client.connect();
    try{
        if(client){
            console.log('connected to DataBase')
            return client;
        }

    }catch(error){
        console.log('error connecting the Db',error);

    }

}

export async function getPosts(){
  try{
    noStore();
    await new Promise((resolve) =>setTimeout(resolve, 3000));
    const data = await sql `SELECT * FROM posts `
    console.log(data.rows)
    return data.rows
  }catch(error){
console.log("error fetchong the data",error)
  }
}