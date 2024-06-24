const express = require('express')
const router = express.Router()

// 引入其他路由模塊，當前目錄中有一個名為 restaurants.js 的文件，這個文件中定義了與餐廳相關的路由和處理邏輯
const restaurants = require('./restaurants')
const users = require('./users')

// 將 /restaurants 開頭的請求交給 restaurants 路由模塊處理
router.use('/restaurants', restaurants)
router.use('/users', users)

router.get('/', (req, res) => {
  res.redirect('/restaurants')
})

// 這行代碼將配置好的路由器導出，這樣其他文件可以引入並使用這個路由器來處理請求。
module.exports = router
