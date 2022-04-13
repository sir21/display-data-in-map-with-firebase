import { Component, Input, OnInit } from '@angular/core';
import { Wish } from 'src/app/models/wish';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  @Input('wish') set setWish(wish: Wish) {
    console.log('wish', wish);
    this.wish = wish;
  }

  wish!: Wish;

  constructor() { }

  ngOnInit(): void {
  }

}
