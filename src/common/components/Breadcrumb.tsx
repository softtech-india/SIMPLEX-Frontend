import React from 'react'
import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'
import useIsMobile from '@/common/hooks/useIsMobile'

export interface BreadcrumbItem {
  name: string
  path?: string  
}

interface BreadcrumbProps {
  title: string
  breadcrumbs: BreadcrumbItem[]

  showHome?: boolean
  homePath?: string
}

export default function Breadcrumb({
  title,
  breadcrumbs,
  showHome = true,
  homePath = '/dashboard',
}: BreadcrumbProps) {
  const isMobile = useIsMobile()

  const allCrumbs: BreadcrumbItem[] = showHome
    ? [{ name: 'Home', path: homePath }, ...breadcrumbs]
    : breadcrumbs

  if (isMobile) return null

  return (
    <div className="bg-white border-b border-gray-200 px-3 py-2 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

        {/* Left — Page Title */}
        <h1 className="text-sm md:text-md font-bold heading-primary">{title}</h1>

        {/* Right — Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
          {allCrumbs.map((crumb, index) => {
            const isFirst = index === 0
            const isLast = index === allCrumbs.length - 1

            return (
              <div key={index} className="flex items-center gap-1.5">
                {index > 0 && (
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                )}

                {!isLast && crumb.path ? (
                  <Link
                    href={crumb.path}
                    className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    {isFirst && showHome && <Home className="w-3.5 h-3.5 shrink-0" />}
                    <span className="hidden sm:inline">{crumb.name}</span>
                  </Link>
                ) : (
                  <span className="flex items-center gap-1 text-gray-700 font-medium">
                    {isFirst && showHome && <Home className="w-3.5 h-3.5 shrink-0" />}
                    {crumb.name}
                  </span>
                )}
              </div>
            )
          })}
        </nav>

      </div>
    </div>
  )
}