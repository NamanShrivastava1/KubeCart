export const paymentTemplate = ({
  name,
  orderId,
  amount,
  currency = "INR",
}) => {
  return {
    subject: "Payment Successful - KubeCart",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Payment Successful!</h2>
        <p>Hi ${name},</p>
        <p>Your payment has been successfully processed.</p>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Amount:</strong> ${currency} ${amount}</p>
        <p>Thank you for shopping with KubeCart!</p>
        <strong>Team KubeCart</strong>
      </div>
    `,
  };
};
