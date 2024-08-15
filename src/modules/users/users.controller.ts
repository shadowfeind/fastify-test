import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcryptjs";
import { fastify } from "../../app";
import { CreateUserType, LoginType } from "./users.schema";
import { createUser, findAllUsers, findUserByEmail } from "./users.service";

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: CreateUserType;
  }>,
  reply: FastifyReply
) {
  try {
    const user = await createUser(request.body);
    reply.code(201).send(user);
  } catch (error) {
    console.log(error);
    reply.code(500).send(error);
  }
}

export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginType;
  }>,
  reply: FastifyReply
) {
  const body = request.body;

  const user = await findUserByEmail(body.email);

  if (!user) {
    return reply.code(401).send({
      message: "Invalid Email or Password",
    });
  }

  const matchPassword = await bcrypt.compare(body.password, user.password);

  if (!matchPassword) {
    return reply.code(401).send({
      message: "Invalid Email or Password",
    });
  }

  const { password, ...rest } = user;

  return {
    accessToken: fastify.jwt.sign(rest),
  };
}

export async function getAllUsersHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const users = await findAllUsers();
  return users;
}
