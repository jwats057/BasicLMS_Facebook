import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss']
})
export class StepComponent implements OnInit {

  @Input('icon') icon: string = '';
  @Input('text') text: string = '';

  constructor() { }

  ngOnInit() {
  }

}
