const openMenu = document.querySelector("#open-menu"),
    closeMenu = document.querySelector("#close-menu"),
    aside = document.querySelector("aside");


openMenu.addEventListener("click", () => {
    aside.classList.add("aside-visible");
});


closeMenu.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
});


categoryButtons.forEach((button) => button.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
}));