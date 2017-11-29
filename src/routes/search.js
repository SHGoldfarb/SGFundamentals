const KoaRouter = require('koa-router');
const _ = require('lodash');

const router = KoaRouter();

router.get('search', '/', async (ctx) => {
  let query = [];
  let result = [];
  if (ctx.query.query) {
    query = ctx.query.query;
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
    result = _.reverse(_.sortBy(_.concat(questions, excercises, comments), ['createdAt']));
  }
  await ctx.render('/search/result', {
    query,
    result,
    buildQuestionPath: id => ctx.router.url('question', { id }),
    buildExcercisePath: id => ctx.router.url('excercise', { id }),
  });
});

router.get('/update-algolia', async (ctx) => {
  const guides = await ctx.orm.guide.findAll({
    attributes: [['id', 'objectID'], 'title'],
    raw: true,
  });
  for (const i in guides) {
    guides[i].url = ctx.state.guidesPath + guides[i].objectID;
    guides[i].objectID += 30000;
    guides[i].type = 'Guide';
  }
  const excercises = await ctx.orm.excercise.findAll({
    attributes: [['id', 'objectID'], 'content'],
    raw: true,
  });
  for (const i in excercises) {
    excercises[i].url = ctx.state.excercisesPath + excercises[i].objectID;
    excercises[i].objectID += 20000;
    excercises[i].type = 'Excercise';
  }
  const questions = await ctx.orm.question.findAll({
    attributes: [['id', 'objectID'], 'title', 'content'],
    raw: true,
  });
  for (const i in questions) {
    questions[i].url = ctx.state.questionsPath + questions[i].objectID;
    questions[i].objectID += 40000;
    questions[i].type = 'Question';
  }
  const comments = await ctx.orm.comment.findAll({
    attributes: [['id', 'objectID'], 'content'],
    raw: true,
  });
  for (const i in comments) {
    comments[i].url = ctx.state.commentsPath + comments[i].objectID;
    comments[i].objectID += 10000;
    comments[i].type = 'Comment';
  }
  ctx.algoliaIndex.clearIndex((err, content) => {
    ctx.algoliaIndex.waitTask(content.taskID, (err2) => {
      ctx.algoliaIndex.addObjects(guides);
      ctx.algoliaIndex.addObjects(comments);
      ctx.algoliaIndex.addObjects(excercises);
      ctx.algoliaIndex.addObjects(questions);
    });
  });
  ctx.algoliaIndex.setSettings({
    customRanking: [
      'desc(objectID)',
    ],
  });
  ctx.customErrorMessage = 'Algolia Updated';
  throw new Error('Not Found');
});


module.exports = router;
