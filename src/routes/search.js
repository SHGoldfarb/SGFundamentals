const KoaRouter = require('koa-router');
const _ = require('lodash');

const router = KoaRouter();

router.get('search', '/', async (ctx) => {
  if (ctx.query.query) {
    const query = ctx.query.query;
    const excercises = await ctx.orm.excercise.findAll({
      where: {
        [ctx.orm.Sequelize.Op.or]: [
          {
            content: {
              [ctx.orm.Sequelize.Op.iLike]: `%${query}%`,
            },
          },
        ],
      },
    });
    const questions = await ctx.orm.question.findAll({
      where: {
        [ctx.orm.Sequelize.Op.or]: [
          {
            content: {
              [ctx.orm.Sequelize.Op.iLike]: `%${query}%`,
            },
          },
          {
            title: {
              [ctx.orm.Sequelize.Op.iLike]: `%${query}%`,
            },
          },
        ],
      },
    });
    const comments = await ctx.orm.comment.findAll({
      where: {
        [ctx.orm.Sequelize.Op.or]: [
          {
            content: {
              [ctx.orm.Sequelize.Op.iLike]: `%${query}%`,
            },
          },
        ],
      },
    });
    const result = _.reverse(_.sortBy(_.concat(questions, excercises, comments), ['createdAt']));
    await ctx.render('/search/result', {
      query,
      result,
      buildQuestionPath: id => ctx.router.url('question', { id }),
      buildExcercisePath: id => ctx.router.url('excercise', { id }),
    });
  } else {
    throw new Error('Not Found');
  }
});

router.get('/update-algolia', async (ctx) => {
  const guides = await ctx.orm.guide.findAll({
    attributes: [['id', 'objectID'], 'title'],
    raw: true,
  });
  const excercises = await ctx.orm.excercise.findAll({
    attributes: [['id', 'objectID'], 'content'],
    raw: true,
  });
  const questions = await ctx.orm.question.findAll({
    attributes: [['id', 'objectID'], 'title', 'content'],
    raw: true,
  });
  const comments = await ctx.orm.comment.findAll({
    attributes: [['id', 'objectID'], 'content'],
    raw: true,
  });
  ctx.guideIndex.clearIndex((err, content) => {
    ctx.guideIndex.waitTask(content.taskID, (err2) => {
      ctx.guideIndex.addObjects(guides);
    });
  });
  ctx.excerciseIndex.clearIndex((err, content) => {
    ctx.excerciseIndex.waitTask(content.taskID, (err2) => {
      ctx.excerciseIndex.addObjects(excercises);
    });
  });
  ctx.questionIndex.clearIndex((err, content) => {
    ctx.questionIndex.waitTask(content.taskID, (err2) => {
      ctx.questionIndex.addObjects(questions);
    });
  });
  ctx.commentIndex.clearIndex((err, content) => {
    ctx.commentIndex.waitTask(content.taskID, (err2) => {
      ctx.commentIndex.addObjects(comments);
    });
  });
  ctx.customErrorMessage = 'Algolia Updated';
  throw new Error('Not Found');
});


module.exports = router;
