const router = require('koa-router')()
const controller = require('./controller')

router.use(controller.error)
router.get('/', controller.home)
router.get('/s', controller.search)
router.get('/p', controller.p)
router.post('/u', controller.upload)
router.get('/pl', controller.pushlocal)

module.exports = router.routes()