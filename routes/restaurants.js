const express = require('express')
const router = express.Router()

const db = require('../models')
const Restaurant = db.Restaurant

// 顯示新增餐廳的頁面(不做修改)
router.get('/new', (req, res) => {
  res.render('new')
  // { error:req.flash('error')} 顯示新增錯誤的訊息
})

// 顯示餐廳全部清單頁面
router.get('/', (req, res, next) => {
  const page = parseInt(req.query.page) || 1
  const limit = 9
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
    offset: (page - 1) * limit,
    limit,
    raw: true
  }).then((restaurants) => {
    res.render('index', {
      restaurants,
      prev: page > 1 ? page - 1 : page,
      next: page + 1,
      page
    })
  }).catch((error) => {
    error.errorMseeage = '資料取得失敗'
    next(error)
  })
})

// 顯示搜尋餐廳的頁面
router.get('/search', (req, res) => {
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
      res.render('search', { restaurants: matchedRestaurants, keyword })
    })
    .catch((err) => console.log(err))
})

// 顯示單一餐廳的頁面
// 動態路由要設置在靜態路由後面
// 否則可能會出現渲染到錯誤路由的問題
router.get('/:id', (req, res) => {
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
router.post('/', (req, res) => {
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
    .catch((error) => {
      error.errorMseeage = '新增失敗'
      next(error)
    })
})

// 顯示編輯餐廳頁面(不做修改)
router.get('/:id/edit', (req, res) => {
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
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
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

module.exports = router
