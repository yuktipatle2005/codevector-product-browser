const { faker } = require("@faker-js/faker");
const pool = require("../src/config/db");

const categories = [
  "Electronics",
  "Fashion",
  "Books",
  "Sports",
  "Furniture",
  "Toys",
  "Groceries",
];

async function seedDatabase() {
  try {
    console.log("Seeding started...");

    const BATCH_SIZE = 1000;
    const TOTAL_PRODUCTS = 200000;
    const totalBatches = TOTAL_PRODUCTS / BATCH_SIZE;

    for (let batch = 0; batch < totalBatches; batch++) {

      const values = [];

      // Generate 1000 products
      for (let i = 0; i < BATCH_SIZE; i++) {

        const name = faker.commerce.productName();

        const category =
          categories[Math.floor(Math.random() * categories.length)];

        const price = faker.commerce.price({
          min: 100,
          max: 10000,
          dec: 2,
        });

        const created_at = faker.date.past();
        const updated_at = faker.date.between({
            from: created_at,
            to: new Date(),
        });
 

        values.push([
          name,
          category,
          price,
          created_at,
          updated_at,
        ]);
      }

      // Insert all 1000 products in one query
      await pool.query(
        `INSERT INTO products
        (name, category, price, created_at, updated_at)
        VALUES ?`,
        [values]
      );

      console.log(`Batch ${batch + 1} inserted`);
    }

    console.log("✅ 200000 Products Inserted Successfully");

    await pool.end();
    process.exit(0);

  } catch (error) {

    console.error(error);
    await pool.end();

    process.exit(1);
  }
}

seedDatabase();