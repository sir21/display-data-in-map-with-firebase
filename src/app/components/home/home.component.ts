import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WishService } from 'src/app/services/wish.service';
import { DisplayPlace, Place } from '../../models/wish';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ListComponent } from '../list/list.component';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { UtilService } from 'src/app/services/util.service';
import data from 'src/assets/data/location_new.json';

@AutoUnsubscribe()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  backgroundImage = `url('../../../assets/images/Background.png')`;
  map = `url('../../../assets/images/Map_new.png')`;
  line1 = `url('../../../assets/images/text.png')`
  line2 = `url('../../../assets/images/text-2.png')`
  @ViewChild('mapElement')
  mapElement!: ElementRef;
  places: DisplayPlace[] = [];
  dialogRef!: MatDialogRef<ListComponent>;
  screenHeight = window.innerHeight;
  screenWidth = window.innerWidth;
  smallScreen = false;
  loading = true;
  showLocation = true;
  colomboTowns: string[] = [];
  colomboDisplay: string[] = [];
  colomboWishes: string[] = [];
  colombo = data.towns.find(c => c.name === 'Colombo');
  kandyTowns: string[] = [];
  kandyDisplay: string[] = [];
  kandyWishes: string[] = [];
  kandy = data.towns.find(c => c.name === 'Kandy');


  constructor(
    private wishService: WishService,
    private dialog: MatDialog,
    private util: UtilService
  ) {
    this.colomboLocations();
    this.kandyLocations();
    if (this.screenHeight <= 550 || this.screenWidth <= 750) {
      this.smallScreen = true;
    }
  }

  ngOnInit(): void {
    this.getLocations();
    setTimeout(() => {
      this.loading = false;
    }, 3000);
  }

  ngOnDestroy(): void {
    // support
  }

  getLocations(): void {
    this.wishService.getMapLocations().subscribe(res => {
      const tempPlaces: DisplayPlace[] = [];
      const c: Place[] = [];
      res.forEach(loc => {
        const tempPlace: Place = loc.payload.doc.data() as Place;
        if (this.colomboTowns.find(t => t === tempPlace.loc.name)) {
          this.colomboDisplay.push(tempPlace.loc.name);
          this.colomboWishes = this.colomboWishes.concat(tempPlace.wishes);
        } else if (this.kandyTowns.find(t => t === tempPlace.loc.name)) {
          this.kandyDisplay.push(tempPlace.loc.name);
          this.kandyWishes = this.kandyWishes.concat(tempPlace.wishes);
        } else {
          tempPlaces.push({
            name: tempPlace.loc.name,
            x: `${this.smallScreen ? tempPlace.loc.x3 : tempPlace.loc.x}px`,
            y: `${this.smallScreen ? tempPlace.loc.y3 + 25 : tempPlace.loc.y + 15}px`,
            wishes: tempPlace.wishes,
            tooltip: `${tempPlace.loc.name} (${tempPlace.wishes.length})`,
            height: '25px'
          });
        }
      });
      this.places = tempPlaces;
      this.addColombo();
      this.addKandy();
    }, () => {
      this.util.openSnackBar({ message: 'Error loading wish locations', type: 'error' });
    })
  }

  // Colombo logos
  addColombo() {
    this.places.push({
      name: 'Colombo',
      x: `${this.smallScreen ? this.colombo?.x3 : this.colombo?.x}px`,
      y: `${this.smallScreen ? this.colombo?.y3 || 0 + 20 : this.colombo?.y || 0 + 10}px`,
      wishes: this.colomboWishes,
      tooltip: `Colombo (${this.colomboWishes.length})`,
      height: '50px'
    })
  }

  colomboLocations() {
    this.colomboTowns = data.towns.filter(t => t.district === 'Colombo').map(t => t.name);
  }

  // Colombo logos
  addKandy() {
    this.places.push({
      name: 'Kandy',
      x: `${this.smallScreen ? this.kandy?.x3 : this.kandy?.x}px`,
      y: `${this.smallScreen ? this.kandy?.y3 || 0 + 20 : this.kandy?.y || 0 + 10}px`,
      wishes: this.kandyWishes,
      tooltip: `Kandy (${this.kandyWishes.length})`,
      height: '50px'
    })
  }

  kandyLocations() {
    this.kandyTowns = data.towns.filter(t => t.district === 'Kandy').map(t => t.name);
  }

  showPopUp(event: any): void {
    this.removePopup();
    const wishes = this.places.find(p => p.name === event.target.id)?.wishes || [];
    this.dialogRef = this.dialog.open(ListComponent,
      {
        width: this.smallScreen ? '200px' : '300px',
        maxHeight: this.smallScreen ? '200px' : `300px`,
        hasBackdrop: true,
        data: {
          ids: wishes,
          town: event.target.id
        },
      });
  }

  removePopup(): void {
    this.dialogRef?.close();
  }

  toggleLocations(event: boolean) {
    this.showLocation = !event;
  }

}
