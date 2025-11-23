"use client";

import * as React from "react";
// import { cn } from "./utils";

// 简化版日历组件，避免 react-day-picker 的 React 19 兼容性问题
function Calendar({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={"p-3" + (className ? ' ' + className : '')} {...props}>
      <div className="flex items-center justify-center py-4">
        <p className="text-sm text-muted-foreground">
          日历组件暂时不可用（需要更新依赖以支持 React 19）
        </p>
      </div>
    </div>
  );
}

export { Calendar };
