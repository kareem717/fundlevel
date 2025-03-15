import { SquareSplitVerticalIcon } from 'lucide-react'

import { useToolbarContext } from '@/components/rich-text/context/toolbar-context'
import { SelectItem } from '@workspace/ui/components/select'

import { INSERT_PAGE_BREAK } from '@/components/rich-text/plugins/page-break-plugin'

export function InsertPageBreak() {
  const { activeEditor } = useToolbarContext()

  return (
    <SelectItem
      value="page-break"
      onPointerUp={() =>
        activeEditor.dispatchCommand(INSERT_PAGE_BREAK, undefined)
      }
      className=""
    >
      <div className="flex items-center gap-1">
        <SquareSplitVerticalIcon className="size-4" />
        <span>Page Break</span>
      </div>
    </SelectItem>
  )
}
