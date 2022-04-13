import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  message: string;
  value: number;
}

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss']
})
export class ProcessComponent implements OnInit {
  message = '';
  value = 0;

  constructor(
    public dialogRef: MatDialogRef<ProcessComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.message = data.message;
    this.value = data.value
  }

  ngOnInit(): void {
  }

}
