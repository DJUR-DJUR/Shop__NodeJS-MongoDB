const {Router} = require('express')
const router = Router()
const User = require('../models/user')

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Авторизация',
    isLogin: true
  })
})

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login')
  })
})

router.post('/login', async (req, res) => {
  const user = await User.findById('62eb8e88c7946e65fe6e962a')
  req.session.user = user
  req.session.isAuthenticated = true
  req.session.save(err => {
    if (err) {
      throw err
    }
    res.redirect('/')
  })
})

module.exports = router