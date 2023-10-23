import { Tree } from "react-arborist";

import { Node } from "./file-explorer-item";
import { useDynamicTree } from "./use-dynamic-tree";

export function FileExplorer() {
  const {
    controllers: { onCreate, onDelete, onMove, onRename },
    treeViewData,
  } = useDynamicTree();
  return (
    <Tree
      openByDefault={false}
      data={treeViewData}
      onCreate={onCreate}
      onRename={onRename}
      onMove={onMove}
      onDelete={onDelete}
      onSelect={(selected) => {
        console.log("selected", selected);
      }}
      disableMultiSelection={false}
    >
      {Node}
    </Tree>
  );
}
