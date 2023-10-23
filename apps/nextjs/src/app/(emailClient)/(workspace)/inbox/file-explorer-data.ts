import type {
  Disposable,
  ExplicitDataSource,
  TreeDataProvider,
  TreeItem,
  TreeItemIndex,
} from "react-complex-tree";

export class FileExplorerDataProvider<T> implements TreeDataProvider {
  private data: ExplicitDataSource<T>;

  private handlers: Record<string, (changedItemIds: TreeItemIndex[]) => void> =
    {};

  private setItemName?: (item: TreeItem<T>, newName: string) => TreeItem<T>;

  constructor(
    items: Record<TreeItemIndex, TreeItem<T>>,
    setItemName?: (item: TreeItem<T>, newName: string) => TreeItem<T>,
  ) {
    this.data = { items };
    this.setItemName = setItemName;
  }

  public async getTreeItem(itemId: TreeItemIndex) {
    console.log("itemId", itemId);
    const item = this.data.items[itemId];
    if (!item) {
      throw new Error(`Item ${itemId} does not exist`);
    }
    return Promise.resolve(item);
  }
  public async getTreeItems(itemIds: TreeItemIndex[]) {
    console.log("itemIds", itemIds);
    const items = itemIds
      .map((itemId) => {
        return this.data.items[itemId];
      })
      .filter((item) => !!item) as TreeItem<{ name: string }>[];
    return Promise.resolve(items);
  }

  public async onChangeItemChildren(
    itemId: TreeItemIndex,
    newChildren: TreeItemIndex[],
  ): Promise<void> {
    const item = this.data.items[itemId];
    if (!item) {
      throw new Error(`Item ${itemId} does not exist`);
    }
    item.children = newChildren;
    item.isFolder = newChildren.length > 0;
    Object.values(this.handlers).forEach((handler) => handler([itemId]));
  }

  public onDidChangeTreeData(
    listener: (changedItemIds: TreeItemIndex[]) => void,
  ): Disposable {
    const id = (Math.random() + 1).toString(36).substring(7);
    this.handlers[id] = listener;
    return { dispose: () => delete this.handlers[id] };
  }

  public async onRenameItem(item: TreeItem<T>, name: string): Promise<void> {
    if (this.setItemName && item.canRename) {
      const newItem = this.setItemName(item, name);
      this.data.items[item.index] = newItem;
    }
  }

  public resetData(items: Record<TreeItemIndex, TreeItem<T>>): void {
    this.data = { items };
    console.log("resetData", this.data); // this looks correct!
  }
}
