import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check, type LucideIcon } from 'lucide-react';

export interface DropdownOption<T extends string = string> {
  readonly value: T;
  readonly label: string;
  readonly icon?: LucideIcon;
}

interface CustomDropdownProps<T extends string = string> {
  value: T;
  options: readonly DropdownOption<string>[];
  onChange: (value: T) => void;
  defaultIcon?: LucideIcon;
  align?: 'left' | 'right';
  buttonClassName?: string;
  menuWidth?: number;
}

interface MenuPosition {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
}

export function CustomDropdown<T extends string = string>({
  value,
  options,
  onChange,
  defaultIcon: DefaultIcon,
  align = 'right',
  buttonClassName = '',
  menuWidth = 224,
}: CustomDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const current = options.find((o) => o.value === value);
  const ActiveIcon = current?.icon ?? DefaultIcon;

  const updatePosition = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const horizontalPadding = 16;
    const width = Math.min(
      Math.max(menuWidth, rect.width),
      window.innerWidth - horizontalPadding * 2
    );
    const preferredLeft = align === 'right' ? rect.right - width : rect.left;
    const left = Math.max(
      horizontalPadding,
      Math.min(preferredLeft, window.innerWidth - width - horizontalPadding)
    );
    const top = rect.bottom + 8;
    const bottomSafeArea = window.innerWidth < 768 ? 88 : 24;
    const maxHeight = Math.max(160, Math.min(320, window.innerHeight - top - bottomSafeArea));

    setPosition({ top, left, width, maxHeight });
  }, [align, menuWidth]);

  const handleToggle = () => {
    if (!isOpen) {
      updatePosition();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    const handleScroll = (e: Event) => {
      if (menuRef.current && menuRef.current.contains(e.target as Node)) return;
      updatePosition();
    };

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, updatePosition]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={`flex items-center justify-between gap-2 px-4 py-2 rounded-full border border-dervora-beige bg-white font-body text-sm text-dervora-dark hover:border-dervora-primary/30 transition-colors whitespace-nowrap ${buttonClassName}`}
      >
        <span className="flex items-center gap-2 truncate">
          {ActiveIcon && <ActiveIcon size={16} className="text-dervora-primary flex-shrink-0" />}
          <span className="truncate">{current?.label}</span>
        </span>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen &&
        position &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[60]"
              onClick={() => setIsOpen(false)}
            />

            <div
              ref={menuRef}
              style={{
                top: position.top,
                left: position.left,
                width: position.width,
                maxHeight: position.maxHeight,
              }}
              className="fixed overflow-y-auto bg-white border border-dervora-beige rounded-2xl shadow-xl z-[70]"
            >
              {options.map((opt) => {
                const OptIcon = opt.icon;
                const isActive = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value as T);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 font-body text-sm text-left hover:bg-dervora-cream transition-colors ${
                      isActive
                        ? 'bg-dervora-cream text-dervora-primary font-medium'
                        : 'text-dervora-dark'
                    }`}
                  >
                    {OptIcon && (
                      <OptIcon
                        size={16}
                        className={
                          isActive
                            ? 'text-dervora-primary flex-shrink-0'
                            : 'text-dervora-dark/60 flex-shrink-0'
                        }
                      />
                    )}
                    <span className="truncate">{opt.label}</span>
                    {isActive && (
                      <Check size={15} className="ml-auto text-dervora-primary flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </>,
          document.body
        )}
    </div>
  );
}