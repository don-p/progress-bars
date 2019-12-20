import {
  Component,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
  ComponentFactory,
  OnDestroy
} from '@angular/core';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'ct-progress-bars';

  @ViewChild('progressbarcontainer', {read: ViewContainerRef, static: true}) progressBarContainer: ViewContainerRef;
  progressBarList: Array<any> = []; // List of added progress bar components.

  constructor(private componentResolver: ComponentFactoryResolver) { 

  }

  createProgressBar(): void {
    const factory: any = this.componentResolver.resolveComponentFactory(ProgressBarComponent);
    let componentRef: any = this.progressBarContainer.createComponent(factory);
    // If this is the first progress bar, or if all progress bars have already
    // completed loading, then begin loading this new one. (Otherwise, the 'loadComplete'
    // Promise subscription will trigger the loading.)
    if(this.progressBarList.length === 0 || this.shouldLoadNext()) {
      componentRef.instance.load();
      componentRef.instance.promise.then(() => {
          this.loadNext(componentRef);
        })
    } 
    this.progressBarList.push(componentRef);

  }

  loadNext(componentRef: any): void {
    // Subscribe to the 'loadComplete' Promise from the child ProgressBar component,
    // to be notified when progress bar is loaded.
    let componentIndex: number = this.progressBarList.indexOf(componentRef);
    if(componentIndex != -1 && componentIndex < this.progressBarList.length - 1) {
      let nextComponent = this.progressBarList[componentIndex + 1];
      nextComponent.instance.load();
      nextComponent.instance.promise.then(() => {
        this.loadNext(nextComponent);
      })
    }
  }

  // Check if we need to start the loading of a newly-added ProgressBar.
  shouldLoadNext(): boolean {
    // Are there any components that are currently loading?
    let loading: any = this.progressBarList.find((item) => {
      return !!(item.instance.loadingState === 'PENDING');
    });
    // Are there any existing components that haven't started loading yet?
    let loaded: any = this.progressBarList.find((item) => {
      return !(item.instance.promise);
    });
    return (!(loading) && !(loaded));
  }

  ngOnDestroy() {
    this.progressBarList.forEach((compRef: any) => {
      compRef.instance.destroy();
    })
  }

}
