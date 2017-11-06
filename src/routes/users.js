const _ = require('lodash');
const KoaRouter = require('koa-router');
const sendWelcomeEmail = require('../mailers/welcome');

const router = new KoaRouter();

router.use('/', async (ctx, next) => {
  ctx.state.submitUserPath = ctx.router.url('usersCreate');
  await next();
});


// GET /users
router.get('users', '/', async (ctx) => {
  if (!await ctx.redirectIfNotAdmin()) {
    const users = await ctx.orm.user.findAll({ include: [ctx.orm.role] });
    const roles = await ctx.orm.role.findAll();
    await ctx.render('users/index', {
      users,
      roles,
      newUserPath: ctx.router.url('usersNew'),
      buildEditUserPath: id =>
        ctx.router.url('usersEdit', { id }),
      buildChangeRolesPath: id =>
        ctx.router.url('usersChangeRole', { id }),
    });
  }
});

// GET /users/new
router.get('usersNew', '/new', async (ctx) => {
  if (!ctx.redirectIfLogged('/')) {
    const user = ctx.orm.user.build();
    return ctx.render('users/new', {
      user,
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
  const excercises = await user.getExcercises();
  const comments = await user.getComments();
  const questions = await user.getQuestions();
  const guides = await user.getGuides();
  const votes = await user.getVotes({ include: [
    ctx.orm.excercise, ctx.orm.question, ctx.orm.comment, ctx.orm.guide,
  ] });
  for (const i in votes) {
    votes[i].parent = votes[i].excercise || votes[i].question || votes[i].comment || votes[i].guide;
  }
  const userActivities = _.orderBy(
    _.concat(excercises, comments, questions, votes, guides),
    ['createdAt'],
    ['desc'],
  ).slice(0, 20);
  const allVotes = await ctx.orm.vote.findAll({
    include: [ctx.orm.excercise, ctx.orm.guide, ctx.orm.comment, ctx.orm.question],
  });
  let rating = 0;
  for (const i in allVotes) {
    const parent = (
      allVotes[i].excercise || allVotes[i].question ||
      allVotes[i].comment || allVotes[i].guide
    );
    if (parent.userId === user.id) {
      if (allVotes[i].type === true) {
        rating += 1;
      } else {
        rating -= 1;
      }
    }
  }
  user.rating = rating;
  await ctx.render('users/profile', {
    user,
    userActivities,
    buildQuestionPath: id => ctx.router.url('question', { id }),
    buildExcercisePath: id => ctx.router.url('excercise', { id }),
    buildCommentPath: id => ctx.router.url('comment', { id }),
    buildGuidePath: id => ctx.router.url('guide', { id }),
    buildDynamicPath: (resource, id) => ctx.router.url(resource, { id }),
  });
});

// GET /user/1/edit
router.get('usersEdit', '/:id/edit', async (ctx) => {
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
