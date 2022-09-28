import React from 'react';
import { createRoot } from 'react-dom/client';
import VirtualList from './VirtualList';
import rowTemplate from './rowTemplate';
import './style.css';

//Virtualization Settings
// **amount** defines the number of items we want to be visible in the viewport.
// **tolerance** determines the viewport’s outlets, which contains additional items that will be rendered but invisible to the user.
const SETTINGS = {
  itemHeight: 20,
  amount: 25,
  tolerance: 5,
  minIndex: -9999,
  maxIndex: 200000,
  startIndex: 1,
};

// **getData** provides a portion of data set to virtual list.
// The getData(4, 9) call means we want to receive nine items started from index 4.
const getData = (offset, limit) => {
  const data = [];
  const start = Math.max(SETTINGS.minIndex, offset);
  const end = Math.min(offset + limit - 1, SETTINGS.maxIndex);
  console.log(
    `request [${offset}..${offset + limit - 1}] -> [${start}..${end}] items`
  );
  if (start <= end) {
    for (let i = start; i <= end; i++) {
      data.push({ index: i, text: `Ticket ${i}` });
    }
  }
  return data;
};

const AppComponent = () => (
  <VirtualList
    className="viewport"
    get={getData}
    settings={SETTINGS}
    row={rowTemplate}
  />
);

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<AppComponent />);
