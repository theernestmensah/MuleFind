import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  Download,
  ExternalLink,
  FileSpreadsheet,
  Heart,
  Layers3,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { categories, categoryLinks, productPath, products, quickLinks, sourceCtas } from "./data.js";

const favoriteKey = "mulefinds_premium_favorites";
const initialProductCount = 32;
const quickCategoryNames = ["All", "Shoes", "Hoodies", "T-Shirts", "Shorts", "Tracksuits", "Electronics", "Accessories"];

function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [visibleCount, setVisibleCount] = useState(initialProductCount);

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
    document.title = "MuleFinds | MuleBuy Product Finder";
  }, []);

  useEffect(() => {
    setVisibleCount(initialProductCount);
  }, [category, favoritesOnly, query]);

  const categoryNames = useMemo(() => ["All", ...categories.map((item) => item.name)], []);

  const quickCategories = useMemo(
    () => quickCategoryNames.filter((name) => name === "All" || categoryNames.includes(name)),
    [categoryNames],
  );

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

  const visibleProducts = useMemo(() => filteredProducts.slice(0, visibleCount), [filteredProducts, visibleCount]);

  const activeCategoryLinks = useMemo(() => {
    const links = category === "All" ? quickLinks : categoryLinks.filter((link) => link.category === category);
    return links.slice(0, 4);
  }, [category]);

  function chooseCategory(nextCategory) {
    setCategory(nextCategory);
    setFavoritesOnly(false);
  }

  function toggleFavorite(id) {
    setFavorites((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function clearFilters() {
    setQuery("");
    setCategory("All");
    setFavoritesOnly(false);
  }

  function downloadCsv() {
    const headers = ["id", "name", "category", "price", "seller", "updated", "sourceUrl"];
    const rows = [
      headers.join(","),
      ...filteredProducts.map((product) => {
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
        <div className="header-top">
          <a className="brand" href="#top" aria-label="MuleFinds home">
            <span className="brand-mark">
              <Layers3 size={20} />
            </span>
            <span>
              <strong>MuleFinds</strong>
              <small>MuleBuy finder</small>
            </span>
          </a>

          <label className="top-search" role="search">
            <Search size={19} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products, sellers, categories..."
              aria-label="Search MuleBuy products"
            />
          </label>

          <a className="header-cta" href={sourceCtas[0].url} target="_blank" rel="nofollow sponsored noopener">
            <FileSpreadsheet size={17} />
            Sheet
          </a>
        </div>

        <div className="category-rail" aria-label="Quick category filters">
          {quickCategories.map((name) => (
            <button
              className={category === name ? "category-pill active" : "category-pill"}
              key={name}
              type="button"
              onClick={() => chooseCategory(name)}
            >
              {name}
            </button>
          ))}

          <label className="category-select">
            <span>{quickCategories.includes(category) ? "More" : category}</span>
            <select value={category} onChange={(event) => chooseCategory(event.target.value)} aria-label="Choose any category">
              {categoryNames.map((name) => (
                <option value={name} key={name}>
                  {name}
                </option>
              ))}
            </select>
            <ChevronDown size={15} />
          </label>
        </div>
      </header>

      <main id="top">
        <section className="hero-shell">
          <div className="hero-copy">
            <p className="eyebrow">MuleBuy spreadsheet hub</p>
            <h1>Find the MuleBuy links you need faster.</h1>
            <p className="hero-lede">
              Search the directory, jump between popular categories, and open product links with the product list close at hand.
            </p>
          </div>
          <div className="hero-actions" aria-label="Source links">
            {sourceCtas.slice(0, 3).map((cta) => (
              <a key={cta.label} href={cta.url} target="_blank" rel="nofollow sponsored noopener">
                {cta.label}
                <ArrowUpRight size={16} />
              </a>
            ))}
          </div>
        </section>

        <section className="products-section" aria-label="Product directory">
          <div className="results-bar">
            <div>
              <strong>{filteredProducts.length.toLocaleString("en-GH")}</strong>
              <span>
                {category === "All" ? " products" : ` ${category} products`}
                {query ? ` matching "${query}"` : ""}
              </span>
            </div>

            <div className="result-actions">
              <button
                className={favoritesOnly ? "utility-button favorites-filter active" : "utility-button favorites-filter"}
                type="button"
                onClick={() => setFavoritesOnly((value) => !value)}
              >
                <Heart size={17} fill={favoritesOnly ? "currentColor" : "none"} />
                Favorites
              </button>
              <button className="icon-button" type="button" onClick={clearFilters} aria-label="Clear filters">
                <SlidersHorizontal size={18} />
              </button>
              <button className="utility-button csv-button" type="button" onClick={downloadCsv}>
                <Download size={17} />
                CSV
              </button>
            </div>
          </div>

          {activeCategoryLinks.length > 0 && (
            <div className="shortcut-strip" aria-label="Category shortcuts">
              {activeCategoryLinks.map((link) => (
                <a key={`${link.label}-${link.url}`} href={link.url} target="_blank" rel="nofollow sponsored noopener">
                  <img src={link.image} alt="" loading="lazy" />
                  <span>{link.label}</span>
                  <ArrowUpRight size={16} />
                </a>
              ))}
            </div>
          )}

          <div className="product-grid">
            {visibleProducts.map((product) => {
              const saved = favorites.includes(product.id);

              return (
                <article className="product-card" key={product.id}>
                  <a className="product-image" href={product.sourceUrl} target="_blank" rel="nofollow sponsored noopener" aria-label={`Open ${product.name} on MuleBuy`}>
                    <img src={product.image} alt={product.name} loading="lazy" />
                    <span>{product.badge}</span>
                  </a>

                  <div className="product-body">
                    <div className="product-title-row">
                      <h2>{product.name}</h2>
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

          {visibleProducts.length === 0 && (
            <div className="empty-state">
              <strong>No matches found.</strong>
              <button type="button" onClick={clearFilters}>
                Clear filters
              </button>
            </div>
          )}

          {visibleCount < filteredProducts.length && (
            <div className="load-more-row">
              <button type="button" onClick={() => setVisibleCount((count) => count + initialProductCount)}>
                Show more products
              </button>
            </div>
          )}
        </section>
      </main>

      <footer>
        <div className="footer-brand">
          <span className="brand-mark">
            <Layers3 size={18} />
          </span>
          <div>
            <strong>MuleFinds</strong>
            <p>Independent MuleBuy product directory. Credits: Nhyira and Ernest.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
