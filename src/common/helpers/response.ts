import { FastifyReply } from "fastify";

export function response<T>(
  reply: FastifyReply,
  statusCode: number,
  success: boolean,
  data: T | null,
  message: string
) {
  return reply.status(statusCode).send({
    success,
    data,
    message,
    timestamp: new Date().toISOString()
  });
}