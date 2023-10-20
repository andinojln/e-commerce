let products = [];


fetch("./js/products.json")
    .then((res) => res.json())
    .then((data) => {
        products = data;

        uploadProducts(products);
    });


const productsContainer = document.querySelector("#products-container");
const productsFragment = document.createDocumentFragment();
const categoryButtons = document.querySelectorAll(".btn-category");
const mainTitle = document.querySelector("#main-title");
let addButtons = document.querySelectorAll(".product-add");
const number = document.querySelector("#number");


function uploadProducts(chosenProducts) {
    productsContainer.innerHTML = "";

    chosenProducts.forEach((product) => {
        const div = document.createElement("div");

        div.classList.add("product");

        div.innerHTML = `
            <img class="product-img" src="${product.image}" alt="${product.title}">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-description">${product.description}</p>
            <p class="product-price">$ ${product.price}</p>
            <button class="product-add" id="${product.id}">Agregar</button>
        `;

        productsFragment.appendChild(div);
    });
    
    productsContainer.appendChild(productsFragment);

    updateAddButtons();
    // console.log(addButtons);
}


categoryButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
        categoryButtons.forEach((button) => button.classList.remove("active"));

        e.currentTarget.classList.add("active");

        if (e.currentTarget.id != "all") {
            const productCategory = products.find((product) => product.category.id === e.currentTarget.id);
            // console.log(productCategory);

            mainTitle.innerText = productCategory.category.name;

            const productsButton = products.filter((product) => product.category.id === e.currentTarget.id);

            uploadProducts(productsButton);
        } else {
            mainTitle.innerText = "Todos los productos";

            uploadProducts(products);
        }
    });
});


function updateAddButtons() {
    addButtons = document.querySelectorAll(".product-add");

    addButtons.forEach((button) => {
        button.addEventListener("click", addToCart);
    });
}


const productsInCartLS = localStorage.getItem("products-in-cart");
let productsInCart;


if (productsInCartLS) {
    productsInCart = JSON.parse(productsInCartLS);

    updateNumber();
} else {
    productsInCart = [];
}


function addToCart(e) {
    Toastify({
        text: "Agregado al carrito",
        duration: 2000,
        destination: "",
        close: false,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: false, // Prevents dismissing of toast on hover
        style: {
            background: "#ff5e00",
            color: "#fff",
            fontSize: "small"
        },
        onClick: function(){} // Callback after click
    }).showToast();

    const buttonId = e.currentTarget.id;
    // console.log(buttonId);

    const addedProduct = products.find((product) => product.id === buttonId);
    // console.log(addedProduct);

    if (productsInCart.some((product) => product.id === buttonId)) {
        const index = productsInCart.findIndex((product) => product.id === buttonId);
        // console.log(index);

        productsInCart[index].quantity ++;
    } else {
        addedProduct.quantity = 1;
        productsInCart.push(addedProduct);
    }

    // console.log(productsInCart);

    updateNumber();

    localStorage.setItem("products-in-cart", JSON.stringify(productsInCart));
}


function updateNumber() {
    let newNumber = productsInCart.reduce((acc, product) => acc + product.quantity, 0);

    number.innerText = newNumber;

    // console.log(newNumber);
}