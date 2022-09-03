//VARIABLES DEL PROYECTO
const card = document.querySelector("#cards");
const cart = document.querySelector(".cartShopping");
const list = document.querySelector("#products-list tbody");
const emptyBtn = document.querySelector("#emptyCart");
const products = document.querySelector("#products");
const surpriseProduct = document.querySelector("#surprise");
const completeBtn = document.querySelector("#confirmPurchase");
let productsCart = [];

//EVENTOS
loadEventListeners();

function loadEventListeners() {
  //AÑADIR PRODUCTO AL CARRITO
  card.addEventListener("click", addToCart);

  //LINK HACIA YOUTUBE DESDE TOASTIFY PARA VER EL PRODUCTO SORPRESA
  surpriseProduct.addEventListener("click", notify);

  //ELIMINAR PRODUCTO
  cart.addEventListener("click", deleteProduct);

  //VACIAR CARRITO POR COMPLETO
  emptyBtn.addEventListener("click", () => {
    Swal.fire({
      icon: "success",
      text: "El carrito ha sido vaciado con éxito",
    });

    productsCart = [];
    //LIMPIAR CARRITO
    cleanCart();
    emptyLS();
  });

  //COMPRA FINALIZADA
  completeBtn.addEventListener("click", () => {
    Swal.fire({
      icon: "question",
      text: "¿Seguro que quieres finalizar la compra?",
      confirmButtonText: "Si",
      confirmButtonColor: "green",
      showDenyButton: "true",
      cancelButtonColor: "red",
    }).then((result) => {
      /*SI LA COMPRA FINALIZA, SE LANZA UNA ALERTA CONFIRMANDO EL PEDIDO Y SUGIRIENDO LLENAR EL FORMULARIO. SE ELIMINAN
      LOS DATOS DEL LOCALSTORAGE Y DEL DOM*/
      if (result.isConfirmed) {
        Swal.fire(
          "¡Estás a un paso de finalizar la compra! Ingresa los datos para poder confirmar.",
          "",
          "success"
        );
        productsCart = [];
        cleanCart();
        emptyLS();
        totalCalculate();
      } else if (result.isDenied) {
        /*SI LA COMPRA NO HA SIDO FINALIZADA, SE MANTIENEN LOS PRODUCTOS SELECCIONADOS EN EL DOM Y SE PUEDEN SEGUIR AGREGANDO.
        SE MANTIENEN LOS DATOS EN EL LOCALSTORAGE */
        Swal.fire("Puedes seguir comprando", "", "info");
      }
    });
    HTMLCart();
  });
}

//FUNCIONES DEL PROYECTO

function fetchProducts() {
  fetch("productsStore.json")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((product) => {
        card.innerHTML += `
      <div class="card" style="width: 18rem;">
  <img src="${product.image}" class="card-img" alt="${product.name}" style = "height: 50%; width = 50px">
  <div class="card-body">
  <h5 class="card-title">${product.name}</h5>
  <h4><span class="price">$${product.price}</span></h4>
  <button class = "btn btn-primary" id = ${product.id}>Comprar</button>
  </div>
  </div>
  `;
      });
    });
}
fetchProducts();

function selectProducts(e) {
  const button = e.target;
  const product = button.closest(".card");
  const itemTitle = product.querySelector(".card-title").textContent;
  const itemPrice = product.querySelector(".price").textContent;
  const itemImage = product.querySelector("img").getAttribute("src");
  const itemID = product.querySelector("btn-primary").textContent;
  const productsSelected = {
    image: itemImage,
    title: itemTitle,
    price: itemPrice,
    id: itemID,
    quantity: 1,
  };
  addItemsToCart(productsSelected);
}

//AGREGAR PRODUCTO A LA LISTA

function addToCart(e) {
  if (e.target.classList.contains("btn-primary")) {
    const item = e.target.parentElement.parentElement;
    productData(item);
    addedProduct();
  }
  HTMLCart();
}

function addItemsToCart(productsSelected) {
  for (i = 0; i < productsCart.length; i++) {
    if (productsCart[i] === productsSelected.title) {
      productsCart[i].quantity;
      return null;
    }
    productsCart.push(productsSelected);
  }
  HTMLCart()
}

//ELIMINAR PRODUCTO DE LA LISTA

function deleteProduct(e) {
  e.preventDefault();
  if (e.target.classList.contains("btn-outline-danger")) {
    let productID = e.target.getAttribute("id");

    productsCart = productsCart.filter((product) => product.id !== productID);

    HTMLCart();
    totalCalculate();
    deleteProductsLS(productID);
  }
}

//EXTRAER INFORMACIÓN DE LOS PRODUCTOS SELECCIONADOS
function productData(product) {
  const merchandise = {
    image: product.querySelector("img").getAttribute("src"),
    name: product.querySelector("h5").textContent,
    price: product.querySelector("span").textContent,
    id: product.querySelector("button").getAttribute("id"),
    result: product.querySelector("#total-amount"),
    quantity: 1,
  };

  const exists = productsCart.some((product) => product.id === merchandise.id);
  if (exists) {
    //SI EXISTE, QUE RETORNE EL PRODUCTO ELEGIDO
    const items = productsCart.map((product) => {
      if (product.id === merchandise.id) {
        return product;
      } else {
        return product;
      }
    });
    //SPREAD DEL CARRITO
    productsCart = [...items];
  } else {
    //Agregar elementos al arreglo del carrito
    productsCart = [...productsCart, merchandise];
  }
  HTMLCart();
}

//UTILIZANDO TOSTIFY PARA REDIRIGIR A UN VIDEO DEL PRODUCTO SORPRESA
function notify() {
  Toastify({
    text: "¡Hazme Click para ver un video del producto que está por llegar🙀🎮!",
    duration: 3000,
    destination: "https://www.youtube.com/watch?v=KAvwl27SnvA",
    style: {
      background:
        "linear-gradient(90deg, rgba(16,12,91,1) 0%, rgba(74,82,163,0.8995973389355743) 35%, rgba(7,188,224,1) 100%);;",
    },
  }).showToast();
}

//UTILIZANDO TOSTIFY COMO INDICADOR DE CUANDO SE SELECCIONÓ UN PRODUCTO
function addedProduct() {
  Toastify({
    text: "¡Haz añadido el producto al Carrito de Compras 💥!",
    duration: 2000,
    style: {
      background:
        "linear-gradient(90deg, rgba(16,12,91,1) 0%, rgba(74,82,163,0.8995973389355743) 35%, rgba(7,188,224,1) 100%);;",
    },
  }).showToast();
}

//FUNCIÓN PARA MOSTRAR LA LISTA DE PRODUCTOS EN EL HTML
function HTMLCart() {
  //LIMPIAR HTML
  cleanCart();
  list.innerHTML = " ";
  // RECORREMOS CON FOR EACH CADA UNO DE LOS PRODUCTOS EN EL HTML AL SER SELECCIONADOS
  productsCart.map((product) => {
    const tr = document.createElement("tr");
    tr.classList.add("productsCart");
    const content = `
    <td>
    <img src="${product.image}" width=150>
    </td>
    <td>${product.name}</td>
    <td>${product.price}</td>
    <td>
    <input class="quantity-input" type = "number" min= "1" value=${product.quantity}>
    </td>
    <td>
    <button class="btn btn-outline-danger" id="${product.id}">X</button>
    </td>
    `;
    tr.innerHTML = content;
    list.append(tr);
    this.saveProductsLS();

    list
      .querySelector(".quantity-input")
      .addEventListener("change", quantityPlus);
  });
  totalCalculate();
}

//CREO ESTA FUNCIÓN PARA PODER SUMAR LAS CANTIDADES A TRAVÉS DEL INPUT
function quantityPlus(e) {
  const input = e.target;
  productsCart.forEach((product) => {
    product.quantity = input.value;
    totalCalculate();
  });
}

//CALCULAR EL TOTAL DE lA COMPRA
function totalCalculate() {
  let total = 0;
  const totalAmount = document.querySelector("#total-amount");
  //RECORREMOS LOS PRODUCTOS PARA ACCEDER A SUS PRECIOS
  productsCart.forEach((product) => {
    //UTILIZAMOS EL MÉTODO NUMBER PARA PARSEAR DE STRING A NUMBER Y REPLACE PARA ACCEDER AL VALOR SIN CARACTERES ESPECIALES
    const prices = Number(product.price.replace("$", " "));
    total = total + prices * product.quantity;
  });
  totalAmount.innerHTML = `Total: $${total}`;
}

//LIMPIAR CARRITO
function cleanCart() {
  list.innerHTML = " ";
  totalCalculate();
}

//LOCALSTORAGE DEL CARRITO
//PARA GUARDAR LOS PRODUCTOS EN LS
function saveProductsLS() {
  localStorage.setItem("productsCart", JSON.stringify(productsCart));
}

function getProducts() {
  let productLS;

  if (localStorage.getItem("products") === null) {
    //EN CASO DE QUE NO HAYA NADA, MOSTRAR VACIO
    productLS = [];
  } else {
    productLS = JSON.parse(localStorage.getItem("products"));
  }
  return productLS;
}

//PARA ELIMINAR LOS DATOS EN LocalStorage
function deleteProductsLS(productID) {
  let productsLS;
  productsLS = this.getProducts();
  productsLS.forEach(function (productLS, index) {
    if (productLS.id === productID) {
      productsLS.splice(index, 1);
    }
  });
  localStorage.setItem("productsCart", JSON.stringify(productsCart));
}

//FUNCIÓN PARA QUE SE GUARDEN LOS DATOS DE LOS PRODUCTOS SELECCIONADOS EN EL HTML

window.onload = function () {
  const storage = JSON.parse(localStorage.getItem("productsCart"));
  storage ? (productsCart = storage) : "";

  HTMLCart();
};

//ELIMINAMOS LOS DATOS DEL LOCALSTORAGE
function emptyLS() {
  localStorage.clear();
}
