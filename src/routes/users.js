const KoaRouter = require('koa-router');

const router = new KoaRouter();


// GET /users
router.get('users', '/', async (ctx) => {
  const users = await ctx.orm.user.findAll();
  await ctx.render('users/index', {
    users,
    newUserPath: ctx.router.url('usersNew'),
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
  await ctx.render('users/show', {
    user,
    roles,
    editUserPath: ctx.router.url('usersEdit', {
      id: user.id,
    }),
  });
});

// GET /user/1/edit
router.get('usersEdit', '/:id/edit', async (ctx) => {
  const user = await ctx.orm.user.findById(ctx.params.id);
  await ctx.render('users/edit', {
    user,
    updateUserPath: ctx.router.url('usersUpdate', user.id),
    deleteUserPath: ctx.router.url('usersDelete', user.id),
  });
});

router.patch('usersUpdate', '/:id', async (ctx) => {
  const user = await ctx.orm.user.findById(ctx.params.id);
  await user.update(ctx.request.body);
  ctx.redirect(ctx.router.url('user', { id: user.id }));
});

router.delete('usersDelete', '/:id', async (ctx) => {
  const user = await ctx.orm.user.findById(ctx.params.id);
  await user.setRoles([]);
  await user.destroy();
  ctx.redirect(ctx.router.url('users'));
});

module.exports = router;
