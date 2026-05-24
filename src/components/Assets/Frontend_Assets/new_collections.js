import p1_img from "./product_12.png";
import p2_img from "./product_35.png";
import p3_img from "./product_14.png";
import p4_img from "./product_8.png";
import p5_img from "./product_15.png";
import p6_img from "./product_2.png";
import p7_img from "./product_17.png";
import p8_img from "./product_28.png";

let new_collections = [
  {
    id: 12,
    name: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
    image: p1_img,
    new_price: 50.0,
    old_price: 80.5,
  },
  {
    id: 35,
    name: "Boys Orange Colourblocked Hooded Sweatshirt",
    image: p2_img,
    new_price: 85.0,
    old_price: 120.5,
  },
  {
    id: 14,
    name: "Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket",
    image: p3_img,
    new_price: 60.0,
    old_price: 100.5,
  },
  {
    id: 8,
    name: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
    image: p4_img,
    new_price: 100.0,
    old_price: 150.0,
  },
  {
    id: 15,
    name: "Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket",
    image: p5_img,
    new_price: 50.0,
    old_price: 80.5,
  },
  {
    id: 2,
    name: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
    image: p6_img,
    new_price: 85.0,
    old_price: 120.5,
  },
  {
    id: 17,
    name: "Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket",
    image: p7_img,
    new_price: 60.0,
    old_price: 100.5,
  },
  {
    id: 28,
    name: "Boys Orange Colourblocked Hooded Sweatshirt",
    image: p8_img,
    new_price: 100.0,
    old_price: 150.0,
  },
];

const collectionPrices = {
  12: { new_price: 112.0, old_price: 158.0 },
  35: { new_price: 81.0, old_price: 119.0 },
  14: { new_price: 119.0, old_price: 169.0 },
  8: { new_price: 96.0, old_price: 140.0 },
  15: { new_price: 76.0, old_price: 116.0 },
  2: { new_price: 67.0, old_price: 99.0 },
  17: { new_price: 82.0, old_price: 125.0 },
  28: { new_price: 62.0, old_price: 96.0 },
};

new_collections = new_collections.map((product) => ({
  ...product,
  ...collectionPrices[product.id],
}));

export default new_collections;
