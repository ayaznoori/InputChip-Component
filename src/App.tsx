// App.tsx

import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import axios from 'axios';

interface Item {
  id: number;
  name: string;
}

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [inuputItems, setInputitems] = useState<Item[]>([]);
  const [chips, setChips] = useState<Item[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch items from JSON server
    axios.get<Item[]>('http://localhost:8080/items').then((response) => {
      const initialItems = response.data;
      setItems(initialItems);
      setInputitems(initialItems);
    });
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setInputValue(value);
    // Filter items based on user input
    const filteredItems = items.filter((item) => item.name.toLowerCase().includes(value));
    setInputitems(filteredItems);
    setShowDropdown(true);
  };

  const handleItemClick = (item: Item) => {
    // Add item to chips
    setChips((prevChips) => [...prevChips, item]);
    
    // Remove item from the list
    setItems((prevItems) => {
      const updatedItems = prevItems.filter((i) => i.id !== item.id);
      return updatedItems;
    });
  
    // Clear input value
    setInputValue('');
    setShowDropdown(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  

  const handleChipRemove = (chip: Item) => {
    // Remove chip from chips
    setChips((prevChips) => prevChips.filter((c) => c.id !== chip.id));

    // Add chip back to the list
    setItems((prevItems) => {
      return [...prevItems, chip];
    });
  };

  const handleInputBlur = () => {
    // Hide dropdown when input field loses focus
   // setShowDropdown(false);
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="relative border border-gray-300 p-2 rounded-md w-full mt-2 bg-red">
        <div className="flex flex-wrap">
          {chips.map((chip) => (
            <div key={chip.id} className="bg-gray-200 rounded-md px-2 py-1 m-1 flex items-center">
              {chip.name}
              <span className="ml-2 cursor-pointer" onClick={() => handleChipRemove(chip)}>
                X
              </span>
            </div>
          ))}
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          ref={inputRef}
          className="border border-gray-300 p-2 rounded-md w-full mt-2 bg-red"
          placeholder="Type to search..."
        />
        {showDropdown && (
          <div className="absolute bg-white border border-gray-300 rounded-md mt-1 w-full max-h-48 overflow-y-auto">
            {inuputItems.map((item) => (
              <div
                key={item.id}
                className="p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => handleItemClick(item)}
              >
                {item.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
