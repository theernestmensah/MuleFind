import {
  BadgeCheck,
  Boxes,
  Camera,
  Clock3,
  Gem,
  Headphones,
  PackageCheck,
  ScanSearch,
  Shirt,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Store,
  Tags,
  Truck,
  WalletCards,
} from "lucide-react";
import snapshot from "./mulebuySnapshot.json";

const categoryMeta = {
  Shoes: { icon: ShoppingBag, color: "#d94f35" },
  Hoodies: { icon: Sparkles, color: "#7a5c23" },
  "T-Shirts": { icon: Shirt, color: "#0f8b8d" },
  Shorts: { icon: Tags, color: "#6d6f12" },
  Tracksuits: { icon: Boxes, color: "#255c99" },
  "Coats / Jackets": { icon: PackageCheck, color: "#793f5c" },
  Sweaters: { icon: Sparkles, color: "#6d6f12" },
  Pants: { icon: Store, color: "#47624f" },
  Jersey: { icon: Star, color: "#b96a28" },
  Electronics: { icon: Headphones, color: "#53599a" },
  Women: { icon: BadgeCheck, color: "#aa405f" },
  Belts: { icon: Tags, color: "#7a5c23" },
  Accessories: { icon: Gem, color: "#8a4b6e" },
  Jewellery: { icon: Gem, color: "#53599a" },
  Perfumes: { icon: ScanSearch, color: "#846c3d" },
  Other: { icon: Boxes, color: "#47624f" },
};

export const sourceStats = [
  { label: "MuleBuy rows", value: snapshot.products.length.toLocaleString("en-GH"), detail: "local spreadsheet snapshot" },
  { label: "Categories", value: snapshot.categories.length.toLocaleString("en-GH"), detail: "from OGMulebuy products" },
  { label: "Shortcut sheets", value: snapshot.categoryLinks.length.toLocaleString("en-GH"), detail: "category spreadsheet cards" },
  { label: "Currency", value: "GH\u20b5", detail: `Ghana cedi estimates at ${snapshot.currency.usdToGhs}` },
];

export const sourceCtas = [
  {
    label: "Official Spreadsheet",
    url: "https://docs.google.com/spreadsheets/d/1qlHWEkGHqrR_WT_g1-ogpKZn88c1xloEq5sDjszK3Kg/edit?gid=1981489868#gid=1981489868",
    type: "source",
  },
  {
    label: "Register & Save",
    url: "https://mulebuy.com/register?ref=200075996",
    type: "affiliate",
  },
  {
    label: "Discord 24/7",
    url: "https://discord.gg/EPtMfcEugg",
    type: "community",
  },
  {
    label: "Android App",
    url: "https://ogsheets.app/download/index.html",
    type: "utility",
  },
];

export const currencyInfo = snapshot.currency;
export const quickLinks = snapshot.quickLinks;
export const categoryLinks = snapshot.categoryLinks;

export const categories = snapshot.categories.map((category) => ({
  ...category,
  icon: categoryMeta[category.name]?.icon || Boxes,
  color: categoryMeta[category.name]?.color || "#47624f",
}));

export const products = snapshot.products;

export const productPath = (product) => product.sourceUrl;

export const workflow = [
  {
    title: "Browse category",
    icon: ScanSearch,
    body: "Pick a MuleBuy category, then use the sheet shortcut or product rows to narrow the list.",
  },
  {
    title: "Open MuleBuy",
    icon: WalletCards,
    body: "Each product row links directly to a MuleBuy product URL or a category spreadsheet shortcut.",
  },
  {
    title: "Check details",
    icon: Camera,
    body: "Confirm size, color, seller notes, and warehouse QC photos before shipping.",
  },
  {
    title: "Ship parcel",
    icon: Truck,
    body: "Consolidate items, estimate weight, choose a shipping line, and track the parcel.",
  },
];

export const faqs = [
  {
    q: "What is this spreadsheet?",
    a: "It is a local MuleBuy spreadsheet snapshot built from OGMulebuy's public products page and config data, organized into categories with MuleBuy product links.",
  },
  {
    q: "Why are prices in GH\u20b5?",
    a: `This site displays Ghana cedi estimates using ${currencyInfo.source}.`,
  },
  {
    q: "Where do product links open?",
    a: "Product rows open MuleBuy product URLs or the relevant OGMulebuy category spreadsheet shortcut.",
  },
  {
    q: "Are these listings official?",
    a: "This is an independent spreadsheet-style directory for MuleBuy browsing. Always verify product details, seller notes, and QC photos before buying.",
  },
];

export const trustItems = [
  { label: "MuleBuy-only rows", icon: BadgeCheck },
  { label: "CSV export", icon: Clock3 },
  { label: "Category filters", icon: Smartphone },
  { label: "QC-first workflow", icon: Camera },
];
