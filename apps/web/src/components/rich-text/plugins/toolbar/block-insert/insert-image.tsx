import { ImageIcon } from "lucide-react";

import { useToolbarContext } from "@/components/rich-text/context/toolbar-context";
import { SelectItem } from "@fundlevel/ui/components/select";

import { InsertImageDialog } from "@/components/rich-text/plugins/images-plugin";

export function InsertImage() {
  const { activeEditor, showModal } = useToolbarContext();

  return (
    <SelectItem
      value="image"
      onPointerUp={(e) => {
        showModal("Insert Image", (onClose) => (
          <InsertImageDialog activeEditor={activeEditor} onClose={onClose} />
        ));
      }}
      className=""
    >
      <div className="flex items-center gap-1">
        <ImageIcon className="size-4" />
        <span>Image</span>
      </div>
    </SelectItem>
  );
}
