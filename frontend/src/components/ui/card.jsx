import * as React from "react"

import { cn } from "@/lib/utils"

function Card({
  className,
  size = "default",
  ...props
}) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "grid auto-rows-min items-start gap-1.5 px-6 pt-6 pb-4 data-[size=sm]:px-4 data-[size=sm]:pt-4 data-[size=sm]:pb-3 has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-base leading-none font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-sm leading-relaxed text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function CardAction({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "flex items-center justify-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        "px-6 pb-6 data-[size=sm]:px-4 data-[size=sm]:pb-4",
        className
      )}
      {...props}
    />
  )
}

function CardFooter({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center gap-3 border-t border-border/50 px-6 py-4 data-[size=sm]:px-4 data-[size=sm]:py-3",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}