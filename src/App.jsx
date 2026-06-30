import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
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
  Store,
  X,
} from "lucide-react";
import {
  categories,
  categoryLinks,
  currencyInfo,
  faqs,
  productPath,
  products,
  quickLinks,
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
    document.title = "MuleFinds | Premium MuleBuy Spreadsheet Hub";
  }, []);

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
  const visibleProducts = useMemo(() => filteredProducts.slice(0, 240), [filteredProducts]);
  const visibleRows = useMemo(() => filteredProducts.slice(0, 500), [filteredProducts]);
  const activeCategoryLinks = useMemo(() => {
    if (category === "All") return quickLinks.slice(0, 8);
    return categoryLinks.filter((link) => link.category === category);
  }, [category, quickLinks]);

  function toggleFavorite(id) {
    setFavorites((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function downloadCsv() {
    const headers = ["id", "name", "category", "price", "seller", "updated", "sourceUrl"];
    const rows = [
      headers.join(","),
      ...products.map((product) => {
        return headers.map((header) => `"${String(product[header] || "").replaceAll('"', '""')}"`).join(",");
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
        <a className="brand" href="#top" onClick={() => setMenuOpen(false)} aria-label="MuleFinds home">
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
              href={`#${id}`}
              onClick={(event) => {
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

      <main id="top">
        <section className="hero-shell" id="explore">
          <div className="hero-copy">
            <p className="eyebrow">
              <ShieldCheck size={16} />
              Based on OGMulebuy directory data
            </p>
            <h1>MuleBuy links, rebuilt like a serious product desk.</h1>
            <p className="hero-lede">
              Browse a simple MuleBuy spreadsheet with the same core categories from OGMulebuy products: shoes, hoodies, tees, shorts, tracksuits, jackets, sweaters, pants, jerseys, electronics, women, belts, accessories, jewellery, and perfumes.
            </p>

            <div className="hero-search" role="search">
              <Search size={20} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search MuleBuy products, sellers, categories..."
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

          <div className="hero-category-panel" aria-label="MuleBuy category shortcuts">
            <div className="hero-category-top">
              <span>
                <PackageOpen size={17} />
                MuleBuy categories
              </span>
              <strong>{categories.length} lanes</strong>
            </div>

            <div className="hero-category-grid">
              {categories.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    type="button"
                    style={{ "--accent": item.color }}
                    onClick={() => {
                      setCategory(item.name);
                      setFavoritesOnly(false);
                      scrollTo("products");
                    }}
                  >
                    <span className="hero-category-thumb">
                      <img src={item.image} alt="" loading="lazy" />
                      <Icon size={15} />
                    </span>
                    <span className="hero-category-copy">
                      <strong>{item.name}</strong>
                      <small>{item.count} links</small>
                    </span>
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
              This keeps the site strictly about MuleBuy: category cards, product rows, source spreadsheet shortcuts, direct MuleBuy links, Ghana cedi estimates, and a clear search/filter workflow.
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
              <strong>{filteredProducts.length}</strong> MuleBuy rows showing
              {filteredProducts.length > visibleProducts.length ? `, first ${visibleProducts.length} rendered` : ""}
            </span>
            <button type="button" onClick={downloadCsv}>
              <Download size={17} />
              Export CSV
            </button>
          </div>

          <div className="category-shortcuts">
            {activeCategoryLinks.map((link) => (
              <a key={`${link.label}-${link.url}`} href={link.url} target="_blank" rel="nofollow sponsored noopener">
                <img src={link.image} alt="" loading="lazy" />
                <span>{category === "All" ? "MuleBuy shortcut" : `${category} shortcut`}</span>
                <strong>{link.label}</strong>
                <ArrowUpRight size={17} />
              </a>
            ))}
          </div>

          <div className="product-grid">
            {visibleProducts.map((product) => {
              const saved = favorites.includes(product.id);
              return (
                <article className="product-card" key={product.id}>
                  <div className="product-image">
                    <a href={product.sourceUrl} target="_blank" rel="nofollow sponsored noopener" aria-label={`Open ${product.name} on MuleBuy`}>
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
                    <a className="product-link" href={productPath(product)} target="_blank" rel="nofollow sponsored noopener">
                      Open MuleBuy
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
                {visibleRows.map((product) => (
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
                      <a href={product.sourceUrl} target="_blank" rel="nofollow sponsored noopener" aria-label={`Open ${product.name}`}>
                        <ExternalLink size={17} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="table-note">
            Showing {visibleRows.length.toLocaleString("en-GH")} of {filteredProducts.length.toLocaleString("en-GH")} rows. Use search or a category filter to narrow the spreadsheet. Prices are converted with {currencyInfo.source}.
          </p>
        </section>

        <section className="section-shell guide-section" id="guide">
          <div className="guide-copy">
            <p className="eyebrow">
              <ClipboardCheck size={16} />
              Buying flow
            </p>
            <h2>From spreadsheet link to shipped parcel, without mystery steps.</h2>
            <p>
              MuleBuy works as a spreadsheet-to-parcel flow: open product rows, submit orders, wait for warehouse arrival, inspect QC photos, consolidate items, choose shipping, and track the parcel after final payment.
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
          Not affiliated with MuleBuy, sellers, marketplaces, logistics providers, or brand owners. External links may be third-party or affiliate links; verify listings before purchasing.
        </p>
      </div>
    </footer>
  );
}

export default App;
