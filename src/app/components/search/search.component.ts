import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { Observable } from 'rxjs';
import { Wish } from 'src/app/models/wish';

@AutoUnsubscribe()
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  searchForm!: FormGroup;
  list: Wish[] = [];
  wishesCollection: any;
  loading = false;
  interval: any;
  input = '';

  @Output() listAvailable = new EventEmitter<boolean>();

  constructor(
    private fireStore: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.searchForm = new FormGroup({
      search: new FormControl(this.input)
    });

    this.interval = setInterval(() => {
      this.checkData();
    }, 3000)
  }

  checkData(): void {
    const formValue = this.searchForm.value.search;
    if (this.input === formValue) {
      return;
    }
    this.input = formValue;
    this.fireStore.collection('wishes').ref.where('name', '==', formValue).get().then(
      res => {
        console.log(res);
        if (res.empty) {
          console.log('empty');
          this.list = [];
          this.listAvailable.emit(false);
        } else {
          res.forEach(wish => {
            this.list.push(wish.data() as Wish);
          });
        }
      }
    )
  }

  ngOnDestroy(): void {
    // support
  }

  getImageUrl(url: string): string {
    return `url('${url}')`;
  }

}
