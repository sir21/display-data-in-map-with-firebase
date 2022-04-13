import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Snack } from 'src/app/models/snack';

@Component({
  selector: 'app-snack',
  templateUrl: './snack.component.html',
  styleUrls: ['./snack.component.scss']
})
export class SnackComponent implements OnInit {

  constructor(
    public snackBarRef: MatSnackBarRef<SnackComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: Snack
  ) { }

  ngOnInit(): void {
  }

}
