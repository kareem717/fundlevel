import { cn } from "@repo/ui/lib/utils";

export const files = [
  {
    name: 'AGREEMENT-2024.pdf',
    body: 'WHEREAS, the parties hereby agree to the terms and conditions set forth in this agreement as of the effective date...',
    date: '03/15/2024',
    pageCount: 24
  },
  {
    name: 'NDA-v3.2.pdf',
    body: 'This Non-Disclosure Agreement ("Agreement") is entered into by and between the undersigned parties...',
    date: '02/28/2024',
    pageCount: 8
  },
  {
    name: 'TERMS_OF_SERVICE.pdf',
    body: 'IN CONSIDERATION OF the use of the services and the mutual covenants contained herein...',
    date: '01/10/2024',
    pageCount: 15
  },
]

export function LegalFiles() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 h-full">
      {files.slice(0, 3).map((f, idx) => (
        <figure
          key={idx}
          className={cn(
            'relative w-full h-full p-6 rounded-sm border',
            'border-border bg-background cursor-pointer overflow-hidden',
            'hover:shadow-lg blur-[3px] hover:blur-none transition-all duration-300',
            'before:absolute before:left-0 before:top-0 before:w-1 before:h-full before:bg-foreground',
            idx === 1 && 'hidden sm:block',
            idx === 2 && 'hidden xl:block'
          )}
        >
          <div className="flex flex-row items-center justify-between mb-3">
            <div className="flex flex-col">
              <figcaption className="text-sm font-mono font-semibold">
                {f.name}
              </figcaption>
              <span className="text-xs text-muted-foreground/80 mt-1">
                Modified: {f.date} • {f.pageCount} pages
              </span>
            </div>
          </div>
          <blockquote className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {f.body}
          </blockquote>
          <div className="absolute top-2 right-2 text-[10px] text-muted-foreground font-mono">
            DOC-{idx + 1000}
          </div>
        </figure>
      ))}
    </div>
  )
}