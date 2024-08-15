import bcrypt from "bcryptjs";
import { CreateUserType } from "./users.schema";
import prisma from "../../utils/prisma/prisma";

export async function createUser(input: CreateUserType) {
  const { email, password, name } = input;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  return user;
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function findAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
    },
  });
}
