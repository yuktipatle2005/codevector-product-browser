const table = document.getElementById("productTable");
const categorySelect = document.getElementById("category");

const loadMoreBtn = document.getElementById("loadMore");
let nextCursor = null;

async function loadProducts(category = "", append = false) {

   let url = "/products";
let params = [];

if (category) {
    params.push(`category=${encodeURIComponent(category)}`);
}

if (append && nextCursor) {
    params.push(`updated_at=${encodeURIComponent(nextCursor.updated_at)}`);
    params.push(`id=${nextCursor.id}`);
}

if (params.length > 0) {
    url += "?" + params.join("&");
}

    const response = await fetch(url);

    const data = await response.json();

    nextCursor = data.nextCursor;

    if (!append) {
        table.innerHTML = "";
    }

    data.products.forEach(product => {

        table.innerHTML += `
            <tr>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>₹${product.price}</td>
                <td>${new Date(product.updated_at).toLocaleString()}</td>
            </tr>
        `;

    });

}

categorySelect.addEventListener("change", () => {

    loadProducts(categorySelect.value);

});

loadMoreBtn.addEventListener("click", () => {
    loadProducts(categorySelect.value, true);
});

loadProducts();