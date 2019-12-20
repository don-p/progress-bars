import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent {

  private loadingState: string = null;
  private loaded: number = 0;
  private promise: Promise<any>;

  constructor() {

  }

  load(): void {
    this.promise = new Promise<any>((resolve, reject) => {
      // Simulate async loading with setInterval.
      this.loadingState = 'PENDING';
      let interval: any = setInterval(() => {
        if(this.loaded < 100) {
          this.loaded++;
        } else {
          clearInterval(interval);
          this.loadingState = 'COMPLETE';
          resolve();
        }
      }, 25);
    });
  }

}
