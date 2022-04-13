import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Place, Wish, Location } from 'src/app/models/wish';
import { UploadService } from 'src/app/services/upload.service';
import { WishService } from 'src/app/services/wish.service';
import { v4 as uuid } from 'uuid';
import data from 'src/assets/data/location_new.json';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProcessComponent } from '../process/process.component';
import { UtilService } from 'src/app/services/util.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit, OnDestroy {
  wishForm!: FormGroup;
  fileUploaded = false;
  uploadedFile!: File | null;
  uploadedImage = '';
  towns: Location[] = data.towns;
  processDialog!: MatDialogRef<ProcessComponent>;

  constructor(
    private uploadService: UploadService,
    private wishService: WishService,
    private router: Router,
    private dialog: MatDialog,
    private util: UtilService
  ) { }

  @ViewChild('fileUpload')
  uploadButton!: ElementRef;

  ngOnInit(): void {
    this.createForm();
  }

  ngOnDestroy(): void {
    // support
  }

  createForm(): void {
    this.wishForm = new FormGroup({
      file: new FormControl(''),
      name: new FormControl(''),
      userWish: new FormControl(''),
      city: new FormControl(this.towns[0].name)
    });
  }

  uploadOpen() {
    this.uploadButton.nativeElement.click();
  }

  onFileChange(event: any): void {
    if (event && event.target && event.target.files) {
      const fileList: FileList = event.target.files as FileList;
      this.uploadedFile = fileList.item(0) || null;
      this.uploadedImage = `url(${URL.createObjectURL(this.uploadedFile)})`;
      console.log(this.uploadedImage);
    } else {
      console.error('no files');
    }
  }

  submit(): void {
    const values = this.wishForm.value;
    if (this.wishForm.invalid) {
      this.util.openSnackBar({ message: 'Form incomplete, Please fill all the fields', type: 'error' });
      return;
    }
    this.processDialog = this.dialog.open(ProcessComponent, {
      data: {
        message: 'Process started...',
        value: 10
      },
      width: '300px'
    });
    const filename = uuid();
    const wish: Wish = {
      id: filename,
      name: values.name,
      city: values.city,
      userWish: values.userWish,
      created: new Date().getTime(),
      image: {
        url: '',
        name: filename
      }
    }
    this.processDialog.componentInstance.message = 'Uploading image...';
    this.processDialog.componentInstance.value = 20;
    if (this.uploadedFile) {
      this.uploadService.uploadImage(this.uploadedFile!, filename).then(res => {
        console.log(res);
        res.ref.getDownloadURL().then(url => {
          wish.image.url = url;
          this.uploadWish(wish);
        }).catch(() => {
          this.processDialog.close();
          this.util.openSnackBar({ message: 'Upload image failed', type: 'error' });
        })
      }).catch(() => {
        this.processDialog.close();
        this.util.openSnackBar({ message: 'Upload image failed', type: 'error' });
      })
    } else {
      this.processDialog.close();
      this.util.openSnackBar({ message: 'Upload image missing', type: 'error' });
    }
  }

  uploadWish(wish: Wish): void {
    this.processDialog.componentInstance.message = 'Uploading wish...';
    this.processDialog.componentInstance.value = 50;
    this.wishService.saveWish(wish).then(() => {
      this.addLocation(wish);
    }).catch(() => {
      this.processDialog.close();
      this.util.openSnackBar({ message: 'Upload wish failed', type: 'error' });
    })
  }

  addLocation(wish: Wish): void {
    const location: Location | undefined = this.towns.find(t => t.name === wish.city);
    if (location) {
      let place: Place = {
        wishes: [wish.id],
        loc: location
      }
      this.processDialog.componentInstance.message = 'Updating wish location...';
      this.processDialog.componentInstance.value = 70;
      this.wishService.getLocation(wish.city).subscribe(res => {
        if (res.exists) {
          place = res.data() as Place;
          place.wishes.push(wish.id);
          this.wishService.updateLocation(place).then(() => {
            this.processDialog.componentInstance.message = 'Wish uploaded';
            this.processDialog.componentInstance.value = 100;
            setTimeout(() => {
              this.processDialog.close();
              this.routeToHome();
            }, 2000);
          }).catch(err => {
            this.util.openSnackBar({ message: 'Upload location failed', type: 'error' });
          })
        } else {
          this.wishService.addLocation(place).then(() => {
            this.processDialog.componentInstance.message = 'Wish uploaded';
            this.processDialog.componentInstance.value = 100;
            setTimeout(() => {
              this.processDialog.close();
              this.routeToHome();
            }, 2000);
          }).catch(err => {
            this.util.openSnackBar({ message: 'Upload location failed', type: 'error' });
          })
        }
      })
    }
  }

  routeToHome() {
    this.router.navigate(['/']);
  }

}
