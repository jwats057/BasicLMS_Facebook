import { Context } from './../models/log.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Optional, Inject } from '@angular/core';

@Component({
  selector: 'app-context',
  templateUrl: './context.component.html',
  styleUrls: ['./context.component.scss']
})
export class ContextComponent implements OnInit {

  context: Context = {method: '', params: [], result: ''};
  constructor(
    public dialogRef: MatDialogRef<ContextComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) data: Context,
  ) {
    this.context.method = data.method;
    this.context.result = data.result;
    const items: string[] = [];
    data.params.forEach(item => {
      items.push(
        JSON.stringify(item)
      );
    });
    this.context.params = items;
  }

  ngOnInit() {
  }

}
