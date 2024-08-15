import prisma from "../utils/prisma/prisma";
import bcrypt from "bcryptjs";
import { createUserSchema, CreateUserType } from "./users.schema";


export async function createUser(input: CreateUserType){
    const validateFields = createUserSchema.safeParse(input)

    if(!validateFields.success) return { error: "Invalid Fields" };

    const {  email, password, name } =
    validateFields.data;

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name
        }
    })

    return user
}

export async function findUserByEmail(email: string){
    return prisma.user.findUnique({
        where: {
            email
        }
    })  
}

export async function findAllUsers(){
    return prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true
        }
    })
}