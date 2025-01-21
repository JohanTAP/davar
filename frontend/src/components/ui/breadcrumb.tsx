"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode;
  }
>( ( { ...props }, ref ) => <nav ref={ ref } aria-label="breadcrumb" { ...props } /> );
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>( ( { className, ...props }, ref ) => (
  <ol
    ref={ ref }
    className={ cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
      className
    ) }
    { ...props }
  />
) );
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>( ( { className, ...props }, ref ) => (
  <li ref={ ref } className={ cn( "inline-flex items-center gap-1.5", className ) } { ...props } />
) );
BreadcrumbItem.displayName = "BreadcrumbItem";

/**
 * 🟢 BreadcrumbLink usando `next/link`
 */
const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof Link> & {
    asChild?: boolean;
  }
>( ( { asChild, className, href, ...props }, ref ) =>
{
  const Comp = asChild ? Slot : Link;

  return (
    <Comp
      ref={ ref }
      href={ href as string }
      className={ cn( "transition-colors hover:text-foreground", className ) }
      { ...props }
    />
  );
} );
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>( ( { className, ...props }, ref ) => (
  <span
    ref={ ref }
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={ cn( "font-normal text-foreground", className ) }
    { ...props }
  />
) );
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ( {
  children,
  className,
  ...props
}: React.ComponentProps<"li"> ) => (
  <li role="presentation" aria-hidden="true" className={ cn( "[&>svg]:w-3.5 [&>svg]:h-3.5", className ) } { ...props }>
    { children ?? <ChevronRight /> }
  </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = ( {
  className,
  ...props
}: React.ComponentProps<"span"> ) => (
  <span role="presentation" aria-hidden="true" className={ cn( "flex h-9 w-9 items-center justify-center", className ) } { ...props }>
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

/** 
 * 🟢 **Breadcrumb dinámico usando `usePathname`**
 */
export function DynamicBreadcrumb ()
{
  const pathname = usePathname();
  const pathSegments = pathname.split( "/" ).filter( Boolean );

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
        </BreadcrumbItem>
        { pathSegments.map( ( segment, index ) =>
        {
          const href = `/${ pathSegments.slice( 0, index + 1 ).join( "/" ) }`;
          const isLast = index === pathSegments.length - 1;

          return (
            <BreadcrumbItem key={ href }>
              <BreadcrumbSeparator />
              { isLast ? (
                <BreadcrumbPage>{ formatSegment( segment ) }</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={ href }>{ formatSegment( segment ) }</BreadcrumbLink>
              ) }
            </BreadcrumbItem>
          );
        } ) }
      </BreadcrumbList>
    </Breadcrumb>
  );
}

/**
 * 🔠 **Función para formatear el texto del breadcrumb**
 */
function formatSegment ( segment: string )
{
  return segment
    .replace( /-/g, " " ) // Reemplaza guiones por espacios
    .replace( /\b\w/g, ( l ) => l.toUpperCase() ); // Capitaliza la primera letra
}

export
{
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
