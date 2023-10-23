import { useEffect, useRef } from "react";
import type { NodeApi, NodeRendererProps } from "react-arborist";

import type { ExtendedTreeData } from "@skylar/logic";
import { setTreeViewData, useGlobalStore } from "@skylar/logic";

export function Node(props: NodeRendererProps<ExtendedTreeData>) {
  const treeViewData = useGlobalStore(
    (state) => state.EMAIL_CLIENT.treeViewData,
  );
  function updateTreeData(
    list: ExtendedTreeData[],
    id: string,
    children: ExtendedTreeData[],
  ): ExtendedTreeData[] {
    return list.map((nodeItem) => {
      if (nodeItem.id === id) {
        return { ...nodeItem, children };
      }
      if (nodeItem.children) {
        return {
          ...nodeItem,
          children: updateTreeData(nodeItem.children, id, children),
        };
      }
      return nodeItem;
    });
  }
  const handleClick = async (
    node: NodeApi<ExtendedTreeData>,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    if (node.isInternal) {
      node.toggle();
    }

    console.log("node", node.state);
    console.log("node", node.childIndex);
    if (!node.children || node.children.length > 0) {
      return;
    }
    return new Promise<undefined>((resolve) => {
      setTimeout(() => {
        setTreeViewData(
          updateTreeData(treeViewData, node.id, [
            {
              id: `${node.id}-0`,
              name: "Child Node",
              data: {
                name: "test",
              },
              meta: {
                canMove: true,
                canRename: true,
                isFolder: true,
              },
              children: [],
            },
            {
              id: `${node.id}-1`,
              name: "Child Node",
              data: {
                name: "test",
              },
              meta: {
                canMove: true,
                canRename: true,
                isFolder: true,
              },
              children: [],
            },
          ]),
        );
        resolve(undefined);
      }, 1000);
    });
  };

  return (
    <div
      style={props.style}
      ref={props.dragHandle}
      role="button"
      tabIndex={0}
      onClick={(e) => handleClick(props.node, e).catch(console.error)}
      onKeyDown={(_e) => {
        // if (e.code === "Enter")
        //   e.code === "Enter" && handleClick(props.node, e).catch(console.error);
      }}
    >
      {props.node.isLeaf ? "🌳" : props.node.isOpen ? "🗁" : "🗀"}
      {props.node.isEditing ? <Edit {...props} /> : <Show {...props} />}
    </div>
  );
}

function Show(props: NodeRendererProps<ExtendedTreeData>) {
  return (
    <>
      <span>{props.node.data.name}</span>
    </>
  );
}

function Edit({ node }: NodeRendererProps<ExtendedTreeData>) {
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current?.focus();
    input.current?.select();
  }, []);

  return (
    <input
      ref={input}
      defaultValue={node.data.name}
      onBlur={() => node.reset()}
      onKeyDown={(e) => {
        if (e.key === "Escape") node.reset();
        if (e.key === "Enter") node.submit(input.current?.value ?? "");
      }}
    ></input>
  );
}
