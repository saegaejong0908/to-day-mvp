import type { HTMLAttributes, ReactNode } from "react";

type PanelProps = {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export function Panel({ children, className = "", ...rest }: PanelProps) {
  return (
    <section className={["ui-panel", className].join(" ").trim()} {...rest}>
      {children}
    </section>
  );
}

export function PanelHeader({ children, className = "", ...rest }: PanelProps) {
  return (
    <div className={["ui-panel-header", className].join(" ").trim()} {...rest}>
      {children}
    </div>
  );
}

export function PanelBody({ children, className = "", ...rest }: PanelProps) {
  return (
    <div className={["ui-panel-body", className].join(" ").trim()} {...rest}>
      {children}
    </div>
  );
}

