import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackComponent } from '../components/snack/snack.component';
import { Snack } from '../models/snack';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  config: MatSnackBarConfig = {
    horizontalPosition: 'right',
    verticalPosition: 'top',
    duration: 3000
  }

  constructor(
    private snackBar: MatSnackBar
  ) { }

  openSnackBar(message: Snack): void {
    this.config.data = message;
    this.snackBar.openFromComponent(SnackComponent, this.config);
  }
}
