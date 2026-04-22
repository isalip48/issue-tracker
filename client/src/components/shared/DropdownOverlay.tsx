import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import type { ReactNode, RefObject } from "react";
import { createPortal } from "react-dom";

interface DropdownOverlayProps {
  buttonRef: RefObject<HTMLElement | null>;
  open: boolean;
  setOpen: (open: boolean) => void;
  children: ReactNode;
}

export const DropdownOverlay = ({
  buttonRef,
  open,
  setOpen,
  children,
}: DropdownOverlayProps) => {
  const portalRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
    });
  }, [buttonRef]);

  useLayoutEffect(() => {
    if (open) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
    }
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        (!portalRef.current || !portalRef.current.contains(target))
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setOpen, buttonRef]);

  if (!open) return null;

  return createPortal(
    <div
      ref={portalRef}
      className="fixed z-[9999] rounded-xl overflow-y-auto bg-card border border-border shadow-[0_12px_40px_rgba(0,0,0,0.2)] max-h-60 py-1.5"
      style={{ top: pos.top, left: pos.left, width: pos.width }}
    >
      {children}
    </div>,
    document.body,
  );
};
