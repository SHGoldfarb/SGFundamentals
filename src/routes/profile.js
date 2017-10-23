const _ = require('lodash');
const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('profile', '/', async (ctx) => {
  const excercise = await ctx.orm.excercise.findAll({
    where: {
      userId: ctx.state.currentUser.id,
    },
  });
  const comment = await ctx.orm.comment.findAll({
    where: {
      userId: ctx.state.currentUser.id,
    },
  });
  const question = await ctx.orm.question.findAll({
    where: {
      userId: ctx.state.currentUser.id,
    },
  });
  const votes = await ctx.orm.vote.findAll({
    where: {
      userId: ctx.state.currentUser.id,
    },
  });
  for (i in votes) {
    votes[i].parent = await votes[i].getParent();
  }
  const guides = await ctx.orm.guide.findAll({
    where: {
      userId: ctx.state.currentUser.id,
    },
  });
  const userActivities = _.orderBy(
    _.concat(excercise, comment, question, votes, guides),
    ['createdAt'],
    ['desc'],
  ).slice(0, 20);
  await ctx.render('users/profile', {
    userActivities,
    buildQuestionPath: id => ctx.router.url('question', { id }),
    buildExcercisePath: id => ctx.router.url('excercise', { id }),
    buildCommentPath: id => ctx.router.url('comment', { id }),
    buildGuidePath: id => ctx.router.url('guide', { id }),
    buildDynamicPath: (resource, id) => ctx.router.url(resource, { id }),
  });
});

module.exports = router;
