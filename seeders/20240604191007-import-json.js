'use strict'

const fs = require('fs') // 用於讀取文件
const path = require('path') // 用於處理文件路徑

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 讀取 JSON 文件的內容
    const filePath = path.join(__dirname, '..', 'restaurant.json') // 設定 JSON 文件的路徑
    const fileContent = fs.readFileSync(filePath, 'utf8') // 讀取文件內容
    const data = JSON.parse(fileContent) // 解析 JSON 文件

    // 確保 data.restaurants 是一個陣列
    if (!Array.isArray(data.results)) {
      throw new Error('Invalid JSON format: expected an array of restaurants')
    }

    // 給每個餐廳添加 createdAt 和 updatedAt 欄位
    const timestamp = new Date() // 當前時間
    const restaurantsWithTimestamps = data.results.map((restaurant) => ({
      ...restaurant, // 保留原有的餐廳數據
      createdAt: timestamp, // 新增 createdAt 欄位
      updatedAt: timestamp // 新增 updatedAt 欄位
    }))

    // 使用 queryInterface 將數據插入到 Restaurants 表中
    return queryInterface.bulkInsert(
      'Restaurants',
      restaurantsWithTimestamps,
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    // 刪除 Restaurants 表中的所有數據
    return queryInterface.bulkDelete('Restaurants', null, {})
  }
}
