const products = [
  { id:"iphone-16-pro", name:"iPhone 16 Pro", detail:"Titanio · 256 GB", value:1299, color:"titanium", label:"Pro" },
  { id:"iphone-16", name:"iPhone 16", detail:"Ultramarino · 128 GB", value:999, color:"blue", label:"iPhone" },
  { id:"iphone-15", name:"iPhone 15", detail:"Negro · 128 GB", value:799, color:"black", label:"iPhone" }
];
const money = value => new Intl.NumberFormat("es-AR",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(value);
const getCart = () => JSON.parse(localStorage.getItem("iupstore-cart-static") || "[]");
const saveCart = cart => { localStorage.setItem("iupstore-cart-static", JSON.stringify(cart)); updateCount(); };
function updateCount(){ const el=document.getElementById("cartCount"); if(el) el.textContent=getCart().reduce((a,b)=>a+b.quantity,0); }
function addToCart(id){
  const cart=getCart(), item=cart.find(x=>x.id===id);
  if(item) item.quantity++; else cart.push({id,quantity:1});
  saveCart(cart);
  const toast=document.getElementById("toast"); if(toast){toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),1800);}
}
function changeQuantity(id,amount){ const cart=getCart().map(x=>x.id===id?{...x,quantity:x.quantity+amount}:x).filter(x=>x.quantity>0);saveCart(cart);renderCart(); }
function renderProducts(){
  const grid=document.getElementById("productGrid"); if(!grid)return;
  grid.innerHTML=products.map(p=>`<article class="product-card"><div class="phone ${p.color}"><i></i><span>${p.label}</span></div><p>${p.detail}</p><h3>${p.name}</h3><strong>Desde ${money(p.value)}</strong><button class="add-btn" onclick="addToCart('${p.id}')">🛍 Agregar</button></article>`).join("");
}
function renderCart(){
  const root=document.getElementById("cartContent"); if(!root)return;
  const cart=getCart();
  if(!cart.length){root.innerHTML=`<div class="empty"><div>🛍</div><h2>Tu carrito está vacío</h2><p>Elegí un modelo para comenzar tu compra.</p><a class="btn primary" href="index.html#modelos">Ver iPhones</a></div>`;return;}
  const rows=cart.map(item=>{const p=products.find(x=>x.id===item.id);return {...p,quantity:item.quantity}}).filter(x=>x.id);
  const total=rows.reduce((a,p)=>a+p.value*p.quantity,0);
  root.innerHTML=`<div class="cart-layout"><div class="cart-items">${rows.map(p=>`<article class="cart-item"><div class="cart-phone ${p.color}">${p.label}</div><div><small>${p.detail}</small><h3>${p.name}</h3><strong>${money(p.value)}</strong></div><div class="quantity"><button onclick="changeQuantity('${p.id}',-1)">−</button><span>${p.quantity}</span><button onclick="changeQuantity('${p.id}',1)">+</button></div><strong>${money(p.value*p.quantity)}</strong><button class="remove" onclick="changeQuantity('${p.id}',-${p.quantity})">Eliminar</button></article>`).join("")}</div><aside class="summary"><p class="eyebrow">RESUMEN</p><div><span>Productos</span><strong>${rows.reduce((a,p)=>a+p.quantity,0)}</strong></div><div><span>Entrega</span><strong>A coordinar</strong></div><div class="total"><span>Total</span><strong>${money(total)}</strong></div><a class="btn primary" href="https://wa.me/?text=${encodeURIComponent("Hola, quiero consultar por mi pedido de IUPSTORE por "+money(total))}" target="_blank">Finalizar por WhatsApp →</a><small>Precio y disponibilidad sujetos a confirmación.</small></aside></div>`;
}
document.getElementById("clearCart")?.addEventListener("click",()=>{saveCart([]);renderCart();});
renderProducts(); renderCart(); updateCount();
