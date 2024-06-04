const express = require("express");
const app = express();
const db = require("./models");
const Restaurant = db.Restaurant;

const port = 3000;

// 根目錄
app.get("/", (req, res) => {
  res.send("hello world");
});

// 顯示餐廳全部清單頁面
app.get("/restaurants", (req, res) => {
  return Restaurant.findAll()
    .then((restaurants) => res.send({ restaurants }))
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
