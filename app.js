"use strict"

const express = require('express')
const flash = require('connect-flash')

const session = require('express-session')
const app = express()
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const path = require('path')
const db = require('./models')
// const { raw } = require('mysql2')
const Restaurant = db.Restaurant

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

// 根目錄，重新導向至首頁
app.get('/', (req, res) => {
  res.redirect('restaurants')
})

// 顯示新增餐廳的頁面(不做修改)
app.get('/restaurants/new', (req, res) => {
  res.render('new', { error:req.flash('error')})
  // { error:req.flash('error')} 顯示新增錯誤的訊息
})

// 顯示餐廳全部清單頁面
app.get('/restaurants', (req, res) => {
  try {
    return Restaurant.findAll({
      attributes: [
        'id',
        'name',
        'name_en',
        'category',
        'image',
        'location',
        'phone',
        'google_map',
        'rating',
        'description',
        'isComplete'
      ],
      raw: true
    }).then((restaurants) => {
      res.render('index', { restaurants, message: req.flash('sucess') })
    }).catch((err) => {
      console.log(err)
    })
  }
  catch (err) {
    console.log(err)
  }
})

// 顯示搜尋餐廳的頁面
app.get('/restaurants/search', (req, res) => {
  const keyword = req.query.keyword?.trim()

  if (!keyword) {
    // 如果沒有關鍵字，直接導向至首頁，顯示所有餐廳
    return Restaurant.findAll({ raw: true })
      .then((restaurants) => res.render('index', { restaurants }))
      .catch((err) => console.log(err))
  }

  // 透過關鍵字找出餐廳陣列中符合的餐廳
  Restaurant.findAll({ raw: true })
    .then((restaurants) => {
      const matchedRestaurants = restaurants.filter((info) =>
        Object.values(info).some((property) => {
          // 只比對字串屬性
          if (typeof property === 'string') {
            return property.toLowerCase().includes(keyword.toLowerCase())
          }
          return false
        })
      )
      console.log(matchedRestaurants) // 調試輸出
      res.render('search', { restaurants: matchedRestaurants, keyword })
    })
    .catch((err) => console.log(err))
})

// 顯示單一餐廳的頁面
// 動態路由要設置在靜態路由後面
// 否則可能會出現渲染到錯誤路由的問題
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findByPk(id, {
    attributes: [
      'id',
      'name',
      'name_en',
      'location',
      'image',
      'category',
      'phone',
      'description',
      'google_map'
    ],
    raw: true
  })
    .then((restaurant) => res.render('restaurant', { restaurant }))
    .catch((err) => console.log(err))
})

// 新增餐廳(會修改原本的restaurants頁面，使用 POST)
app.post('/restaurants', (req, res) => {
  try {
    const {
      name,
      name_en,
      category,
      image,
      location,
      phone,
      google_map,
      rating,
      description
    } = req.body

    return Restaurant.create({
      name,
      name_en,
      category,
      image,
      location,
      phone,
      google_map,
      rating,
      description,
      isComplete: true
    })
      .then(() => {
        req.flash('success', '新增成功')
        return res.redirect('/restaurants')
      })
      .catch((err) => {
        console.log(err)
        req.flash('error', '新增失敗')
        return res.redirect('back')
      })
  }
  catch (err) {
    console.log(err)
    req.flash('error', '新增失敗')
    return res.redirect('back')
  }
})

// 顯示編輯餐廳頁面(不做修改)
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findByPk(id, {
    attributes: [
      'id', // 確保ID也被查詢出來
      'name',
      'name_en',
      'category',
      'image',
      'location',
      'phone',
      'google_map',
      'rating',
      'description'
    ],
    raw: true
  })
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch((err) => console.log(err))
})

// 更新、編輯餐廳(會修改，使用 PUT)
app.put('/restaurants/:id', (req, res) => {
  const body = req.body
  const id = req.params.id

  return Restaurant.update(
    {
      name: body.chnameEdit,
      name_en: body.ennameEdit,
      category: body.categoryEdit,
      image: body.imgEdit,
      location: body.locationEdit,
      phone: body.phoneEdit,
      google_map: body.mapEdit,
      rating: body.ratingEdit,
      description: body.descriptionEdit,
      isComplete: true
    },
    { where: { id } }
  )
    .then(() => {
      req.flash('success', '修改成功')
      return res.redirect(`/restaurants/${id}`)
    })
    .catch((err) => console.log(err))
})

// 刪除餐廳(會修改)
app.delete('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.destroy({ where: { id } })
    .then(() => {
      req.flash('success', '刪除成功')
      return res.redirect('/restaurants')
    })
    .catch((err) => {
      req.flash('error', '刪除失敗')
      console.log(err)
    })
})

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`)
})
