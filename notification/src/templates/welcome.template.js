export const welcomeTemplate = (name) => {
  return {
    subject: "Welcome to KubeCart!",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Welcome to KubeCart, ${name}!</h2>
        <p>Your account has been created successfully.</p>
        <p>We're glad to have you with us.</p>
        <p>Happy shopping!</p>
        <strong>Team KubeCart</strong>
      </div>
    `,
  };
};
