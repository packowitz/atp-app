import {Component, ViewChild} from "@angular/core";
import {Slides, NavController, MenuController} from "ionic-angular";
import {TabsPage} from "../tabs/tabsPage";
import {LocalStorage} from "../../providers/services/localStorage.service";

@Component({
  templateUrl: 'welcomeTour.component.html'
})
export class WelcomeTourComponent {
  @ViewChild('welcomeSlider') welcomeSlider: Slides;
  deviceHeight: number = 100;

  constructor(public nav: NavController,
              public menu: MenuController,
              public localStorage: LocalStorage) {
    this.deviceHeight = window.innerHeight;
    this.menu.swipeEnable(false);
  }

  close() {
    this.localStorage.hintSettings.seenWelcomeHint = true;
    this.localStorage.saveHintSettings();
    this.nav.setRoot(TabsPage);
  }

  previousWelcomeSlide() {
    this.welcomeSlider.slidePrev();
  }

  nextWelcomeSlide() {
    this.welcomeSlider.slideNext();
  }
}
