const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.delete('sessionDestroy', 'sign_out', async (ctx) => {
  ctx.session = null;
  ctx.redirect(ctx.router.url('sessionNew'));
});

router.use(async(ctx,next) => {
  if(ctx.state.currentUser){
    ctx.redirect("/");
  }
  await next();
})

router.get('sessionNew', 'sign_in', async (ctx) => {
  await ctx.render('sessions/new', {
    createSessionPath: ctx.router.url('sessionCreate'),
  })
})

router.post('sessionCreate','sign_in',async (ctx) => {
  console.log('gogo')
  const { username, password } = ctx.request.body;
  try{
    let user = await ctx.orm.user.find({where: {username}})
    if(!user){
      user = await ctx.orm.user.find({where: {email: username}})
    }
    const validPassword = user.checkPassword(password);
    if(validPassword){
      ctx.session.userId = user.id;
      ctx.redirect('/')
    }
    throw "error"
  }catch (error){
    await ctx.render('sessions/new',{
      username,
      createSessionPath: ctx.router.url('sessionCreate'),
      error: "Nombre de usuario, E-mail o Contraseña incorrectos"
    })
  }
});



module.exports = router;
