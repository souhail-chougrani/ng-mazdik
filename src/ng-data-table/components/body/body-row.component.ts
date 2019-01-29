import {
  Component, OnInit, Input, HostBinding, OnDestroy, ViewChild, ElementRef,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {DataTable, ColumnResizeMode, Row, Column} from '../../base';
import {Subscription} from 'rxjs';
import {translate} from '../../base/util';
import {isBlank} from '../../../lib/common/utils';

@Component({
  selector: 'dt-body-row',
  templateUrl: './body-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyRowComponent implements OnInit, OnDestroy {

  @Input() table: DataTable;
  @Input() row: Row;

  @ViewChild('rowLeft') rowLeft: ElementRef;

  private subscriptions: Subscription[] = [];

  @HostBinding('class.datatable-body-row') cssClass = true;
  @HostBinding('class.row-selected')
  get cssSelected(): boolean {
    return (this.row && !isBlank(this.row.$$index)) ? this.table.selection.isRowSelected(this.row.$$index) : false;
  }

  @HostBinding('attr.role') role = 'row';

  @HostBinding('style.height.px')
  get rowHeight(): number {
    if (this.table.settings.rowHeightProp) {
      const rowHeight = this.row[this.table.settings.rowHeightProp];
      return !isBlank(rowHeight) ? rowHeight : this.table.dimensions.rowHeight;
    } else {
      return this.table.dimensions.rowHeight;
    }
  }

  @HostBinding('style.width.px')
  get rowWidth(): number {
    return this.table.dimensions.columnsTotalWidth + 1;
  }

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    if (this.table.settings.columnResizeMode === ColumnResizeMode.Aminated) {
      const subColumnResize = this.table.events.resizeSource$.subscribe(() => {
        this.cd.markForCheck();
      });
      this.subscriptions.push(subColumnResize);
    }
    const subColumnResizeEnd = this.table.events.resizeEndSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    const subScroll = this.table.events.scrollSource$.subscribe(() => {
      this.rowLeft.nativeElement.style.transform = translate(this.table.dimensions.offsetX, 0);
      this.cd.markForCheck();
    });
    const subSort = this.table.events.sortSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    const subPage = this.table.events.pageSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    this.subscriptions.push(subColumnResizeEnd);
    this.subscriptions.push(subScroll);
    this.subscriptions.push(subSort);
    this.subscriptions.push(subPage);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  isEditableCell(row: Row, column: Column): boolean {
    if (column.editable && row.hasOwnProperty(this.table.settings.isEditableCellProp)) {
      return row[this.table.settings.isEditableCellProp];
    }
    return column.editable;
  }

}
