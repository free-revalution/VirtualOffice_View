"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "./utils";
import { buttonVariants } from "./button";

// 简化版日历组件，避免 react-day-picker 的 React 19 兼容性问题
function Calendar({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-3", className)} {...props}>
      <div className="flex items-center justify-center py-4">
        <p className="text-sm text-muted-foreground">
          日历组件暂时不可用（需要更新依赖以支持 React 19）
        </p>
      </div>
    </div>
  );
}

export { Calendar };
