const pool = require("../config/db");

async function getProducts(req, res) {
    try {

        // Read query parameters
       const { updated_at, id, category } = req.query;

        

       

let products;

if (!category && !updated_at && !id) {

    // First page
    [products] = await pool.query(`
        SELECT *
        FROM products
        ORDER BY updated_at DESC, id DESC
        LIMIT 20
    `);

} else if (category && !updated_at && !id) {

    // First page with category
    [products] = await pool.query(
        `
        SELECT *
        FROM products
        WHERE category = ?
        ORDER BY updated_at DESC, id DESC
        LIMIT 20
        `,
        [category]
    );

} else if (!category && updated_at && id) {

    // Next page
    [products] = await pool.query(
        `
        SELECT *
        FROM products
        WHERE
            updated_at < ?
            OR (updated_at = ? AND id < ?)
        ORDER BY updated_at DESC, id DESC
        LIMIT 20
        `,
        [updated_at, updated_at, id]
    );

} else {

    // Next page with category
    [products] = await pool.query(
        `
        SELECT *
        FROM products
        WHERE category = ?
        AND (
            updated_at < ?
            OR (updated_at = ? AND id < ?)
        )
        ORDER BY updated_at DESC, id DESC
        LIMIT 20
        `,
        [category, updated_at, updated_at, id]
    );

}

const lastProduct =
    products.length > 0
        ? products[products.length - 1]
        : null;

res.status(200).json({
    products,
    nextCursor: lastProduct
        ? {
              updated_at: lastProduct.updated_at,
              id: lastProduct.id,
          }
        : null,
});

      

    } catch (error) {

        console.error("Error fetching products:", error);

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports = {
    getProducts
};