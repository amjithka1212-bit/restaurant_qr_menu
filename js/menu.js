#import {supabase} from "./supabase.js";
#const table=new URLSearchParams(location.search).get("table");
#document.querySelector("#table").textContent=table?`Table ${table}`:"Scan the table QR code";
#const menu=document.querySelector("#menu"), cats=document.querySelector("#cats"), msg=document.querySelector("#msg");
#let items=[],category="All",cart={};

#async function load(){msg.textContent="Loading menu...";const {data,error}=await supabase.from("menu_items").select("id,name,description,price,category").eq("is_available",true).order("category").order("name");if(error){console.error(error);msg.textContent="Could not load menu.";return}items=data||[];msg.textContent="";renderCats();renderMenu()}
#function renderCats(){cats.innerHTML="";["All",...new Set(items.map(x=>x.category||"Other"))].forEach(c=>{const b=document.createElement("button");b.className="cat "+(c===category?"active":"");b.textContent=c;b.onclick=()=>{category=c;renderCats();renderMenu()};cats.append(b)})}
#function renderMenu(){menu.innerHTML="";items.filter(x=>category==="All"||x.category===category).forEach(x=>{const d=document.createElement("div");d.className="item";d.innerHTML=`<h3></h3><p></p><div class="row"><b>₹${Number(x.price).toFixed(2)}</b><button class="add">Add</button></div>`;d.querySelector("h3").textContent=x.name;d.querySelector("p").textContent=x.description||"";d.querySelector(".add").onclick=()=>{cart[x.id]??={item:x,qty:0};cart[x.id].qty++;renderCart()};menu.append(d)})}
#function renderCart(){const arr=Object.values(cart),n=arr.reduce((s,x)=>s+x.qty,0),t=arr.reduce((s,x)=>s+x.qty*Number(x.item.price),0);document.querySelector("#count").textContent=n;document.querySelector("#total").textContent=t.toFixed(2);const box=document.querySelector("#cartItems");box.innerHTML="";arr.forEach(x=>{const d=document.createElement("div");d.className="line";d.innerHTML=`<span>${x.item.name} — ₹${(x.qty*x.item.price).toFixed(2)}</span><span class="qty"><button>-</button> ${x.qty} <button>+</button></span>`;d.querySelectorAll("button")[0].onclick=()=>change(x.item.id,-1);d.querySelectorAll("button")[1].onclick=()=>change(x.item.id,1);box.append(d)})}
#function change(id,n){cart[id].qty+=n;if(cart[id].qty<=0)delete cart[id];renderCart()}
#document.querySelector("#cartBtn").onclick=()=>document.querySelector("#cart").classList.remove("hidden");
#document.querySelector("#close").onclick=()=>document.querySelector("#cart").classList.add("hidden");
#document.querySelector("#place").onclick=async()=>{const out=document.querySelector("#orderMsg");out.textContent="";if(!table){out.textContent="Missing table number.";return}const arr=Object.values(cart);if(!arr.length){out.textContent="Cart is empty.";return}const total=arr.reduce((s,x)=>s+x.qty*Number(x.item.price),0);const {data:o,error:e}=await supabase.from("orders").insert({table_number:Number(table),status:"new",total_amount:total}).select().single();if(e){console.error(e);out.textContent="Could not place order.";return}const rows=arr.map(x=>({order_id:o.id,menu_item_id:x.item.id,item_name:x.item.name,quantity:x.qty,price:Number(x.item.price),subtotal:x.qty*Number(x.item.price)}));const {error:e2}=await supabase.from("order_items").insert(rows);if(e2){console.error(e2);out.textContent="Order created but items failed.";return}cart={};renderCart();out.textContent=`Order #${o.id} placed successfully.`};
#load();

import { supabase } from "./supabase.js";

const table = new URLSearchParams(location.search).get("table");

document.querySelector("#table").textContent =
  table ? `Table ${table}` : "Scan the table QR code";

const menu = document.querySelector("#menu");
const cats = document.querySelector("#cats");
const msg = document.querySelector("#msg");

let items = [];
let category = "All";
let cart = {};

async function load() {
  msg.textContent = "Loading menu...";

  const { data, error } = await supabase
    .from("menu_items")
    .select("id,name,description,price,category")
    .eq("is_available", true)
    .order("category")
    .order("name");

  if (error) {
    console.error(error);
    msg.textContent = "Could not load menu.";
    return;
  }

  items = data || [];
  msg.textContent = "";

  renderCats();
  renderMenu();
}

function renderCats() {
  cats.innerHTML = "";

  ["All", ...new Set(items.map(x => x.category || "Other"))].forEach(c => {
    const b = document.createElement("button");

    b.className = "cat " + (c === category ? "active" : "");
    b.textContent = c;

    b.onclick = () => {
      category = c;
      renderCats();
      renderMenu();
    };

    cats.append(b);
  });
}

function renderMenu() {
  menu.innerHTML = "";

  items
    .filter(x => category === "All" || x.category === category)
    .forEach(x => {
      const d = document.createElement("div");

      d.className = "item";

      d.innerHTML = `
        <h3></h3>
        <p></p>
        <div class="row">
          <b>₹${Number(x.price).toFixed(2)}</b>
          <button class="add">Add</button>
        </div>
      `;

      d.querySelector("h3").textContent = x.name;
      d.querySelector("p").textContent = x.description || "";

      d.querySelector(".add").onclick = () => {
        if (!cart[x.id]) {
          cart[x.id] = {
            item: x,
            qty: 0
          };
        }

        cart[x.id].qty++;

        renderCart();
      };

      menu.append(d);
    });
}

function renderCart() {
  const arr = Object.values(cart);

  const n = arr.reduce(
    (sum, x) => sum + x.qty,
    0
  );

  const t = arr.reduce(
    (sum, x) => sum + x.qty * Number(x.item.price),
    0
  );

  document.querySelector("#count").textContent = n;
  document.querySelector("#total").textContent = t.toFixed(2);

  const box = document.querySelector("#cartItems");

  box.innerHTML = "";

  arr.forEach(x => {
    const d = document.createElement("div");

    d.className = "line";

    d.innerHTML = `
      <span>
        ${x.item.name} —
        ₹${(x.qty * Number(x.item.price)).toFixed(2)}
      </span>

      <span class="qty">
        <button>-</button>
        ${x.qty}
        <button>+</button>
      </span>
    `;

    d.querySelectorAll("button")[0].onclick = () => {
      change(x.item.id, -1);
    };

    d.querySelectorAll("button")[1].onclick = () => {
      change(x.item.id, 1);
    };

    box.append(d);
  });
}

function change(id, n) {
  if (!cart[id]) return;

  cart[id].qty += n;

  if (cart[id].qty <= 0) {
    delete cart[id];
  }

  renderCart();
}

document.querySelector("#cartBtn").onclick = () => {
  document.querySelector("#cart").classList.remove("hidden");
};

document.querySelector("#close").onclick = () => {
  document.querySelector("#cart").classList.add("hidden");
};


// =====================================================
// PLACE ORDER
// =====================================================

document.querySelector("#place").onclick = async () => {

  const out = document.querySelector("#orderMsg");

  out.textContent = "";

  // Check table number
  if (!table) {
    out.textContent = "Missing table number.";
    return;
  }

  // Check cart
  const arr = Object.values(cart);

  if (!arr.length) {
    out.textContent = "Cart is empty.";
    return;
  }

  // Calculate total BEFORE clearing the cart
  const total = arr.reduce(
    (sum, x) => sum + x.qty * Number(x.item.price),
    0
  );

  const placeButton = document.querySelector("#place");

  placeButton.disabled = true;
  placeButton.textContent = "Placing Order...";


  // =====================================================
  // CREATE ORDER
  // =====================================================

  const { data: o, error: e } = await supabase
    .from("orders")
    .insert({
      table_number: Number(table),
      status: "new",
      total_amount: total
    })
    .select()
    .single();

  if (e) {

    console.error("ORDER ERROR:", e);

    out.textContent = "Could not place order.";

    placeButton.disabled = false;
    placeButton.textContent = "Place Order";

    return;
  }


  // =====================================================
  // CREATE ORDER ITEMS
  // =====================================================

  const rows = arr.map(x => ({
    order_id: o.id,
    menu_item_id: x.item.id,
    item_name: x.item.name,
    quantity: x.qty,
    price: Number(x.item.price),
    subtotal: x.qty * Number(x.item.price)
  }));

  const { error: e2 } = await supabase
    .from("order_items")
    .insert(rows);

  if (e2) {

    console.error("ORDER ITEMS ERROR:", e2);

    out.textContent =
      "Order was created but the items could not be saved.";

    placeButton.disabled = false;
    placeButton.textContent = "Place Order";

    return;
  }


  // =====================================================
  // ORDER SUCCESS
  // =====================================================

  // IMPORTANT:
  // Save the total before clearing the cart.
  const orderedTotal = total;

  // Clear cart
  cart = {};

  renderCart();


  // =====================================================
  // SHOW CONFIRMATION
  // =====================================================

  out.innerHTML = `
    <div style="
      margin-top:15px;
      padding:15px;
      background:#e8f5e9;
      border-radius:10px;
      color:#1b5e20;
      line-height:1.6;
    ">

      <strong>Order placed successfully!</strong>

      <br><br>

      Order #${o.id}

      <br>

      Table ${table}

      <br>

      Total:
      <strong>₹${orderedTotal.toFixed(2)}</strong>

    </div>
  `;

  placeButton.disabled = false;
  placeButton.textContent = "Order Placed";
};


load();
