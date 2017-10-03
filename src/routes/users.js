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
  if (!ctx.redirectIfLogged('/')) {
    const user = ctx.orm.user.build();
    return ctx.render('users/new', {
      user,
      submitUserPath: ctx.router.url('usersCreate'),
    });
  }
  return null;
});

// POST /users
router.post('usersCreate', '/', async (ctx) => {
  if (!ctx.redirectIfLogged('/')) {
    const user = await ctx.orm.user.build(ctx.request.body);
    if (ctx.request.body.password !== ctx.request.body.passwordR) {
      return ctx.render('users/new', {
        user,
        submitUserPath: ctx.router.url('usersCreate'),
        error: 'Las contraseñas no coinciden.',
      });
    }
    const roles = await ctx.orm.role.findAll({
      where: {
        tag: 'user',
      },
    });

    const role = roles[0];

    await user.save();
    await user.addRole(role);
    ctx.session.userId = user.id;
    return ctx.redirect('/');
  }
  return null;
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
    submitUserPath: ctx.router.url('usersUpdate', user.id),
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
  await user.setQuestions([]);
  await user.setExcercises([]);
  await user.setComments([]);
  await user.setRoles([]);
  await user.destroy();
  ctx.redirect(ctx.router.url('users'));
});

module.exports = router;
