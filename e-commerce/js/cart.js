const emptyCartContainer = document.querySelector("#empty-cart");
const cartProductsContainer = document.querySelector("#cart-products");
const cartActionsContainer = document.querySelector("#cart-actions");
const purchasedCartContainer = document.querySelector("#purchased-cart");
const fragment = document.createDocumentFragment();
let deleteButtons = document.querySelectorAll(".cart-product-remove");
const emptyButton = document.querySelector("#cart-actions-empty");
const totalContainer = document.querySelector("#total");
const buyButton = document.querySelector("#cart-actions-buy");


let productsInCart = localStorage.getItem("products-in-cart");

productsInCart = JSON.parse(productsInCart);

// console.log(productsInCart);


function uploadProductsCart() {
    if (productsInCart && productsInCart.length > 0) {
        emptyCartContainer.classList.add("disabled");
        cartProductsContainer.classList.remove("disabled");
        cartActionsContainer.classList.remove("disabled");
        purchasedCartContainer.classList.add("disabled");
    
        cartProductsContainer.innerHTML = "";
    
        productsInCart.forEach((product) => {
            const div = document.createElement("div");
    
            div.classList.add("cart-product");
    
            div.innerHTML = `
                <img class="cart-product-img" src="${product.image}" alt=${product.title}>
                <div class="cart-product-title">
                    <small>Nombre</small>
                    <h3>${product.title}</h3>
                </div>
                <div class="cart-product-amount">
                    <p>x ${product.quantity}</p>
                </div>
                <div class="cart-product-price">
                    <small>Precio</small>
                    <p>$${product.price}</p>
                </div>
                <div class="cart-product-subtotal">
                    <small>Subtotal</small>
                    <p>$${product.price * product.quantity}</p>
                </div>
                <button id="${product.id}" class="cart-product-remove">
                    <i class="bi bi-x-lg"></i>
                </button>
            `;
    
            fragment.appendChild(div);
        });
    
        cartProductsContainer.appendChild(fragment);
    } else {
        emptyCartContainer.classList.remove("disabled");
        cartProductsContainer.classList.add("disabled");
        cartActionsContainer.classList.add("disabled");
        purchasedCartContainer.classList.add("disabled");
    }

    updateDeleteButtons();
    updateTotal();
}


uploadProductsCart();


function updateDeleteButtons() {
    deleteButtons = document.querySelectorAll(".cart-product-remove");

    deleteButtons.forEach((button) => {
        button.addEventListener("click", removeFromCart);
    });
}


function removeFromCart(e) {
    Toastify({
        text: "Producto eliminado",
        duration: 1000,
        destination: "",
        close: false,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "#ff5e00",
            color: "#fff",
            fontSize: "small"
        },
        onClick: function(){} // Callback after click
    }).showToast();

    const buttonId = e.currentTarget.id;
    const index = productsInCart.findIndex((product) => product.id === buttonId);

    productsInCart.splice(index, 1);
    uploadProductsCart();

    localStorage.setItem("products-in-cart", JSON.stringify(productsInCart));
}


emptyButton.addEventListener("click", emptyCart);


function emptyCart() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: `Se eliminarán ${productsInCart.reduce((acc, product) => acc + product.quantity, 0)} productos del carrito`,
        icon: 'warning',
        iconColor: "#000",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonColor: '#000',
        cancelButtonColor: '#9b9b9b',
        confirmButtonText: 'Confirmar',
        cancelButtonText: "Cancelar"
    })
    .then((result) => {
        if (result.isConfirmed) {
            productsInCart.length = 0;
    
            localStorage.setItem("products-in-cart", JSON.stringify(productsInCart));

            uploadProductsCart();
        }
    });
}


function updateTotal() {
    const calculatedTotal = productsInCart.reduce((acc, product) => acc + (product.price * product.quantity), 0);

    totalContainer.innerText = `$${calculatedTotal}`;
}


buyButton.addEventListener("click", buyCart);


function buyCart() {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: false,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    Toast.fire({
        icon: 'success',
        title: 'Pago realizado.'
    });

    productsInCart.length = 0;
    
    localStorage.setItem("products-in-cart", JSON.stringify(productsInCart));

    emptyCartContainer.classList.add("disabled");
    cartProductsContainer.classList.add("disabled");
    cartActionsContainer.classList.add("disabled");
    purchasedCartContainer.classList.remove("disabled");
}