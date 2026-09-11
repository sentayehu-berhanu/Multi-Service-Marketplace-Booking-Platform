import React, { useState } from "react";
import DeliveryHero from "./components/DeliveryHero";
import DeliveryCategories from "./components/DeliveryCategories";
import DeliverySearch from "./components/DeliverySearch";
import StoreCard from "./components/StoreCard";
import ProductCard from "./components/ProductCard";
import CartDrawer from "./components/CartDrawer";
import axios from 'axios';
import { stores as mockStores } from "./data/stores";
import { products as mockProducts } from "./data/products";

import "./LocalDelivery.css";

function LocalDelivery() {
  const [category, setCategory] = useState("food");
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [stores, setStores] = useState(mockStores);
  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchDeliveryData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/businesses?category=local-delivery');
        const deliveryBusinesses = res.data;
        
        if (deliveryBusinesses.length > 0) {
          // Transform businesses into store format
          const formattedStores = deliveryBusinesses.map(biz => ({
            id: biz.id,
            name: biz.name,
            categories: [biz.category.name],
            rating: biz.rating || 4.5,
            deliveryTime: "15-30 min",
            deliveryFee: 50,
            image: biz.cover_image || "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&q=80&w=400"
          }));
          
          setStores(formattedStores);

          // Extract and flatten all products from these businesses
          const allProducts = [];
          deliveryBusinesses.forEach(biz => {
            if (biz.products && biz.products.length > 0) {
              biz.products.forEach(prod => {
                allProducts.push({
                  id: prod.id,
                  name: prod.name,
                  store: biz.name,
                  price: prod.price,
                  category: prod.category,
                  rating: prod.rating || 4.5,
                  image: prod.image?.startsWith('/uploads') ? `http://localhost:5000${prod.image}` : (prod.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400")
                });
              });
            }
          });
          
          if (allProducts.length > 0) {
            setProducts([...mockProducts, ...allProducts]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch delivery data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDeliveryData();
  }, []);

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);
      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const filteredProducts = products.filter(product => {
    // Search match
    const searchString = search.toLowerCase();
    const matchesSearch = !search || 
      product.name.toLowerCase().includes(searchString) || 
      (product.store && product.store.toLowerCase().includes(searchString));

    // Category match
    const selectedCat = category.toLowerCase();
    let productCat = (product.category || 'food').toLowerCase();
    
    // Normalize dashboard categories to match storefront categories
    if (productCat === 'documents') productCat = 'document';

    let matchesCategory = false;
    if (selectedCat === 'other') {
      matchesCategory = !['food', 'grocery', 'pharmacy', 'package', 'document'].includes(productCat);
    } else {
      matchesCategory = productCat === selectedCat;
    }

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="delivery-page">
      <DeliveryHero />

      <div className="delivery-content-container">
        <DeliveryCategories selected={category} onSelect={setCategory} />

        <DeliverySearch value={search} onChange={setSearch} />

        <section className="delivery-section">
          <div className="section-header">
            <h2>Popular Delivery Stores</h2>
            <button className="view-all-btn">View All</button>
          </div>

          <div className="store-grid">
            {stores.map((store) => (
              <StoreCard key={store.id} store={store} onClick={() => console.log("Store clicked", store.id)} />
            ))}
          </div>
        </section>

        <section className="delivery-section">
          <div className="section-header">
            <h2>{category.charAt(0).toUpperCase() + category.slice(1)} Delivery Items</h2>
          </div>

          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-card)', borderRadius: '15px' }}>
              <p style={{ color: 'var(--text-secondary)' }}>No items found for this category or search.</p>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={addToCart} />
              ))}
            </div>
          )}
        </section>
      </div>

      {cart.length > 0 && <CartDrawer cart={cart} />}
    </div>
  );
}

export default LocalDelivery;
