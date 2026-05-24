import React, { useContext, useEffect, useMemo, useState } from 'react'
import './CSS/ShopCategory.css'
import { ShopContext } from '../Context/ShopContext'
import Item from '../components/Item/Item'

const ShopCategory = (props) => {

  const { all_product } = useContext(ShopContext)
  const [sortBy, setSortBy] = useState('default');
  const [visibleCount, setVisibleCount] = useState(8);

  const categoryProducts = useMemo(() => {
    const products = all_product.filter((item) => props.category === item.category);

    if(sortBy === 'low-high'){
      return [...products].sort((a, b) => a.new_price - b.new_price);
    }

    if(sortBy === 'high-low'){
      return [...products].sort((a, b) => b.new_price - a.new_price);
    }

    if(sortBy === 'discount'){
      return [...products].sort((a, b) => (b.old_price - b.new_price) - (a.old_price - a.new_price));
    }

    return products;
  }, [all_product, props.category, sortBy]);

  useEffect(() => {
    setVisibleCount(8);
  }, [props.category, sortBy]);

  const visibleProducts = categoryProducts.slice(0, visibleCount);
  const hasMoreProducts = visibleProducts.length < categoryProducts.length;

  return (
    <div className='shop-category'>
      <img className='shopcategory-banner' src={props.banner} alt="" />
      <div className="shopcategory-indexsort">
        <p><span>Showing {visibleProducts.length}</span> out of {categoryProducts.length} products</p>
        <label className="shopcategory-sort">
          Sort by
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="default">Newest</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="discount">Best Discount</option>
          </select>
        </label>
      </div>
      <div className="shopcategory-products">
        {visibleProducts.map((item)=>{
          return <Item key={item.id} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
        })}
      </div>
      {hasMoreProducts ? (
        <button type="button" className="shopcategory-loadmore" onClick={() => setVisibleCount((count) => count + 4)}>
            Explore More
        </button>
      ) : (
        <p className="shopcategory-all-loaded">All products loaded</p>
      )}
    </div>
  )
}

export default ShopCategory
