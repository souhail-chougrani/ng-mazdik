import {Component, OnInit, ViewChild, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import {Settings, ICrudService} from './types';
import {ModalEditFormComponent} from './modal-edit-form/modal-edit-form.component';
import {DataTable} from './models/data-table';
import {ColumnBase} from './models/column-base';
import {CrudTable} from './models/crud-table';

@Component({
  selector: 'app-crud-table',
  templateUrl: './crud-table.component.html',
  styleUrls: ['./styles/index.css'],
  encapsulation: ViewEncapsulation.None,
})

export class CrudTableComponent implements OnInit {

  @Input() public service: ICrudService;
  @Input() public zIndexModal: number;
  @Input() public trackByProp: string;
  @Output() select: EventEmitter<any> = new EventEmitter();

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
  public crudTable: CrudTable;

  private _columns: ColumnBase[];
  private _settings: Settings;

  @ViewChild('modalEditForm') modalEditForm: ModalEditFormComponent;

  constructor() {
    this.table = new DataTable();
  }

  ngOnInit() {
    this.crudTable = new CrudTable(this.table, this.service);
    if (!this.trackByProp && this.settings.primaryKeys && this.settings.primaryKeys.length === 1) {
      this.trackByProp = this.settings.primaryKeys[0];
    }
    this.initRowMenu();
    if (this.table.settings.initLoad) {
      this.crudTable.getItems().then();
    }
  }

  initRowMenu() {
    this.table.actionMenu = [
      {
        label: this.table.settings.messages.titleDetailView,
        icon: 'icon icon-rightwards',
        command: (event) => this.viewAction()
      },
      {
        label: this.table.settings.messages.titleUpdate,
        icon: 'icon icon-pencil',
        command: (event) => this.updateAction(),
        disabled: !this.settings.crud
      }
    ];
  }

  clear() {
    this.crudTable.items = [];
    this.table.pager.total = 0;
    this.crudTable.detailView = false;
  }

  createAction() {
    this.crudTable.clearItem();
    this.crudTable.detailView = false;
    this.modalEditForm.open();
  }

  viewAction() {
    this.crudTable.errors = null;
    this.crudTable.setItem();
    this.crudTable.detailView = true;
    this.modalEditForm.open();
  }

  updateAction() {
    this.crudTable.setItem();
    this.crudTable.detailView = false;
    this.modalEditForm.open();
  }

  onEditComplete(row: any) {
    this.crudTable.update(row);
  }

  onFilter() {
    this.crudTable.getItems().then();
  }

  onPageChanged() {
    this.crudTable.getItems().then();
  }

  onSort() {
    this.crudTable.getItems().then();
  }

  onSelectedRow(event) {
    this.crudTable.selectedRowIndex = event;
    this.select.emit(this.crudTable.items[this.crudTable.selectedRowIndex]);
  }

}
