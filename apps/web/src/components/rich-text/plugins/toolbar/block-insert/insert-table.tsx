import { TableIcon } from 'lucide-react'

import { useToolbarContext } from '@/components/rich-text/context/toolbar-context'
import { SelectItem } from '@workspace/ui/components/select'

import { InsertTableDialog } from '@/components/rich-text/plugins/table-plugin'

export function InsertTable() {
  const { activeEditor, showModal } = useToolbarContext()

  return (
    <SelectItem
      value="table"
      onPointerUp={() =>
        showModal('Insert Table', (onClose) => (
          <InsertTableDialog activeEditor={activeEditor} onClose={onClose} />
        ))
      }
      className=""
    >
      <div className="flex items-center gap-1">
        <TableIcon className="size-4" />
        <span>Table</span>
      </div>
    </SelectItem>
  )
}
