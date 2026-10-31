import React from 'react';
import {
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  Film,
  HeartPulse,
  GraduationCap,
  MoreHorizontal,
  Briefcase,
  Store,
  Laptop,
  TrendingUp,
  Gift,
  PlusCircle,
  Tag,
  HelpCircle,
} from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
  size?: number;
  color?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  name,
  className = '',
  size = 20,
  color,
}) => {
  const iconProps = {
    size,
    className,
    style: color ? { color } : undefined,
  };

  switch (name) {
    case 'Utensils':
      return <Utensils {...iconProps} />;
    case 'Car':
      return <Car {...iconProps} />;
    case 'ShoppingBag':
      return <ShoppingBag {...iconProps} />;
    case 'Zap':
      return <Zap {...iconProps} />;
    case 'Film':
      return <Film {...iconProps} />;
    case 'HeartPulse':
      return <HeartPulse {...iconProps} />;
    case 'GraduationCap':
      return <GraduationCap {...iconProps} />;
    case 'MoreHorizontal':
      return <MoreHorizontal {...iconProps} />;
    case 'Briefcase':
      return <Briefcase {...iconProps} />;
    case 'Store':
      return <Store {...iconProps} />;
    case 'Laptop':
      return <Laptop {...iconProps} />;
    case 'TrendingUp':
      return <TrendingUp {...iconProps} />;
    case 'Gift':
      return <Gift {...iconProps} />;
    case 'PlusCircle':
      return <PlusCircle {...iconProps} />;
    case 'Tag':
      return <Tag {...iconProps} />;
    default:
      return <HelpCircle {...iconProps} />;
  }
};
