import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RecordsService } from './records.service';
import { Record } from "./record";

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})
export class RecordsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'content', 'edit', 'delete'];
  dataSource = new MatTableDataSource<any>();

  selectedRecord: Record = new Record();
  loading = false;
  longLoading = false;

  constructor(public recordService: RecordsService){
  }

  ngOnInit(): void{
    this.refresh()
  }

  async refresh(){
    this.loading = true;
    this.dataSource.data = await this.recordService.getRecords();
    this.loading = false;
  }

  async updateRecord(){
    if (this.selectedRecord.id !== undefined) {
      await this.recordService.updateRecord(this.selectedRecord);
    } else {
      await this.recordService.createRecord(this.selectedRecord);
    }
    this.selectedRecord = new Record();
    await this.refresh()
  }

  editProduct(record: Record){
    this.selectedRecord = Object.assign({}, record);
  }

  clearRecord(){
    this.selectedRecord = new Record();
  }

  async deleteRecord(record: Record){
    this.loading = true;
    if (confirm(`Are you sure you want to delete the record ${record.name}. This cannot be undone.`)) {
      await this.recordService.deleteRecord(record.id);
    }
    await this.refresh();
  }

  async runLongRunningTask(){
    this.longLoading = true;
    await this.recordService.runLongRunningTask().then((resp) => {
      confirm(resp)
    });
    this.longLoading = false;
  }
}
