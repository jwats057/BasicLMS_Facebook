import { ContextComponent } from '../../context/context.component';
import { MatDialog } from '@angular/material';
import { UtilityService } from './../../services/utility.service';
import { LogDay } from './../../models/log.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-logs',
  templateUrl: './view-logs.component.html',
  styleUrls: ['./view-logs.component.scss']
})
export class ViewLogsComponent implements OnInit {

  logsPayload: LogDay[] = [];
  loading = false;
  displayedColumns: string[] = ['time', 'description', 'user', 'id', 'more'];

  constructor(
    private UtilityServices: UtilityService,
    private dialog: MatDialog,
    ) {}

  ngOnInit() {
    this.loading = true;
    this.UtilityServices.getAdminLogs().subscribe( (resp: LogDay[]) => {
      console.log(resp);
      this.logsPayload = resp;
      this.loading = false;
    });
  }

  openMore(context) {
    const dialogRef = this.dialog.open(ContextComponent, {
      width: '90%',
      data: context
    });
  }
}
