const express = require("express");
const app = express();

const {engine} = require('express-handlebars');

const db = require("./models");
const { raw } = require("mysql2");
const Restaurant = db.Restaurant;

const port = 3000;

app.engine('.hbs',engine({extname:'.hbs'}))
app.set('view engine', '.hbs');
app.set('views', './views')
// 設定靜態文件夾
app.use(express.static('public'));

// 根目錄
app.get("/", (req, res) => {
  res.render("index");
});

// 顯示餐廳全部清單頁面
app.get("/restaurants", (req, res) => {
  return Restaurant.findAll({
    attributes: [
      "name",
      "name_en",
      "category",
      "image",
      "location",
      "phone",
      "google_map",
      "rating",
      "description",
    ],
    raw:true
  })
    .then((restaurants) =>{
      res.render('index', {restaurants})
    } )
      
    .catch((err) => {
      console.log(err);
    });
});

// 顯示單一餐廳的頁面
app.get("/restaurants/:id", (req, res) => {
  res.send("Welcome to the restaurant - detail");
});

// 顯示新增餐廳的頁面(不做修改)
app.get("/restaurants/new", (req, res) => {
  res.send("This is the page for adding new restaurants");
});

// 新增餐廳(會修改，使用 POST)
app.post("/restaurants/", (req, res) => {
  res.send("add restaurant");
});

// 顯示編輯餐廳頁面(不做修改)
app.get("/restaurants/:id/edit", (req, res) => {
  res.send("This is the page for editing your restaurant");
});

// 更新、編輯餐廳(會修改，使用 PUT)
app.put("/restaurant/:id", (req, res) => {
  res.send("update!!");
});

// 刪除餐廳(會修改)
app.delete("restaurant/:id", (req, res) => {
  res.send("delete");
});

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port} `);
});
