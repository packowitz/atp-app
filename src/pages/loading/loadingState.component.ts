
import {Injectable} from "@angular/core";
@Injectable()
export class LoadingState {
  checkedVersion: boolean = false;
  loadedLocalStorage: boolean = false;
  loadedCountries: boolean = false;
  loadedUser: boolean = false;
  loadedMySurveyIds: boolean = false;
  loadedMySurveys: boolean = false;
  loadedUnreadFeedback: boolean = false;
  loadedAnnouncements: boolean = false;
  loadedRewards: boolean = false;
  loadedInAppProducts: boolean = false;
  configureFirebase: boolean = false;

  numberOfSteps = 11;

  reset() {
    this.checkedVersion = false;
    this.loadedLocalStorage = false;
    this.loadedCountries = false;
    this.loadedUser = false;
    this.loadedMySurveyIds = false;
    this.loadedMySurveys = false;
    this.loadedUnreadFeedback = false;
    this.loadedAnnouncements = false;
    this.loadedRewards = false;
    this.loadedInAppProducts = false;
    this.configureFirebase = false;
  }
}
