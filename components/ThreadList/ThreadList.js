import { useEffect, useState } from 'react';

import Item from './Item';
import PaneWrapper from './PaneWrapper';

const SCREEN_SMALL = 768;

export default function ThreadList({ pane, items, onOpen = () => {}, onClose = () => {} }) {
  const Pane = pane;
  const [paneData, setPaneData] = useState(null);
  const [paneIndex, setPaneIndex] = useState(0);

  useEffect(() => {
    const activeItemIndex = items.findIndex(({ active }) => active === true);

    if (activeItemIndex !== -1 && window.innerWidth > SCREEN_SMALL) {
      setPaneIndex(activeItemIndex);
      setPaneData(items[activeItemIndex]?.data);
    }
  }, [items]);

  return (
    <nav className="md:h-full relative z-20 md:w-64 flex-grow-0 flex-shrink-0">
      <span className="absolute top-0 left-0 w-3 bg-gradient-to-r from-black h-full opacity-20 hidden md:block" />

      {!paneData && (
        <span className="absolute top-0 left-full w-3 bg-gradient-to-r from-black h-full opacity-20 hidden md:block" />
      )}

      <ul className="h-full">
        {items.map(({ className, ...item }, index) => {
          const isActive = paneData && index === paneIndex;

          return (
            <li key={`thread-item-${index}`}>
              <Item
                {...item}
                className={className}
                onClick={(event) => {
                  if (window.innerWidth > SCREEN_SMALL) {
                    event.preventDefault();

                    if (isActive) {
                      setPaneData(null);
                      setPaneIndex(0);
                      onClose();
                    } else {
                      setPaneData(item.data);
                      setPaneIndex(index);
                      onOpen(item.data);
                    }
                  }
                }}
                active={isActive}
              />
            </li>
          );
        })}
      </ul>

      {paneData && (
        <PaneWrapper>
          <Pane
            {...paneData}
            onClose={() => {
              setPaneData(null);
              setPaneIndex(0);
              onClose();
            }}
          />
        </PaneWrapper>
      )}
    </nav>
  );
}
