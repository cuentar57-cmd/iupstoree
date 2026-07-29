"use client";

import { useEffect, useState } from "react";

type Product = {
  name: string;
  detail: string;
  value: number;
  color: string;
};

type CartItem = { product: Product; quantity: number };

const formatPrice = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

function BagIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 8h14l-1 12H6L5 8Z" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  );
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  useEffect(() => {
    const savedCart = window.localStorage.getItem("iupstore-cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        window.localStorage.removeItem("iupstore-cart");
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) window.localStorage.setItem("iupstore-cart", JSON.stringify(cart));
  }, [cart, loaded]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce(
    (total, item) => total + item.product.value * item.quantity,
    0,
  );

  function updateQuantity(productName: string, amount: number) {
    setCart((current) =>
      current
        .map((item) =>
          item.product.name === productName
            ? { ...item, quantity: item.quantity + amount }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function completeOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCart([]);
    setOrderComplete(true);
  }

  return (
    <main className="cart-page">
      <header className="site-header cart-page-header">
        <a className="brand" href="/" aria-label="IUPSTORE, volver a la tienda">
          <img src="/assets/iupstore-logo.jpg" alt="IUPSTORE" />
          <span>IUPSTORE</span>
        </a>
        <nav className="nav-bar" aria-label="Navegación del carrito">
          <a className="nav-item" href="/">Seguir comprando</a>
          <span className="nav-item active">
            <BagIcon />
            <span>Carrito</span>
            {cartCount > 0 && <b className="cart-count">{cartCount}</b>}
          </span>
        </nav>
      </header>

      <section className="cart-section section">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span /> Tu selección</p>
            <h2>Carrito de compra</h2>
          </div>
          {cart.length > 0 && (
            <button className="clear-cart" onClick={() => setCart([])}>
              Vaciar carrito
            </button>
          )}
        </div>

        {loaded && cart.length === 0 ? (
          <div className="empty-cart">
            <BagIcon />
            <h3>Tu carrito está vacío</h3>
            <p>Elegí un modelo y agregalo para comenzar tu compra.</p>
            <a className="button button-primary" href="/#iphones">Ver iPhones</a>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cart.map(({ product, quantity }) => (
                <article className="cart-item" key={product.name}>
                  <div className={`cart-phone ${product.color}`}>
                    <span>{product.name.includes("Pro") ? "Pro" : "iPhone"}</span>
                  </div>
                  <div className="cart-item-info">
                    <small>{product.detail}</small>
                    <h3>{product.name}</h3>
                    <strong>{formatPrice(product.value)}</strong>
                  </div>
                  <div className="quantity-control" aria-label={`Cantidad de ${product.name}`}>
                    <button onClick={() => updateQuantity(product.name, -1)} aria-label="Quitar una unidad">−</button>
                    <span>{quantity}</span>
                    <button onClick={() => updateQuantity(product.name, 1)} aria-label="Agregar una unidad">+</button>
                  </div>
                  <strong className="line-total">{formatPrice(product.value * quantity)}</strong>
                  <button className="remove-item" onClick={() => updateQuantity(product.name, -quantity)}>
                    Eliminar
                  </button>
                </article>
              ))}
            </div>
            <aside className="cart-summary">
              <p className="eyebrow"><span /> Resumen</p>
              <div><span>Productos</span><strong>{cartCount}</strong></div>
              <div><span>Subtotal</span><strong>{formatPrice(cartTotal)}</strong></div>
              <div><span>Entrega</span><strong>A coordinar</strong></div>
              <div className="summary-total"><span>Total</span><strong>{formatPrice(cartTotal)}</strong></div>
              <button className="button button-primary" onClick={() => setCheckoutOpen(true)}>
                Ir al checkout <ArrowIcon />
              </button>
              <small>El precio y la disponibilidad se confirman antes del pago.</small>
            </aside>
          </div>
        )}
      </section>

      {checkoutOpen && (
        <div className="product-modal-backdrop" role="presentation">
          <section className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
            <button
              className="modal-close cart-modal-close"
              onClick={() => {
                setCheckoutOpen(false);
                setOrderComplete(false);
              }}
              aria-label="Cerrar checkout"
            >
              ×
            </button>
            {orderComplete ? (
              <div className="checkout-success">
                <span>✓</span>
                <p className="eyebrow">Pedido preparado</p>
                <h2 id="checkout-title">¡Gracias por elegir IUPSTORE!</h2>
                <p>Un asesor deberá confirmar disponibilidad, entrega y forma de pago.</p>
                <a className="button button-primary" href="/">Volver a la tienda</a>
              </div>
            ) : (
              <form className="checkout-form" onSubmit={completeOrder}>
                <div className="checkout-heading">
                  <p className="eyebrow"><span /> Último paso</p>
                  <h2 id="checkout-title">Finalizar compra</h2>
                  <p>Completá tus datos para preparar el pedido.</p>
                </div>
                <div className="checkout-fields">
                  <label>Nombre y apellido<input name="name" required autoComplete="name" /></label>
                  <label>WhatsApp<input name="phone" type="tel" required autoComplete="tel" placeholder="+54 9..." /></label>
                  <label className="field-wide">Correo electrónico<input name="email" type="email" required autoComplete="email" /></label>
                  <label className="field-wide">Forma de entrega
                    <select name="delivery" required defaultValue="">
                      <option value="" disabled>Seleccionar</option>
                      <option>Retiro coordinado</option>
                      <option>Envío a domicilio</option>
                    </select>
                  </label>
                  <label className="field-wide">Forma de pago
                    <select name="payment" required defaultValue="">
                      <option value="" disabled>Seleccionar</option>
                      <option>Transferencia</option>
                      <option>Efectivo</option>
                      <option>Consultar financiación</option>
                    </select>
                  </label>
                  <label className="field-wide">Notas del pedido<textarea name="notes" rows={3} placeholder="Color, capacidad o comentario adicional" /></label>
                </div>
                <div className="checkout-total">
                  <span>Total de referencia</span>
                  <strong>{formatPrice(cartTotal)}</strong>
                </div>
                <button className="button button-primary checkout-submit" type="submit">
                  Confirmar pedido <ArrowIcon />
                </button>
                <small className="checkout-note">No se realiza ningún cobro online en este paso.</small>
              </form>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
