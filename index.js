const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const cartRoutes = require('./routes/cart')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const ordersRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')
const User = require('./models/user')

const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

const app = express()

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use( async (req, res, next) => {
  try {
    const user = await User.findById('62eb8e88c7946e65fe6e962a')
    req.user = user
    next()
  } catch (error) {
    console.log(error)
  }
  
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)

const PORT = process.env.PORT || 3000

async function start() {
  try {
    const url = "mongodb+srv://vlad:kBDCO6Aguv7TCzV1@cluster0.5dlrlbh.mongodb.net/shop"
    await mongoose.connect(url, {useNewUrlParser: true})

    const candidate = await User.findOne()
    if(!candidate) {
      const user = new User({
        email: 'test@test.com',
        name: 'test',
        cart: {item: []}
      }) 
      await user.save()
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}
start()