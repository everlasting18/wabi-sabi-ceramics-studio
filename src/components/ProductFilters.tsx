import { useQuery } from "@tanstack/react-query";
import { Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { getAllCategories } from "@/services/productService";

interface ProductFiltersProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedBadges: string[];
  setSelectedBadges: (badges: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
}

const ProductFilters = ({
  selectedCategories,
  setSelectedCategories,
  selectedBadges,
  setSelectedBadges,
  priceRange,
  setPriceRange,
}: ProductFiltersProps) => {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  const badges = [
    { value: "new", label: "🆕 Mới", color: "text-blue-600" },
    { value: "sale", label: "🔥 Giảm giá", color: "text-red-600" },
    { value: "rare", label: "💎 Hiếm", color: "text-purple-600" },
  ];

  const toggleCategory = (category: string) => {
    setSelectedCategories(
      selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories, category]
    );
  };

  const toggleBadge = (badge: string) => {
    setSelectedBadges(
      selectedBadges.includes(badge)
        ? selectedBadges.filter((b) => b !== badge)
        : [...selectedBadges, badge]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="h-5 w-5" />
          Bộ lọc
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Categories */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Danh mục</h3>
          <div className="space-y-2">
            {categories?.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.name}`}
                  checked={selectedCategories.includes(category.name)}
                  onCheckedChange={() => toggleCategory(category.name)}
                />
                <Label
                  htmlFor={`category-${category.name}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {category.name_vi}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Badges */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Nhãn sản phẩm</h3>
          <div className="space-y-2">
            {badges.map((badge) => (
              <div key={badge.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`badge-${badge.value}`}
                  checked={selectedBadges.includes(badge.value)}
                  onCheckedChange={() => toggleBadge(badge.value)}
                />
                <Label
                  htmlFor={`badge-${badge.value}`}
                  className={`text-sm font-normal cursor-pointer ${badge.color}`}
                >
                  {badge.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Price Range */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Khoảng giá</h3>
          <div className="space-y-4">
            <Slider
              min={0}
              max={5000000}
              step={50000}
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {new Intl.NumberFormat("vi-VN").format(priceRange[0])}₫
              </span>
              <span className="text-muted-foreground">-</span>
              <span className="text-muted-foreground">
                {new Intl.NumberFormat("vi-VN").format(priceRange[1])}₫
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Filter Summary */}
        <div className="pt-2">
          <div className="text-xs text-muted-foreground space-y-1">
            {selectedCategories.length > 0 && (
              <p>✓ {selectedCategories.length} danh mục đã chọn</p>
            )}
            {selectedBadges.length > 0 && (
              <p>✓ {selectedBadges.length} nhãn đã chọn</p>
            )}
            {(priceRange[0] !== 0 || priceRange[1] !== 5000000) && (
              <p>✓ Lọc theo giá</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductFilters;
