'use server'

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();


// ADDING THE TODOS
export const addTodo=async(todo:string)=>{
    const data=await prisma.todo.create({
        data:{
            task:todo,
            completed:false
        }
    });
    prisma.$disconnect();
    return data;
}

// GETTING ALL TODOS
export const getTodos=async()=>{
    const data=await prisma.todo.findMany();
    prisma.$disconnect();

    return data;
}

// UPDATING THE TODOS
export const updateTodo=async(id:string,completed:boolean)=>{
    const data=await prisma.todo.update({
        where:{
            id:id
        },
        data:{
            completed:completed
        }
    });
    prisma.$disconnect();

    return data;
}

// DELETING THE TODOS
export const deleteTodo=async(id:string)=>{
    const data=await prisma.todo.delete({
        where:{
            id:id
        }
    });
    prisma.$disconnect();

    return data;
}