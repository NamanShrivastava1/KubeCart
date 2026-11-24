import amqp from "amqplib";
import { config } from "./config.js";
import logger from "../utils/logger.js";

let connection;
let channel;

export const connectRabbitMQ = async () => {
  connection = await amqp.connect(config.RABBITMQ_URL);

  channel = await connection.createChannel();

  await channel.assertExchange("kubecart.events", "topic", {
    durable: true,
  });

  logger.info("Connected to RabbitMQ");
};

export const publishEvent = (routingKey, data) => {
  if (!channel) {
    throw new Error("RabbitMQ channel is not initialized");
  }

  return channel.publish(
    "kubecart.events",
    routingKey,
    Buffer.from(JSON.stringify(data)),
    {
      persistent: true,
      contentType: "application/json",
    },
  );
};
