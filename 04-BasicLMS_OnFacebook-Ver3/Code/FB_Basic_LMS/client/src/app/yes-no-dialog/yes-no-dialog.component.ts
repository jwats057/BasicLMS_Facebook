import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-yes-no-dialog',
  templateUrl: './yes-no-dialog.component.html',
  styleUrls: ['./yes-no-dialog.component.scss']
})
export class YesNoDialogComponent implements OnInit {

  dialogData: {title: string, message: string};

  constructor(
    public dialogRef: MatDialogRef<YesNoDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) data: {title: string, message: string},
  ) {
    this.dialogData = data;
  }

  ngOnInit() {}

  click_event(resp: boolean) {
    this.dialogRef.close(resp);
  }
}
