import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Optional, Inject, Input } from '@angular/core';

@Component({
  selector: 'app-new-content',
  templateUrl: './new-content.component.html',
  styleUrls: ['./new-content.component.scss']
})
export class NewContentComponent implements OnInit {

  isSubmitting = false;
  data;

  constructor(
    public dialogRef: MatDialogRef<NewContentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) data: {course: string,
      current_module: string},
  ) {
    this.data = data;
   }

  ngOnInit() {}

  loading(isLoading) {
    this.isSubmitting = isLoading;
    if (isLoading) {
      document.getElementById('content').style.display = 'none';
    } else {
      document.getElementById('content').style.display = 'block';
    }
  }
}
