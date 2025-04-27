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

export function httpResponse<T>(
  reply: FastifyReply,
  options: {
    statusCode: number;
    success: boolean;
    data?: T;
    message: string;
    metadata?: Record<string, any>;
  }
) {
  const { statusCode, success, data = null, message, metadata = {} } = options;
  
  return reply.status(statusCode).send({
    success,
    statusCode,
    data,
    message,
    ...metadata,
    timestamp: new Date().toISOString()
  });
}