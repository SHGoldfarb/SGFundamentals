const KoaRouter = require('koa-router');

const router = new KoaRouter();


// GET /users
router.get('users', '/', async (ctx) => {
  const users = await ctx.orm.user.findAll();
  await ctx.render('users/index', { users });
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
  // Create a role
  const role = await ctx.orm.role.create({
    tag: 'user',
  });

  // Add roleId to other params
  ctx.request.body.roleId = role.id;

  // Create user
  // TODO: catch error
  const user = await ctx.orm.user.create(ctx.request.body);
  ctx.redirect(ctx.router.url('users'));
});

module.exports = router;
