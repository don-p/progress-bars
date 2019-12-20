import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent {

  private isLoaded: boolean = false;
  private isLoading:boolean = false;
  private loaded: number = 0;
  @Output() loadComplete: EventEmitter<any> = new EventEmitter();

  constructor() { }

  load(): void {
    this.isLoading = true;
    // Simulate async loading with setInterval.
    let interval: any = setInterval(() => {
      if(this.loaded < 100) {
        this.loaded++;
      } else {
        clearInterval(interval);
        this.isLoaded = true;
        this.isLoading = false;
        this.loadComplete.emit(this);
      }
    }, 25);
  }

}
