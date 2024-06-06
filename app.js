const express = require("express");
const app = express();

const { engine } = require("express-handlebars");
const methodOverride = require("method-override");

const db = require("./models");
const { raw } = require("mysql2");
const Restaurant = db.Restaurant;

const port = 3000;

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

// 設定靜態文件夾
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// 根目錄
app.get("/", (req, res) => {
  res.render("index");
});

// 顯示餐廳全部清單頁面
app.get("/restaurants", (req, res) => {
  return Restaurant.findAll({
    attributes: [
      "id",
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
    raw: true,
  })
    .then((restaurants) => {
      res.render("index", { restaurants });
    })
    .catch((err) => {
      console.log(err);
    });
});

// 顯示新增餐廳的頁面(不做修改)
app.get("/restaurants/new", (req, res) => {
  res.render("new");
});

// 顯示單一餐廳的頁面
app.get("/restaurants/:id", (req, res) => {
  const id = req.params.id;
  return Restaurant.findByPk(id, {
    attributes: [
      "id",
      "name",
      "name_en",
      "location",
      "image",
      "category",
      "phone",
      "description",
      "google_map",
    ],
    raw: true,
  })
    .then((restaurant) => res.render("restaurant", { restaurant }))
    .catch((err) => console.log(err));
});

// 新增餐廳(會修改原本的restaurants頁面，使用 POST)
app.post("/restaurants", (req, res) => {
  const {
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description,
  } = req.body;

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
  })
    .then(() => res.redirect("/restaurants"))
    .catch((err) => console.log(err));
});

// 顯示編輯餐廳頁面(不做修改)
app.get("/restaurants/:id/edit", (req, res) => {
  const id = req.params.id;
  return Restaurant.findByPk(id, {
    attributes: [
      "id", // 確保ID也被查詢出來
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
    raw: true,
  })
    .then((restaurant) => res.render("edit", { restaurant }))
    .catch((err) => console.log(err));
});

// 更新、編輯餐廳(會修改，使用 PUT)
app.put("/restaurants/:id", (req, res) => {
  const body = req.body;
  const id = req.params.id;

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
    },
    { where: { id } }
  )
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch((err) => console.log(err));
});

// 刪除餐廳(會修改)
app.delete("/restaurants/:id", (req, res) => {
  const id = req.params.id;
  return Restaurant.destroy({ where: { id } })
    .then(() => res.redirect("/restaurants"))
    .catch((err) => console.log(err));
});

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port} `);
});
