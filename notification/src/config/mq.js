import amqp from "amqplib";
import { config } from "./config.js";
import logger from "../utils/logger.js";

let connection;
let channel;

export const connectRabbitMQ = async () => {
  connection = await amqp.connect(config.RABBITMQ_URL);

  channel = await connection.createChannel();

  await channel.assertExchange("kubecart.events", "topic", { durable: true });

  await channel.assertQueue("notification.queue", {
    durable: true,
  });

  await channel.bindQueue(
    "notification.queue",
    "kubecart.events",
    "user.registered",
  );

  await channel.bindQueue(
    "notification.queue",
    "kubecart.events",
    "payment.successful",
  );

  logger.info("Connected to RabbitMQ");

  return channel;
};

export const getChannel = () => {
  if (!channel) {
    throw new Error("RabbitMQ channel is not initialized");
  }
  return channel;
};
