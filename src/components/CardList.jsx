import React, { useState, useEffect } from "react";
import Card from './Card';
import Button from './Button';
import Search from './Search';

const limit = 10;

const CardList = ({data}) => {
  const [filteredData, setFilteredData] = useState(data);
  const [offset, setOffset] = useState(0);
  const [products, setProducts] = useState(filteredData.slice(0, limit));

  // Filter products by tags
  const filterTags = (searchTerm) => {
    if (!searchTerm) {
      // Reset to all data if search is cleared
      setFilteredData(data);
    } else {
      // Filter the data based on tags
      const results = data.filter(product => {
        // Guard clause in case a product has no tags array or it's not formatted correctly
        if (!product.tags || !Array.isArray(product.tags)) return false;
        
        return product.tags.some(tag => {
          // Safely extract the tag's string. Unsplash stores the keyword in tag.title.
          // We use optional chaining (?.) to prevent crashes if a tag is null/undefined
          const tagValue = tag?.title || tag?.name || (typeof tag === 'string' ? tag : '');
          
          // Search.jsx already lowercases the searchTerm, so we just check includes
          return tagValue.toLowerCase().includes(searchTerm);
        });
      });
      setFilteredData(results);
    }
    // Reset pagination to the first page whenever a search occurs
    setOffset(0);
  };

  // Update the displayed products whenever offset or filtered dataset changes
  useEffect(() => {
    setProducts(filteredData.slice(offset, offset + limit));
  }, [offset, filteredData]);

  // Handle both next and previous clicks with one function
  const handlePagination = (changeAmount) => {
    setOffset(offset + changeAmount);
  };

  return (
    <div className="cf pa2">
      <Search handleSearch={filterTags} />

      <div className="mt2 mb2">
        {products.map((product) => (
          <Card key={product.id} {...product} />
        ))}
      </div>
      
      {/* Pagination Buttons */}
      <div className="flex items-center justify-center pa4">   
        <Button 
          text="Previous" 
          handleClick={() => handlePagination(-limit)} 
          disabled={offset === 0} 
        />
        <Button 
          text="Next" 
          handleClick={() => handlePagination(limit)} 
          disabled={offset + limit >= filteredData.length} 
        />
      </div>
    </div>
  );
}

export default CardList;