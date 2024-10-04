'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';

const AccordionContext = React.createContext<{
  expanded: string | null;
  setExpanded: React.Dispatch<React.SetStateAction<string | null>>;
} | null>(null);

export function Accordion({
  children,
  type = 'single',
  collapsible = false,
}: {
  children: React.ReactNode;
  type?: 'single' | 'multiple';
  collapsible?: boolean;
}) {
  const [expanded, setExpanded] = React.useState<string | null>(null);

  return (
    <AccordionContext.Provider value={{ expanded, setExpanded }}>
      <div className="space-y-1">{children}</div>
    </AccordionContext.Provider>
  );
}

const AccordionItemContext = React.createContext<{ value: string } | null>(null);

export function AccordionItem({ children, value }: { children: React.ReactNode; value: string }) {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div className="border rounded-lg">{children}</div>
    </AccordionItemContext.Provider>
  );
}

export function AccordionTrigger({ children }: { children: React.ReactNode }) {
  const context = React.useContext(AccordionContext);
  const itemContext = React.useContext(AccordionItemContext);

  if (!context || !itemContext) {
    throw new Error('AccordionTrigger must be used within an AccordionItem');
  }

  const { expanded, setExpanded } = context;
  const { value } = itemContext;

  const isExpanded = expanded === value;

  const handleClick = () => {
    setExpanded(isExpanded ? null : value);
  };

  return (
    <button className="flex items-center justify-between w-full p-4 text-sm font-medium text-left" onClick={handleClick}>
      {children}
      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'transform rotate-180' : ''}`} />
    </button>
  );
}

export function AccordionContent({ children }: { children: React.ReactNode }) {
  const context = React.useContext(AccordionContext);
  const itemContext = React.useContext(AccordionItemContext);

  if (!context || !itemContext) {
    throw new Error('AccordionContent must be used within an AccordionItem');
  }

  const { expanded } = context;
  const { value } = itemContext;

  const isExpanded = expanded === value;

  return (
    <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
      <div className="p-4">{children}</div>
    </div>
  );
}
