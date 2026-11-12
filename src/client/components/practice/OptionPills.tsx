import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface OptionPillsProps<T> {
  items: T[];
  selectedValue: string | number | null;
  disabled?: boolean;
  getValue: (item: T) => string | number;
  getLabel: (item: T) => string;
  getTitle?: (item: T) => string;
  onSelect: (value: string | number) => void;
  'aria-label'?: string;
}

export function OptionPills<T>({
  items,
  selectedValue,
  disabled,
  getValue,
  getLabel,
  getTitle,
  onSelect,
  'aria-label': ariaLabel,
}: OptionPillsProps<T>) {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      size="sm"
      aria-label={ariaLabel}
      disabled={disabled}
      value={selectedValue == null ? '' : String(selectedValue)}
      onValueChange={(value) => {
        if (!value) return;
        const match = items.find((item) => String(getValue(item)) === value);
        if (!match) return;
        onSelect(getValue(match));
      }}
    >
      {items.map((item) => {
        const value = String(getValue(item));
        return (
          <ToggleGroupItem key={value} value={value} title={getTitle?.(item)} aria-label={getTitle?.(item) || getLabel(item)}>
            {getLabel(item)}
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
}
