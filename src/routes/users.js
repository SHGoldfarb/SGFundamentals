const _ = require('lodash');
const KoaRouter = require('koa-router');
const sendWelcomeEmail = require('../mailers/welcome');

const router = new KoaRouter();


// GET /users
router.get('users', '/', async (ctx) => {
  if (!await ctx.redirectIfNotAdmin()) {
    const users = await ctx.orm.user.findAll({ include: [ctx.orm.role] });
    const roles = await ctx.orm.role.findAll();
    console.log(users);
    await ctx.render('users/index', {
      users,
      roles,
      newUserPath: ctx.router.url('usersNew'),
      buildUserPath: user =>
        ctx.router.url('user', { id: user.id }),
      buildEditUserPath: user =>
        ctx.router.url('usersEdit', { id: user.id }),
      buildChangeRolesPath: user =>
        ctx.router.url('usersChangeRole', { id: user.id }),
    });
  }
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
    // await user.save();
    await user.save({ fields: ['username', 'email', 'password'] });
    await user.addRole(role);
    ctx.session.userId = user.id;
    console.log(process.env.SENDGRID_USER);
    sendWelcomeEmail(ctx, user);
    return ctx.redirect('/');
  }
  return null;
});

// GET /user/1
router.get('user', '/:id', async (ctx) => {
  const user = await ctx.orm.user.findById(ctx.params.id);
  if (!user) {
    ctx.status = 404;
    throw new Error('Not Found');
  }
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
  console.log(ctx.state.currentUser.id);
  if (!await ctx.redirectIfNotOwnerOrAdmin(Number(ctx.params.id))) {
    const user = await ctx.orm.user.findById(ctx.params.id);
    await ctx.render('users/edit', {
      user,
      submitUserPath: ctx.router.url('usersUpdate', user.id),
      deleteUserPath: ctx.router.url('usersDelete', user.id),
    });
  }
});

router.patch('usersUpdate', '/:id', async (ctx) => {
  if (!await ctx.redirectIfNotOwnerOrAdmin(Number(ctx.params.id))) {
    const user = await ctx.orm.user.findById(ctx.params.id);
    await user.update(ctx.request.body, { fields: ['username', 'email', 'password'] });
    // await user.update(ctx.request.body);
    ctx.redirect(ctx.router.url('user', { id: user.id }));
  }
});

router.delete('usersDelete', '/:id', async (ctx) => {
  if (!await ctx.redirectIfNotOwnerOrAdmin(Number(ctx.params.id))) {
    const user = await ctx.orm.user.findById(ctx.params.id);
    await user.setQuestions([]);
    await user.setExcercises([]);
    await user.setComments([]);
    await user.setRoles([]);
    await user.destroy();
    ctx.redirect(ctx.router.url('users'));
  }
});

router.patch('usersChangeRole', '/:id/role', async (ctx) => {
  if (!await ctx.redirectIfNotAdmin()) {
    const user = await ctx.orm.user.findById(ctx.params.id);
    const currentRoles = await user.getRoles();
    const role = await ctx.orm.role.findById(ctx.request.body.roleId);
    switch (ctx.request.body.type) {
      case 'add':
        await user.setRoles(_.concat(currentRoles, role));
        break;
      case 'remove':
        await user.setRoles(_.remove(currentRoles, e => e.id !== role.id));
        break;
      default:
        break;
    }
    ctx.redirect(ctx.router.url('users'));
  }
});

module.exports = router;
