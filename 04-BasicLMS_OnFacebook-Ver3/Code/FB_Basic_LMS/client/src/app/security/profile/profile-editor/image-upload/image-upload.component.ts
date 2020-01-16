import { Component, OnInit } from '@angular/core';
import {UtilityService} from '../../../../services/utility.service';

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-image-upload',
  templateUrl: 'image-upload.component.html',
  styleUrls: ['image-upload.component.scss']
})
export class ImageUploadComponent {

  selectedFile: ImageSnippet;

  constructor(private utilityServices: UtilityService)
  {}

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {

      this.selectedFile = new ImageSnippet(event.target.result, file);

      this.utilityServices.uploadImage(this.selectedFile.file).subscribe(
        (res) => {

        },
        (err) => {

        });
    });

    reader.readAsDataURL(file);
  }
}
