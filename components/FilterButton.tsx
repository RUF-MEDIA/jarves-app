// components/FilterButton.tsx

'use client';

import { FiFilter } from 'react-icons/fi';

interface FilterButtonProps {
  isActive: boolean;
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ isActive, onClick }) => {
  return <FiFilter className={`w-4 h-4 text-gray-600 cursor-pointer hover:text-gray-800 ${isActive ? 'text-blue-600' : ''}`} onClick={onClick} />;
};

export default FilterButton;
