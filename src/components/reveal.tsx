import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger children with the fs-stagger utility once revealed. */
  stagger?: boolean;
  /** Animation variant. */
  variant?: "up" | "fade" | "left" | "right";
  /** Delay before the reveal animation starts, in ms. */
  delay?: number;
  /** Render element. Defaults to a div. */
  as?: ElementType;
  /** Re-trigger every time it enters the viewport. Defaults to once. */
  once?: boolean;
};

const variantClass: Record<NonNullable<RevealProps["variant"]>, string> = {
  up: "fs-fade-up",
  fade: "fs-fade-in",
  left: "fs-slide-in-left",
  right: "fs-slide-in-right",
};

/**
 * Reveals its children with a scroll-triggered entrance animation using
 * IntersectionObserver. Reuses the FlowSim motion utilities defined in
 * styles.css so motion stays consistent and respects reduced-motion.
 */
export function Reveal({
  children,
  className,
  stagger = false,
  variant = "up",
  delay = 0,
  as,
  once = true,
}: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setShown(false);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref as never}
      className={cn(
        "transition-none",
        shown ? (stagger ? "fs-stagger" : variantClass[variant]) : "opacity-0",
        className,
      )}
      style={shown && delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
