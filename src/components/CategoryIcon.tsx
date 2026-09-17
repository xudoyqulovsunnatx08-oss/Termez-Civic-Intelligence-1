import {
  Construction,
  Lightbulb,
  Trash2,
  Droplets,
  Trees,
  Zap,
  Bus,
  GraduationCap,
  Stethoscope,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "../types";

const ICON_MAP: Record<Category, LucideIcon> = {
  "Yo'l": Construction,
  "Ko'cha yoritilishi": Lightbulb,
  Chiqindi: Trash2,
  Suv: Droplets,
  Obodonlashtirish: Trees,
  Elektr: Zap,
  Transport: Bus,
  "Ta'lim": GraduationCap,
  Tibbiyot: Stethoscope,
  Boshqa: MoreHorizontal,
};

interface CategoryIconProps {
  category: Category;
  size?: number;
}

export default function CategoryIcon({ category, size = 18 }: CategoryIconProps) {
  const Icon = ICON_MAP[category] ?? MoreHorizontal;
  return <Icon size={size} strokeWidth={2} />;
}
