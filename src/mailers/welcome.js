module.exports = function sendWelcomeMail(ctx, user) {
  return ctx.sendMail('welcome', { to: user.email, subject: 'Bienvenido' }, {
    user,
    // buildActivePath: ctx.router.url('activeUser', { token: user.activeToken }) 
  });
};
