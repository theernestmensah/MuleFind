import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BadgeCheck,
  BookOpenCheck,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Download,
  ExternalLink,
  FileSpreadsheet,
  Filter,
  Heart,
  Layers3,
  Menu,
  MessageCircle,
  MoveRight,
  PackageOpen,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Store,
  X,
} from "lucide-react";
import {
  agentRows,
  categories,
  faqs,
  productPath,
  products,
  sourceCtas,
  sourceStats,
  trustItems,
  workflow,
} from "./data.js";

const navItems = [
  ["Explore", "explore"],
  ["Products", "products"],
  ["Spreadsheet", "spreadsheet"],
  ["Guide", "guide"],
  ["Agents", "agents"],
  ["FAQ", "faq"],
];

const favoriteKey = "mulefinds_premium_favorites";

function scrollTo(id) {
  const target = document.getElementById(id);
  if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const currentProduct = useMemo(() => {
    const match = window.location.pathname.match(/\/products\/([^/]+)\.html$/);
    if (!match) return null;
    return products.find((product) => product.slug === match[1]) || null;
  }, []);

  useEffect(() => {
    try {
      setFavorites(JSON.parse(localStorage.getItem(favoriteKey) || "[]"));
    } catch {
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(favoriteKey, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) setTimeout(() => scrollTo(hash), 80);
  }, []);

  useEffect(() => {
    document.title = currentProduct
      ? `${currentProduct.name} | MuleFinds`
      : "MuleFinds | Premium MuleBuy Spreadsheet Hub";
  }, [currentProduct]);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return products.filter((product) => {
      const haystack = `${product.name} ${product.category} ${product.seller} ${product.price} ${product.badge} ${product.summary}`.toLowerCase();
      const matchesQuery = !normalized || haystack.includes(normalized);
      const matchesCategory = category === "All" || product.category === category;
      const matchesFavorite = !favoritesOnly || favorites.includes(product.id);
      return matchesQuery && matchesCategory && matchesFavorite;
    });
  }, [category, favorites, favoritesOnly, query]);

  const categoryNames = useMemo(() => ["All", ...categories.map((item) => item.name)], []);

  function toggleFavorite(id) {
    setFavorites((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function downloadCsv() {
    const headers = ["id", "name", "category", "price", "seller", "badge", "updated", "detailUrl", "sourceUrl"];
    const rows = [
      headers.join(","),
      ...products.map((product) => {
        const row = { ...product, detailUrl: productPath(product) };
        return headers.map((header) => `"${String(row[header] || "").replaceAll('"', '""')}"`).join(",");
      }),
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "mulefinds-directory.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href={currentProduct ? "/" : "#top"} onClick={() => setMenuOpen(false)} aria-label="MuleFinds home">
          <span className="brand-mark">
            <Layers3 size={20} />
          </span>
          <span>
            <strong>MuleFinds</strong>
            <small>Premium spreadsheet hub</small>
          </span>
        </a>

        <button className="icon-button menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle menu">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <nav className={menuOpen ? "open" : ""}>
          {navItems.map(([label, id]) => (
            <a
              key={id}
              href={currentProduct ? `/#${id}` : `#${id}`}
              onClick={(event) => {
                if (currentProduct) return;
                event.preventDefault();
                setMenuOpen(false);
                scrollTo(id);
              }}
            >
              {label}
            </a>
          ))}
        </nav>

        <a className="header-cta" href={sourceCtas[0].url} target="_blank" rel="nofollow sponsored noopener">
          <FileSpreadsheet size={17} />
          Open sheet
        </a>
      </header>

      {currentProduct ? (
        <>
          <main>
            <ProductDetailPage product={currentProduct} products={products} />
          </main>
          <SiteFooter />
        </>
      ) : (
        <>

      <main id="top">
        <section className="hero-shell" id="explore">
          <div className="hero-copy">
            <p className="eyebrow">
              <ShieldCheck size={16} />
              Based on OGMulebuy directory data
            </p>
            <h1>MuleBuy links, rebuilt like a serious product desk.</h1>
            <p className="hero-lede">
              Browse the MuleBuy spreadsheet model with premium category cards, searchable finds, QC guidance, agent comparison, and source links for the official sheet, Discord, registration, and mobile app.
            </p>

            <div className="hero-search" role="search">
              <Search size={20} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search shoes, hoodies, electronics, sellers..."
                aria-label="Search product directory"
              />
              <button type="button" onClick={() => scrollTo("products")}>
                Search
              </button>
            </div>

            <div className="hero-actions">
              <button className="btn primary" type="button" onClick={() => scrollTo("products")}>
                Browse finds
                <MoveRight size={18} />
              </button>
              <button className="btn secondary" type="button" onClick={() => scrollTo("guide")}>
                Ordering guide
                <BookOpenCheck size={18} />
              </button>
            </div>
          </div>

          <div className="hero-workbench" aria-label="MuleFinds live browsing preview">
            <div className="workbench-top">
              <span>
                <Sparkles size={17} />
                Live hub snapshot
              </span>
              <strong>2026</strong>
            </div>
            <div className="workbench-metrics">
              {sourceStats.map((stat) => (
                <div key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
            <div className="source-links">
              {sourceCtas.slice(0, 3).map((cta) => (
                <a key={cta.label} href={cta.url} target="_blank" rel="nofollow sponsored noopener">
                  <span>{cta.label}</span>
                  <ArrowUpRight size={16} />
                </a>
              ))}
            </div>
            <div className="preview-stack">
              {categories.slice(0, 4).map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.name} type="button" onClick={() => {
                    setCategory(item.name);
                    scrollTo("products");
                  }}>
                    <span style={{ backgroundColor: item.color }}>
                      <Icon size={18} />
                    </span>
                    <strong>{item.name}</strong>
                    <small>{item.count} links</small>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="stats-band" aria-label="Source highlights">
          {sourceStats.map((stat) => (
            <article key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
              <small>{stat.detail}</small>
            </article>
          ))}
        </section>

        <section className="section-shell categories-section">
          <div className="section-heading">
            <p className="eyebrow">
              <PackageOpen size={16} />
              Category command center
            </p>
            <h2>Start with the spreadsheet lanes people actually use.</h2>
            <p>
              OGMulebuy organizes discovery around direct links, seasonal drops, apparel categories, electronics, accessories, app installs, Reddit, Discord, and link conversion utilities. This version turns those ideas into a more deliberate browsing system.
            </p>
          </div>

          <div className="category-grid">
            {categories.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  className="category-card"
                  key={item.name}
                  type="button"
                  style={{ "--accent": item.color }}
                  onClick={() => {
                    setCategory(item.name);
                    setFavoritesOnly(false);
                    scrollTo("products");
                  }}
                >
                  <img src={item.image} alt="" loading="lazy" />
                  <span className="category-icon">
                    <Icon size={20} />
                  </span>
                  <strong>{item.name}</strong>
                  <small>{item.count} indexed links</small>
                  <p>{item.summary}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="section-shell products-section" id="products">
          <div className="section-heading compact">
            <p className="eyebrow">
              <Store size={16} />
              Product directory
            </p>
            <h2>Searchable finds with actual buying context.</h2>
          </div>

          <div className="toolbar">
            <label className="search-control">
              <Search size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search products, sellers, price ranges..."
              />
            </label>

            <label className="select-control">
              <Filter size={18} />
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                {categoryNames.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} />
            </label>

            <button className={favoritesOnly ? "btn toggle active" : "btn toggle"} type="button" onClick={() => setFavoritesOnly((value) => !value)}>
              <Heart size={18} fill={favoritesOnly ? "currentColor" : "none"} />
              Favorites
            </button>

            <button className="icon-button" type="button" onClick={() => {
              setQuery("");
              setCategory("All");
              setFavoritesOnly(false);
            }} aria-label="Clear filters">
              <SlidersHorizontal size={19} />
            </button>
          </div>

          <div className="results-row">
            <span>
              <strong>{filteredProducts.length}</strong> curated lanes showing
            </span>
            <button type="button" onClick={downloadCsv}>
              <Download size={17} />
              Export CSV
            </button>
          </div>

          <div className="product-grid">
            {filteredProducts.map((product) => {
              const saved = favorites.includes(product.id);
              return (
                <article className="product-card" key={product.id}>
                  <div className="product-image">
                    <a href={productPath(product)} aria-label={`View ${product.name}`}>
                      <img src={product.image} alt={product.name} loading="lazy" />
                    </a>
                    <span>{product.badge}</span>
                  </div>
                  <div className="product-body">
                    <div className="product-title-row">
                      <h3>{product.name}</h3>
                      <button
                        className={saved ? "favorite saved" : "favorite"}
                        type="button"
                        onClick={() => toggleFavorite(product.id)}
                        aria-label={saved ? "Remove favorite" : "Save favorite"}
                      >
                        <Heart size={17} fill={saved ? "currentColor" : "none"} />
                      </button>
                    </div>
                    <dl>
                      <div>
                        <dt>Category</dt>
                        <dd>{product.category}</dd>
                      </div>
                      <div>
                        <dt>Seller</dt>
                        <dd>{product.seller}</dd>
                      </div>
                      <div>
                        <dt>Price</dt>
                        <dd>{product.price}</dd>
                      </div>
                    </dl>
                    <a className="product-link" href={productPath(product)}>
                      View details
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section-shell spreadsheet-section" id="spreadsheet">
          <div className="section-heading compact">
            <p className="eyebrow">
              <FileSpreadsheet size={16} />
              Spreadsheet view
            </p>
            <h2>Dense, exportable, and built for people who compare before they buy.</h2>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Lane</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Seller source</th>
                  <th>Updated</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>
                      <strong>{product.name}</strong>
                      <span>{product.badge}</span>
                    </td>
                    <td>{product.category}</td>
                    <td>{product.price}</td>
                    <td>{product.seller}</td>
                    <td>{product.updated}</td>
                    <td>
                      <a href={productPath(product)} aria-label={`Open ${product.name}`}>
                        <ExternalLink size={17} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="section-shell guide-section" id="guide">
          <div className="guide-copy">
            <p className="eyebrow">
              <ClipboardCheck size={16} />
              Buying flow
            </p>
            <h2>From spreadsheet link to shipped parcel, without mystery steps.</h2>
            <p>
              MuleBuy works as a shopping-agent flow: paste product links, submit orders, wait for warehouse arrival, inspect QC photos, consolidate items, choose shipping, and track the parcel after final payment.
            </p>
            <div className="trust-row">
              {trustItems.map((item) => {
                const Icon = item.icon;
                return (
                  <span key={item.label}>
                    <Icon size={16} />
                    {item.label}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="workflow-grid">
            {workflow.map((item, index) => {
              const Icon = item.icon;
              return (
                <article key={item.title}>
                  <span className="step-number">{String(index + 1).padStart(2, "0")}</span>
                  <Icon size={24} />
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section-shell agents-section" id="agents">
          <div className="section-heading compact">
            <p className="eyebrow">
              <Star size={16} />
              Agent comparison
            </p>
            <h2>Know what each agent is good for before you move links around.</h2>
          </div>

          <div className="agent-grid">
            {agentRows.map(([agent, bestFor, strength]) => (
              <article key={agent}>
                <span>{agent}</span>
                <strong>{bestFor}</strong>
                <p>{strength}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell faq-section" id="faq">
          <div className="section-heading compact">
            <p className="eyebrow">
              <MessageCircle size={16} />
              FAQ
            </p>
            <h2>Answers shoppers need before opening thirty tabs.</h2>
          </div>

          <div className="faq-list">
            {faqs.map((item, index) => (
              <details key={item.q} open={index === 0}>
                <summary>
                  <span>{item.q}</span>
                  <ChevronDown size={18} />
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="cta-band">
          <div>
            <p className="eyebrow">
              <CheckCircle2 size={16} />
              Ready to browse
            </p>
            <h2>Use the official sheet, keep this hub polished, and replace referral links before launch if needed.</h2>
          </div>
          <div className="cta-links">
            {sourceCtas.map((cta) => (
              <a key={cta.label} href={cta.url} target="_blank" rel="nofollow sponsored noopener">
                {cta.label}
                <ArrowUpRight size={16} />
              </a>
            ))}
          </div>
        </section>
      </main>

          <SiteFooter />
        </>
      )}
    </>
  );
}

function ProductDetailPage({ product, products }) {
  const related = products
    .filter((item) => item.id !== product.id && item.category === product.category)
    .concat(products.filter((item) => item.id !== product.id && item.category !== product.category))
    .slice(0, 3);

  return (
    <article className="product-detail-page">
      <div className="product-detail-hero">
        <div className="detail-copy">
          <a className="back-link" href="/#products">
            <MoveRight size={17} />
            Back to all products
          </a>
          <p className="eyebrow">
            <BadgeCheck size={16} />
            {product.category} product page
          </p>
          <h1>{product.name}</h1>
          <p className="hero-lede">{product.summary}</p>

          <div className="detail-actions">
            <a className="btn primary" href={product.sourceUrl} target="_blank" rel="nofollow sponsored noopener">
              Open source lane
              <ArrowUpRight size={18} />
            </a>
            <a className="btn secondary" href="/#guide">
              Review QC guide
              <BookOpenCheck size={18} />
            </a>
          </div>
        </div>

        <div className="detail-panel">
          <div>
            <span>Price</span>
            <strong>{product.price}</strong>
          </div>
          <div>
            <span>Seller source</span>
            <strong>{product.seller}</strong>
          </div>
          <div>
            <span>Updated</span>
            <strong>{product.updated}</strong>
          </div>
          <div>
            <span>Directory ID</span>
            <strong>{product.id}</strong>
          </div>
        </div>
      </div>

      <section className="product-gallery" aria-label={`${product.name} pictures`}>
        {product.gallery.map((image, index) => (
          <figure key={image}>
            <img src={image} alt={`${product.name} picture ${index + 1}`} />
            <figcaption>{index === 0 ? "Primary listing image" : `Gallery image ${index + 1}`}</figcaption>
          </figure>
        ))}
      </section>

      <section className="detail-info-grid">
        <div>
          <p className="eyebrow">
            <ShieldCheck size={16} />
            Buying notes
          </p>
          <h2>Check the link, then inspect the warehouse photos.</h2>
          <p>
            This page is a focused product lane for Ghana-priced browsing. Use the source link to continue into the original listing group, then confirm size, color, seller notes, and QC photos before shipping.
          </p>
        </div>
        <div className="detail-checklist">
          {["Confirm item options", "Check sizing notes", "Review QC photos", "Estimate shipping in GH₵"].map((item) => (
            <span key={item}>
              <CheckCircle2 size={17} />
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="related-products">
        <div className="section-heading compact">
          <p className="eyebrow">
            <PackageOpen size={16} />
            More product pages
          </p>
          <h2>Keep browsing separate product pages.</h2>
        </div>
        <div className="related-grid">
          {related.map((item) => (
            <a key={item.id} href={productPath(item)}>
              <img src={item.image} alt="" loading="lazy" />
              <span>{item.category}</span>
              <strong>{item.name}</strong>
              <small>{item.price}</small>
            </a>
          ))}
        </div>
      </section>
    </article>
  );
}

function SiteFooter() {
  return (
    <footer>
      <div className="footer-brand">
        <span className="brand-mark">
          <Layers3 size={18} />
        </span>
        <div>
          <strong>MuleFinds</strong>
          <p>Independent MuleBuy spreadsheet directory, product discovery surface, and educational guide.</p>
        </div>
      </div>
      <div className="footer-copy">
        <p>
          Credits: Nhyira and Ernest. Built with information from ogmulebuy.com, original layout and wording, and lucide-react icons.
        </p>
        <p>
          Not affiliated with MuleBuy, Taobao, Weidian, 1688, Tmall, sellers, agents, or brand owners. External links may be third-party or affiliate links; verify listings before purchasing.
        </p>
      </div>
    </footer>
  );
}

export default App;
