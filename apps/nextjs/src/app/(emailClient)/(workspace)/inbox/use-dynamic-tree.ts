import { useMemo } from "react";
import type {
  CreateHandler,
  DeleteHandler,
  MoveHandler,
  RenameHandler,
} from "react-arborist";
import { SimpleTree } from "react-arborist";

import type { ExtendedTreeData } from "@skylar/logic";
import { setTreeViewData, useGlobalStore } from "@skylar/logic";

let nextId = 0;

export function useDynamicTree() {
  const treeViewData = useGlobalStore(
    (state) => state.EMAIL_CLIENT.treeViewData,
  );

  const tree = useMemo(() => new SimpleTree(treeViewData), [treeViewData]);

  const onMove: MoveHandler<ExtendedTreeData> = (args) => {
    for (const id of args.dragIds) {
      tree.move({ id, parentId: args.parentId, index: args.index });
    }
    setTreeViewData(tree.data);
  };

  const onRename: RenameHandler<ExtendedTreeData> = ({ id, name }) => {
    tree.update({ id, changes: { name } as Partial<ExtendedTreeData> });
    setTreeViewData(tree.data);
  };

  const onCreate: CreateHandler<ExtendedTreeData> = ({
    parentId,
    index,
    type,
  }) => {
    const data: ExtendedTreeData = {
      id: `simple-tree-id-${nextId++}`,
      name: "",
      data: { name: "" },
      meta: {
        canMove: true,
        canRename: true,
        isFolder: type === "internal",
      },
    };
    if (type === "internal") data.children = [];
    tree.create({
      parentId,
      index,
      data,
    });
    setTreeViewData(tree.data);
    return data;
  };

  const onDelete: DeleteHandler<ExtendedTreeData> = (args) => {
    args.ids.forEach((id) => tree.drop({ id }));
    setTreeViewData(tree.data);
  };

  const controllers = { onMove, onRename, onCreate, onDelete };

  return { treeViewData, controllers } as const;
}
