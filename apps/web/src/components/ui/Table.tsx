import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from './cx'

type TableProps = HTMLAttributes<HTMLDivElement> & {
  columns: string[]
  children: ReactNode
}

export function Table({ columns, children, className, ...props }: TableProps) {
  return (
    <div className={cx('overflow-x-auto rounded-xl border border-border/20 bg-card', className)} {...props}>
      <table className="min-w-full text-left">
        <thead className="bg-cardHigh">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className="px-4 py-3 font-label text-[10px] uppercase tracking-[0.2em] text-muted"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/15">{children}</tbody>
      </table>
    </div>
  )
}