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
              [ctx.orm.Sequelize.Op.like]: `%${query}%`,
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
              [ctx.orm.Sequelize.Op.like]: `%${query}%`,
            },
          },
          {
            title: {
              [ctx.orm.Sequelize.Op.like]: `%${query}%`,
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
              [ctx.orm.Sequelize.Op.like]: `%${query}%`,
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
  }
});

module.exports = router;
