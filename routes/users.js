const express = require('express')
const router = express.Router()

const validator = require('validator')

const db = require('../models')
const User = db.User

// router.get('/', (req, res) => {
//   res.render('register')
// })

router.get('/register', (req, res) => {
  res.render('register')
})

// 註冊完成，跳至登入頁面的路由
router.get('/login', (req, res) => {
  res.render('login')
})

// form action也要連到此頁面，才會將資料傳進資料庫
// 使用 async 關鍵字定義一個異步函數。這意味著這個函數內部可以使用 await
router.post('/register', async (req, res) => {
  // 每個輸入元素的 name 屬性與資料庫欄位名稱一致。這樣提交表單時，伺服器能夠正確接收這些數據。
  const { username, email, password, passwordCheck } = req.body

  // 在異步操作之前，我們需要檢查用戶輸入是否正確。
  // 如果輸入有誤，立即返回並終止後續代碼執行。
  if (!email || !password) {
    req.flash('register_error', 'email & password 為必填')
    return res.redirect('register')
  } else if (password !== passwordCheck) {
    req.flash('register_error', '驗證密碼與密碼不符')
    return res.redirect('register')
  } else if (!validator.isEmail(email)) {
    req.flash('register_error', '驗證失敗')
    return res.redirect('register')
  }

  // 這行代碼使用 await 等待 User.findOne 查詢結果。
  // 因為 findOne 是一個異步操作，使用 await 使得代碼在此處暫停，直到查詢完成並返回結果。
  // 第一個 email：是資料庫欄位的名稱; 第二個 email：是從請求體中提取的變數，包含使用者輸入的值
  try {
    const existingUser = await User.findOne({ where: { email: email } })
    if (existingUser) {
      // 如果查詢到用戶已經存在，設置錯誤信息並重定向到註冊頁面。
      req.flash('register_error', '信箱已被註冊')
      return res.redirect('register')
    }

    // 如果 email 未註冊，創建新用戶，並使用 await 等待創建操作完成。
    await User.create({ username, email, password })
    req.flash('register_success', '註冊成功')
    return res.redirect('login')
  } catch (err) {
    console.log(err)
    req.flash('register_error', '伺服器錯誤，註冊失敗')
    return res.redirect('register')
  }
})

module.exports = router
