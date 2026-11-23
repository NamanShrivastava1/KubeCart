import { getChannel } from "../config/mq.js";

import {
  sendWelcomeEmail,
  sendPaymentEmail,
} from "../services/email.service.js";

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

      console.log(`Processed event: ${event.eventType}`);
    } catch (error) {
      console.error("Notification failed:", error.message);

      // Do not immediately retry a failed email.
      channel.nack(msg, false, false);
    }
  });

  console.log("Notification consumer started");
};
