import { getChannel } from "../config/mq.js";

import {
  sendWelcomeEmail,
  sendPaymentEmail,
} from "../services/email.service.js";
import logger from "../utils/logger.js";

export const startNotificationConsumer = async () => {
  const channel = getChannel();

  await channel.prefetch(10);

  await channel.consume("notification.queue", async (message) => {
    if (!message) return;

    try {
      const event = JSON.parse(message.content.toString());

      switch (event.eventType) {
        case "user.registered":
          await sendWelcomeEmail(event.data);
          break;

        case "payment.successful":
          await sendPaymentEmail(event.data);
          break;

        default:
          throw new Error(`Unsupported event type: ${event.eventType}`);
      }

      channel.ack(message);

      logger.info({ eventType: event.eventType }, "Processed notification event");
    } catch (error) {
      logger.error({ err: error }, "Notification processing failed");

      // Do not immediately retry a failed email.
      channel.nack(message, false, false);
    }
  });

  logger.info("Notification consumer started");
};
