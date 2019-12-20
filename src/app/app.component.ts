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
  progressBarList: Array<any> = [];

  constructor(private componentResolver: ComponentFactoryResolver) { 

  }

  createProgressBar(): void {
    const factory: any = this.componentResolver.resolveComponentFactory(ProgressBarComponent);
    let componentRef: any = this.progressBarContainer.createComponent(factory);
    // Subscribe to the 'loadComplete event, to be notified when progress bar is loaded.
    componentRef.instance.loadComplete.subscribe((data) => {
      let componentIndex: number = this.progressBarList.indexOf(componentRef);
      if(componentIndex < this.progressBarList.length - 1) {
        let nextComponent = this.progressBarList[componentIndex + 1];
        nextComponent.instance.load();
      }
    });
    // If this is the first progress bar, or if all probress bars have already
    // completed loading, then begin loading this new one.
    if(this.progressBarList.length === 0 || this.shouldLoadNext()) {
      componentRef.instance.load();
    } 
    this.progressBarList.push(componentRef);

  }

  shouldLoadNext(): boolean {
    let loading: any = this.progressBarList.find((item) => {
      return !!(item.instance.isLoading);
    });
    let loaded: any = this.progressBarList.find((item) => {
      return !(item.instance.isLoaded);
    });
    return (!(loading) && !(loaded));
  }

  ngOnDestroy() {
    this.progressBarList.forEach((compRef: any) => {
      compRef.instance.destroy();
    })
  }

}
