"use strict"

const express = require('express')
const flash = require('connect-flash')

const session = require('express-session')
const app = express()
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const path = require('path')
const router = require('./routes')

const port = 3000

app.engine(
  '.hbs',
  engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials')
  })
)
app.set('view engine', '.hbs')
app.set('views', './views')

// 設定靜態文件夾
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
  secret: 'oanda',
  resave: false,
  saveUninitialized: false
}))
app.use(flash())

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success')
  res.locals.error_msg = req.flash('error')
  next()
})

app.use(router)

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`)
})
