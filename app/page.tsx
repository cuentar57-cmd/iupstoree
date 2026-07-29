"use client";

import { useEffect, useState } from "react";

const products = [
  {
    name: "iPhone 16 Pro",
    detail: "Titanio · 256 GB",
    price: "Desde USD 1.299",
    value: 1299,
    color: "titanium",
    display: "6,3″ Super Retina XDR",
    camera: "Sistema Pro de 48 MP",
    chip: "Chip A18 Pro",
    battery: "Hasta 27 h de video",
    capacities: ["128 GB", "256 GB", "512 GB", "1 TB"],
    colors: ["Titanio natural", "Titanio negro", "Titanio blanco"],
  },
  {
    name: "iPhone 16",
    detail: "Ultramarino · 128 GB",
    price: "Desde USD 999",
    value: 999,
    color: "blue",
    display: "6,1″ Super Retina XDR",
    camera: "Sistema Fusion de 48 MP",
    chip: "Chip A18",
    battery: "Hasta 22 h de video",
    capacities: ["128 GB", "256 GB", "512 GB"],
    colors: ["Ultramarino", "Negro", "Rosa"],
  },
  {
    name: "iPhone 15",
    detail: "Negro · 128 GB",
    price: "Desde USD 799",
    value: 799,
    color: "black",
    display: "6,1″ Super Retina XDR",
    camera: "Cámara principal de 48 MP",
    chip: "Chip A16 Bionic",
    battery: "Hasta 20 h de video",
    capacities: ["128 GB", "256 GB", "512 GB"],
    colors: ["Negro", "Azul", "Verde"],
  },
];

type Product = (typeof products)[number];
type CartItem = { product: Product; quantity: number };

const formatPrice = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M20 11.6a8 8 0 0 1-11.8 7L4 20l1.4-4.1A8 8 0 1 1 20 11.6Z" />
      <path d="M8.3 8.2c.3-.6.6-.6.9-.6h.4c.2 0 .4 0 .6.5l.8 1.8c.1.3.1.5-.1.7l-.6.8c-.2.2-.1.4 0 .6.5.9 1.2 1.6 2.1 2.1.2.1.4.2.6 0l.8-1c.2-.2.4-.3.7-.2l1.8.9c.3.1.5.3.5.5 0 .3-.2 1.5-1.1 2.1-.5.4-1.2.6-1.9.5-1-.2-2.7-.7-4.5-2.3-1.4-1.3-2.4-2.9-2.7-4-.3-1.1.1-1.9.5-2.3.3-.3.7-.5 1.2-.1Z" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 8h14l-1 12H6L5 8Z" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" />
    </svg>
  );
}

function ThemeIcon({ dark }: { dark: boolean }) {
  return dark ? (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M20.3 15.1A8.5 8.5 0 0 1 8.9 3.7 8.5 8.5 0 1 0 20.3 15.1Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 5l14 14M19 5 5 19" />
    </svg>
  );
}

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeNav, setActiveNav] = useState<"inicio" | "iphones" | "carrito">("inicio");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("istore-theme");
    const shouldUseDark = savedTheme ? savedTheme === "dark" : true;
    setDarkMode(shouldUseDark);
    document.documentElement.dataset.theme = shouldUseDark ? "dark" : "light";

    const savedCart = window.localStorage.getItem("iupstore-cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        window.localStorage.removeItem("iupstore-cart");
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("iupstore-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const syncNavigation = () => {
      if (window.location.hash === "#carrito") setActiveNav("carrito");
      else if (window.location.hash === "#iphones") setActiveNav("iphones");
      else setActiveNav("inicio");
    };
    syncNavigation();
    window.addEventListener("hashchange", syncNavigation);
    return () => window.removeEventListener("hashchange", syncNavigation);
  }, []);

  function toggleTheme() {
    const nextDarkMode = !darkMode;
    setDarkMode(nextDarkMode);
    document.documentElement.dataset.theme = nextDarkMode ? "dark" : "light";
    window.localStorage.setItem("istore-theme", nextDarkMode ? "dark" : "light");
  }

  useEffect(() => {
    document.body.style.overflow = selectedProduct || checkoutOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProduct, checkoutOpen]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce(
    (total, item) => total + item.product.value * item.quantity,
    0,
  );

  function addToCart(product: Product) {
    setCart((current) => {
      const exists = current.find((item) => item.product.name === product.name);
      if (exists) {
        return current.map((item) =>
          item.product.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...current, { product, quantity: 1 }];
    });
    setSelectedProduct(null);
    setOrderComplete(false);
  }

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
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="IUPSTORE, ir al inicio">
          <img src="/assets/iupstore-logo.jpg" alt="IUPSTORE" />
          <span>IUPSTORE</span>
        </a>
        <nav className="nav-bar" aria-label="Navegación principal">
          <a
            className={`nav-item ${activeNav === "inicio" ? "active" : ""}`}
            href="#inicio"
            onClick={() => setActiveNav("inicio")}
          >
            <span>Inicio</span>
          </a>
          <a
            className={`nav-item ${activeNav === "iphones" ? "active" : ""}`}
            href="#iphones"
            onClick={() => setActiveNav("iphones")}
          >
            <span>iPhones</span>
          </a>
          <a
            className={`nav-item ${activeNav === "carrito" ? "active" : ""}`}
            href="/carrito"
            aria-label="Ver carrito"
            onClick={() => setActiveNav("carrito")}
          >
            <BagIcon />
            <span>Carrito</span>
            {cartCount > 0 && <b className="cart-count">{cartCount}</b>}
          </a>
          <button
            className="nav-item theme-toggle"
            onClick={toggleTheme}
            aria-label={darkMode ? "Activar modo claro" : "Activar modo oscuro"}
            title={darkMode ? "Modo claro" : "Modo oscuro"}
          >
            <ThemeIcon dark={darkMode} />
            <span>{darkMode ? "Modo claro" : "Modo oscuro"}</span>
          </button>
        </nav>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Tecnología que te acompaña</p>
          <h1>Tu próximo<br /><strong>iPhone</strong> está acá.</h1>
          <p className="hero-text">
            Equipos seleccionados, garantía y atención personalizada
            para que elijas con total confianza.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#iphones">
              Ver modelos <ArrowIcon />
            </a>
            <a className="button button-secondary" href="#contacto">
              <WhatsAppIcon /> Consultar por WhatsApp
            </a>
          </div>
          <div className="trust-row" aria-label="Beneficios principales">
            <span>✓ Garantía incluida</span>
            <span>✓ Equipos verificados</span>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <img src="/assets/hero-phone.webp" alt="" />
          <p className="hero-badge"><span>Nuevo</span> Rendimiento Pro</p>
        </div>
        <a className="scroll-cue" href="#iphones" aria-label="Desplazarse a los modelos">
          <span />
        </a>
      </section>

      <section className="products section" id="iphones">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span /> Elegí el tuyo</p>
            <h2>Modelos destacados</h2>
          </div>
          <a href="#contacto">Consultar disponibilidad <ArrowIcon /></a>
        </div>
        <div className="product-grid">
          {products.map((product, index) => (
            <article className="product-card" key={product.name}>
              <div className={`phone-mini ${product.color}`}>
                <div className="mini-camera">
                  <i /><i /><i />
                </div>
                <span>{index === 0 ? "Pro" : "iPhone"}</span>
              </div>
              <div className="product-info">
                <p>{product.detail}</p>
                <h3>{product.name}</h3>
                <strong>{product.price}</strong>
                <div className="product-card-actions">
                  <button
                    className="product-detail-button"
                    onClick={() => setSelectedProduct(product)}
                    aria-label={`Ver información de ${product.name}`}
                  >
                    Ver información
                  </button>
                  <button className="add-cart-button" onClick={() => addToCart(product)}>
                    <BagIcon /> Agregar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="cart-section section" id="carrito">
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

        {cart.length === 0 ? (
          <div className="empty-cart">
            <BagIcon />
            <h3>Tu carrito está vacío</h3>
            <p>Elegí un modelo y agregalo para comenzar tu compra.</p>
            <a className="button button-primary" href="#iphones">Ver iPhones</a>
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

      <section className="benefits section" id="beneficios">
        <div className="benefit-intro">
          <p className="eyebrow"><span /> Comprar tranquilo</p>
          <h2>Todo lo que necesitás.<br />Sin vueltas.</h2>
        </div>
        <div className="benefit-grid">
          <article>
            <b>01</b>
            <h3>Garantía real</h3>
            <p>Todos nuestros equipos cuentan con garantía y revisión previa.</p>
          </article>
          <article>
            <b>02</b>
            <h3>Atención personal</h3>
            <p>Te ayudamos a elegir el modelo ideal según tu uso y presupuesto.</p>
          </article>
          <article>
            <b>03</b>
            <h3>Entrega segura</h3>
            <p>Coordinamos cada entrega para que recibas tu equipo con tranquilidad.</p>
          </article>
        </div>
      </section>

      <section className="contact section" id="contacto">
        <div>
          <p className="eyebrow"><span /> Estamos para ayudarte</p>
          <h2>¿Cuál va a ser<br />tu próximo iPhone?</h2>
        </div>
        <div className="contact-copy">
          <p>Consultanos por modelos, colores y capacidades disponibles.</p>
          <a className="button button-primary" href="https://wa.me/" target="_blank" rel="noreferrer">
            <WhatsAppIcon /> Hablar por WhatsApp
          </a>
          <small>Agregá tu número de WhatsApp para recibir consultas.</small>
        </div>
      </section>

      <footer>
        <a className="brand" href="#inicio" aria-label="IUPSTORE, ir al inicio">
          <img src="/assets/iupstore-logo.jpg" alt="" />
          <span>IUPSTORE</span>
        </a>
        <p>iPhone es una marca registrada de Apple Inc. Este sitio es una tienda independiente.</p>
        <p>© 2026 IUPSTORE</p>
      </footer>

      {selectedProduct && (
        <div
          className="product-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedProduct(null);
          }}
        >
          <section
            className="product-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
          >
            <button
              className="modal-close"
              onClick={() => setSelectedProduct(null)}
              aria-label="Cerrar información del producto"
            >
              <CloseIcon />
            </button>
            <div className="modal-product-visual">
              <div className={`phone-mini modal-phone ${selectedProduct.color}`}>
                <div className="mini-camera"><i /><i /><i /></div>
                <span>{selectedProduct.name.includes("Pro") ? "Pro" : "iPhone"}</span>
              </div>
            </div>
            <div className="modal-content">
              <p className="eyebrow"><span /> Información del producto</p>
              <h2 id="product-modal-title">{selectedProduct.name}</h2>
              <p className="modal-lead">{selectedProduct.detail}</p>
              <div className="spec-grid">
                <div><small>Pantalla</small><strong>{selectedProduct.display}</strong></div>
                <div><small>Cámara</small><strong>{selectedProduct.camera}</strong></div>
                <div><small>Rendimiento</small><strong>{selectedProduct.chip}</strong></div>
                <div><small>Batería</small><strong>{selectedProduct.battery}</strong></div>
              </div>
              <div className="option-block">
                <small>Capacidades disponibles</small>
                <div>{selectedProduct.capacities.map((item) => <span key={item}>{item}</span>)}</div>
              </div>
              <div className="option-block">
                <small>Colores</small>
                <p>{selectedProduct.colors.join(" · ")}</p>
              </div>
              <div className="modal-footer">
                <div><small>Precio de referencia</small><strong>{selectedProduct.price}</strong></div>
                <button className="button button-primary" onClick={() => addToCart(selectedProduct)}>
                  <BagIcon /> Agregar al carrito
                </button>
              </div>
              <p className="price-note">Precio demostrativo sujeto a disponibilidad.</p>
            </div>
          </section>
        </div>
      )}

      {checkoutOpen && (
        <div className="product-modal-backdrop" role="presentation">
          <section className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
            <button
              className="modal-close"
              onClick={() => {
                setCheckoutOpen(false);
                setOrderComplete(false);
              }}
              aria-label="Cerrar checkout"
            >
              <CloseIcon />
            </button>
            {orderComplete ? (
              <div className="checkout-success">
                <span>✓</span>
                <p className="eyebrow">Pedido preparado</p>
                <h2 id="checkout-title">¡Gracias por elegir IUPSTORE!</h2>
                <p>El pedido quedó preparado en este dispositivo. Un asesor deberá confirmar disponibilidad, entrega y forma de pago.</p>
                <button
                  className="button button-primary"
                  onClick={() => {
                    setCheckoutOpen(false);
                    setOrderComplete(false);
                  }}
                >
                  Volver a la tienda
                </button>
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
