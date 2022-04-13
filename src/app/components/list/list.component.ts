import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Wish } from 'src/app/models/wish';
import { WishService } from 'src/app/services/wish.service';

export interface DialogData {
  ids: string[];
  town: string;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  wishes: Wish[] = [];
  ids: string[] = [];
  town: string = '';
  constructor(
    private wishService: WishService,
    public dialogRef: MatDialogRef<ListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.ids = this.data.ids;
    this.town = this.data.town;
  }

  ngOnInit(): void {
    this.loadWishes();
  }

  loadWishes(): void {
    this.ids.forEach(id => {
      this.wishService.getWish(id).subscribe(res => {
        if (res.exists) {
          this.wishes.push(res.data() as Wish);
          console.log(this.wishes);
        }
      })
    });
  }

}
