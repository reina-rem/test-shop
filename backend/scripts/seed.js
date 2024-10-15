const mysql = require('mysql2/promise');
const fs = require('fs');

// Чтение данных из файла JSON
const data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));

// Настройка соединения с базой данных
const connectionConfig = {
  host: '172.17.0.2',
  user: 'root',
  password: 'qwerty',
  database: 'test-shop'
};

async function insertData() {
  const connection = await mysql.createConnection(connectionConfig);

  try {
    // Отключаем авто-коммит для транзакции
    await connection.beginTransaction();

    // Вставка категорий
    const categoryMap = {};
    for (const category of data.categories) {
      const [result] = await connection.execute(
        'INSERT INTO categories (name) VALUES (?)',
        [category.name]
      );
      categoryMap[category.name] = result.insertId;
    }

    // Вставка продуктов и связанных данных
    for (const product of data.products) {
      // Вставка продукта
      const [result] = await connection.execute(
        `INSERT INTO products (productId, name, inStock, description, brand, category_id) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          product.productId,
          product.name,
          product.inStock ? 1 : 0,
          product.description,
          product.brand,
          categoryMap[product.category]
        ]
      );
      const productId = result.insertId;

      // Вставка изображений
      for (const src of product.gallery) {
        await connection.execute(
          'INSERT INTO images (src, product_id) VALUES (?, ?)',
          [src, productId]
        );
      }

      // Вставка атрибутов и опций без проверки на существование
      for (const attribute of product.attributes) {
        // Вставка атрибута
        await connection.execute(
          'INSERT INTO attributes (name, type) VALUES (?, ?)',
          [attribute.name, attribute.type]
        );

        // Получение id только что вставленного атрибута
        const [attrResult] = await connection.execute(
          'SELECT id FROM attributes WHERE name = ? AND type = ? ORDER BY id DESC LIMIT 1',
          [attribute.name, attribute.type]
        );
        const attributeId = attrResult[0].id;

        // Связываем атрибут с продуктом
        await connection.execute(
          'INSERT INTO attribute_product (attribute_id, product_id) VALUES (?, ?)',
          [attributeId, productId]
        );

        // Обработка опций атрибута
        for (const option of attribute.options) {
          await connection.execute(
            'INSERT INTO options (optionId, value, attribute_id) VALUES (?, ?, ?)',
            [option.optionId, option.value, attributeId]
          );
        }
      }

      // Вставка цен и валют
      for (const price of product.prices) {
        // Вставка валюты с использованием ON DUPLICATE KEY UPDATE
        const [currencyResult] = await connection.execute(
          'INSERT INTO currencies (label, symbol) VALUES (?, ?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)',
          [price.currency.label, price.currency.symbol]
        );
        const currencyId = currencyResult.insertId;

        await connection.execute(
          'INSERT INTO prices (amount, currency_id, product_id) VALUES (?, ?, ?)',
          [price.amount, currencyId, productId]
        );
      }
    }

    // Коммит транзакции
    await connection.commit();
    console.log('Данные успешно вставлены!');
  } catch (error) {
    // Откат транзакции в случае ошибки
    await connection.rollback();
    console.error('Ошибка вставки данных:', error);
  } finally {
    // Закрытие соединения
    await connection.end();
  }
}

insertData().catch(console.error);
