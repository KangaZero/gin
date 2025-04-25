/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex h-10 w-full rounded-base border-2 border-border bg-secondary-background selection:bg-main selection:text-main-foreground px-3 py-2 text-sm font-base text-foreground file:border-0 file:bg-transparent file:text-sm file:font-heading focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "placeholder:text-foreground/50",
        floating: "placeholder:text-transparent peer",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface InputProps
  extends React.ComponentProps<"input">,
    VariantProps<typeof inputVariants> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, label, ...props }, ref) => {
    if (variant === "floating" && label) {
      const [focused, setFocused] = useState(false);
      const [value, setValue] = useState(props.value ?? "");

      const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setFocused(true);
        props.onFocus?.(e);
      };
      const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setFocused(false);
        props.onBlur?.(e);
      };
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        props.onChange?.(e);
      };

      return (
        <div className="relative w-full">
          <input
            ref={ref}
            variant={variant}
            className={cn(inputVariants({ variant, className }))}
            placeholder={label}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            value={value}
            {...props}
          />
          <label
            className={cn(
              "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50 text-sm font-base transition-all duration-200",
              (focused || value) &&
                "top-1 text-xs text-foreground/70 -translate-y-0 scale-90 bg-secondary-background px-1"
            )}
          >
            {label}
          </label>
        </div>
      );
    }

    return (
      <input
        ref={ref}
        variant={variant}
        className={cn(inputVariants({ variant, className }))}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
