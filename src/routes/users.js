const KoaRouter = require('koa-router');

const router = new KoaRouter();


// GET /users
router.get('users', '/', async (ctx) => {
  const users = await ctx.orm.user.findAll();
  await ctx.render('users/index', {
    users,
    buildUserPath: user =>
      ctx.router.url('user', { id: user.id }),
  });
});

// GET /users/new
router.get('usersNew', '/new', async (ctx) => {
  const user = ctx.orm.user.build();
  await ctx.render('users/new', {
    user,
    createUserPath: ctx.router.url('usersCreate'),
  });
});

// POST /users
router.post('usersCreate', '/', async (ctx) => {
  const roles = await ctx.orm.role.findAll({
    where: {
      tag: 'user',
    },
  });

  const role = roles[0];

  const user = await ctx.orm.user.create(ctx.request.body);
  user.addRole(role);
  // role.addUser(user);

  ctx.redirect(ctx.router.url('users'));
});

// GET /user/1
router.get('user', '/:id', async (ctx) => {
  const user = await ctx.orm.user.findById(ctx.params.id);
  const roles = await user.getRoles();
  await ctx.render('users/show', { user, roles });
});

module.exports = router;
