import { useState } from 'react';
import { CaretDown } from '@phosphor-icons/react';

export function FaqAccordion({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={item.question}
            className="rounded-2xl border border-fcit-navy/15 bg-fcit-ivory/80 transition duration-300 ease-fcit"
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? -1 : idx)}
              className="flex w-full items-center justify-between gap-4 p-4 sm:p-6 text-left"
            >
              <span className="title-2 text-fcit-navyDeep">{item.question}</span>
              <CaretDown
                size={18}
                className={`shrink-0 text-fcit-navy transition-transform duration-500 ease-fcit ${
                  isOpen ? 'rotate-180' : 'rotate-0'
                }`}
                aria-hidden="true"
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 sm:px-6 sm:pb-6">
                <p className="body-3 text-fcit-secondary max-w-[680px]">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
