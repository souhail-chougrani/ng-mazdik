import {Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import {TreeNode, TreeDataSource, Settings} from '../types';
import {DataTable} from '../base/data-table';
import {ColumnBase} from '../base/column-base';

@Component({
  selector: 'app-tree-table',
  templateUrl: './tree-table.component.html',
  styleUrls: ['../styles/index.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TreeTableComponent implements OnInit {

  @Input() public nodes: TreeNode[];
  @Input() public service: TreeDataSource;
  @Output() requestNodes: EventEmitter<TreeNode> = new EventEmitter();
  @Output() editComplete: EventEmitter<any> = new EventEmitter();

  @Input()
  set columns(val: ColumnBase[]) {
    this._columns = val;
    this.table.createColumns(this._columns);
  }

  get columns(): ColumnBase[] {
    return this._columns;
  }

  @Input()
  set settings(val: Settings) {
    this._settings = val;
    this.table.setSettings(this._settings);
  }

  get settings(): Settings {
    return this._settings;
  }

  public table: DataTable;
  public offsetX: number = 0;
  private _columns: ColumnBase[];
  private _settings: Settings;

  constructor() {
    this.table = new DataTable();
  }

  ngOnInit() {
    if (this.service && !this.nodes) {
      this.service.getNodes().then(data => {
        this.nodes = data;
      });
    }
    this.table.actionColumnWidth = 250;
    this.table.settings.setWidthColumnOnMove = true;
  }

  onBodyScroll(event: any): void {
    const scrollYPos: number = event.scrollYPos;
    const scrollXPos: number = event.scrollXPos;
    this.offsetX = scrollXPos;
  }

  onCellEditComplete(event) {
    this.editComplete.emit(event);
  }

  onRequestNodes(event) {
    this.requestNodes.emit(event);
  }

}
