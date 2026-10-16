import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "./card";

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label?: string;
  };
  gradient?: boolean;
  className?: string;
}

export function StatCard({ label, value, icon, trend, gradient = false, className }: StatCardProps) {
  return (
    <Card 
      className={cn(
        "relative overflow-hidden",
        gradient && "bg-gradient-to-br from-primary-50 to-white dark:from-slate-800 dark:to-slate-900",
        className
      )}
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
          </div>
          {icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
              {icon}
            </div>
          )}
        </div>
        
        {trend && (
          <div className="mt-4 flex items-center text-sm">
            <span
              className={cn(
                "flex items-center font-medium",
                trend.value > 0 ? "text-success-600" : trend.value < 0 ? "text-danger-600" : "text-slate-500"
              )}
            >
              {trend.value > 0 ? (
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ) : trend.value < 0 ? (
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                </svg>
              ) : (
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14" />
                </svg>
              )}
              {Math.abs(trend.value)}%
            </span>
            {trend.label && (
              <span className="ml-2 text-slate-500 dark:text-slate-400">{trend.label}</span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
