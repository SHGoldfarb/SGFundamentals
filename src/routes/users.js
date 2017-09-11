const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('users', '/', async (ctx) => {
  const users = await ctx.orm.user.findAll();
  await ctx.render('users/index', { users });
});

router.get('usersNew', '/new', async (ctx) => {
  const user = ctx.orm.user.build();
  await ctx.render('users/new', {
    user,
    createUserPath: ctx.router.url('usersCreate'),
  });
});

router.post('usersCreate', '/', async (ctx) => {
  const role = await ctx.orm.role.create({
    tag: 'user',
  });
  ctx.request.body.roleId = role.id;
  const user = await ctx.orm.user.create(ctx.request.body);
  ctx.redirect(ctx.router.url('users'));
});

module.exports = router;
