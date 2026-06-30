import * as vscode from 'vscode';

/** A single row in the example tree view. */
export class ExampleItem extends vscode.TreeItem {
  constructor(label: string, description: string) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.description = description;
    this.iconPath = new vscode.ThemeIcon('symbol-event');
  }
}

/**
 * Minimal {@link vscode.TreeDataProvider} demonstrating the refresh pattern via
 * an {@link vscode.EventEmitter}. `refresh()` is wired to the view's title-bar
 * button (see the `view/title` menu contribution in package.json).
 */
export class ExampleTreeProvider
  implements vscode.TreeDataProvider<ExampleItem>, vscode.Disposable
{
  private readonly emitter = new vscode.EventEmitter<ExampleItem | undefined>();
  readonly onDidChangeTreeData = this.emitter.event;

  private items: ExampleItem[] = this.buildItems();

  getTreeItem(element: ExampleItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: ExampleItem): ExampleItem[] {
    // A flat list: only the root has children.
    return element ? [] : this.items;
  }

  refresh(): void {
    this.items = this.buildItems();
    this.emitter.fire(undefined);
  }

  dispose(): void {
    this.emitter.dispose();
  }

  private buildItems(): ExampleItem[] {
    const now = new Date().toLocaleTimeString();
    return [new ExampleItem('Example item', 'static row'), new ExampleItem('Last refreshed', now)];
  }
}
