 const db = {
    metodos: {
        find: (id) => {
            return db.items.find(item => item.id === id);
        },
        remove: (items) => {
            items.forEach(item => {
                const producto = db.metodos.find(item.id);
                producto.qty = producto.qty - item.qty;
            });
            console.log(db);
        }, 
    },
    items: [
        {
            id: 0,
            titulo: "Hamburguesa",
            precio: 5,
            qty: 10,
        },
        {
            id: 1,
            titulo: "Pizza Familiar",
            precio: 17,
            qty: 20,
        } ,       
        {
            id: 2,
            titulo: "Combo Alitas",
            precio: 10,
            qty: 21,
        },

    ]
 };


 const shoppingCart = {
    items: [],
    metodos: {
        add: (id, qty) => {
            const carItem = shoppingCart.metodos.get(id);

            if(carItem){
                if(shoppingCart.metodos.hasInventary(id, qty + carItem.qty)){
                    carItem.qty += qty;
                }else{
                    alert("No hay prductos suficientes");
                }
            }else{
                shoppingCart.items.push({id, qty});
            }
        },
        remove: (id, qty) => {
            const carItem = shoppingCart.metodos.get(id)
            if(carItem.qty - qty > 0){
                carItem.qty -= qty;
            }else{
                shoppingCart.items = shoppingCart.items.filter(item => item.id !== id );
                return index >= 0 ? shoppingCart.items[index] : null;
             }
        },
        count: () => {
            return shoppingCart.items.reduce((acc, item) => acc + item.qty, 0);
        },
        get: (id) => {
            const index = shoppingCart.items.findIndex(item => item.id === id);
            return index >= 0 ? shoppingCart.items[index] : null ;
        },
        getTotal: () => {
            const total = shoppingCart.items.reduce((acc, item) => {
                const found = db.metodos.find(item.id);
                return (acc += found.precio * item.qty);
            }, 0);
            return total;
        },
        hasInventary: (id, qty) => {
            return db.items.find(item => item.id === id).qty - qty >=0;
        },
        purchase: () => {
            db.metodos.remove(shoppingCart.items);
            shoppingCart.items = [];
        },
    },
 };
 renderStore();

 function renderStore(){
    const html = db.items.map(item =>{
        return `
            <div class="item">
                <div class="titulo">${item.titulo}</div>
                <div class="precio">${numberToCurrency(item.precio)}</div>
                <div class="qty">${item.qty} units</div>
                <div class="actions">
                    <button class="add" data-id="${item.id}">Add to Shopping Cart</button>
                </div>
            </div>
        `;
    });

    document.querySelector("#store-container").innerHTML = html.join("");

    document.querySelectorAll(".item .actions .add").forEach(button =>{
        button.addEventListener("click", e =>{
            const id = parseInt(button.getAttribute("data-id"));
            const item = db.metodos.find(id);
            if(item && item.qty-1 > 0){
                //añadir a ahopping cart
                shoppingCart.metodos.add(id, 1);
                renderShoppingCart();

            }else{
                console.log("Ya no hay ese producto")
            }
        });
    });
 }

function renderShoppingCart(){
    const html = shoppingCart.items.map(item => {
        const dbItem = db.metodos.find(item.id);
        return `
            <div class="item">
                <div class="titulo">${dbItem.titulo}</div>
                <div class="precio">${numberToCurrency(dbItem.precio)}</div>
                <div class="qty">${item.qty} units</div>
                <div class="subtotal">
                    Subtotal:${numberToCurrency(item.qty*dbItem.precio)}
                </div>
                <div class="actions">
                    <button class="addOne" data-id="${item.id}">+</button>
                    <button class="removeOne" data-id="${item.id}">-</button>
                </div>
            </div>
        `;
    });
    const closeButton = `
    <div class="cart-header">
        <button class="bClose">Close</button>
    </div>
    `;
    const purchaseButton = shoppingCart.items.length > 0?
    `
    <div class="cart-actions">
        <button id="bPurchase">Purchase</button>
    </div>
    `: "";
    const total = shoppingCart.metodos.getTotal();
    const totalContainer = `<div class="total">Total: ${numberToCurrency(total)}</div>`;
    const shoppingCartContainer = document.querySelector("#carrito-compras");
    shoppingCartContainer.classList.remove("hide");
    shoppingCartContainer.classList.add("ahow");

    shoppingCartContainer.innerHTML = closeButton + html.join("") + totalContainer + purchaseButton;



    document.querySelectorAll(".addOne").forEach(button => {
        button.addEventListener("click", (e)=> {
            const id = parseInt(button.getAttribute("data-id"));
            shoppingCart.metodos.add(id,1);
            renderShoppingCart();
        }); 
    });
    document.querySelectorAll(".removeOne").forEach(button => {
        button.addEventListener("click", (e)=> {
            const id = parseInt(button.getAttribute("data-id"));
            shoppingCart.metodos.remove(id,1);
            renderShoppingCart();
        }); 
    });
    document.querySelectorAll(".bClose").addEventListener("click", (e)=> {
        shoppingCartContainer.classList.remove("show");
        shoppingCartContainer.classList.add("hide");
    }); 
    
    const bPurchase =document.querySelector("#bPurchase"); 
    if(bPurchase){
        bPurchase.addEventListener("click", (e)=> {
            shoppingCart.metodos.purchase();
            renderStore();
            renderShoppingCart();
        });
    }
}





 //Funcion que transforma un numero a formato dinero con dos decimales
 function numberToCurrency(n){
    return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 2,
        style: "currency",
        currency: "USD"
    }).format(n);
 }