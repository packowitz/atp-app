
import {Injectable} from "@angular/core";
@Injectable()
export class LoadingState {
  checkedVersion: boolean = false;
  loadedLocalStorage: boolean = false;
  loadedCountries: boolean = false;
  loadedUser: boolean = false;
  loadedMySurveys: boolean = false;
  loadedUnreadFeedback: boolean = false;
  loadedAnnouncements: boolean = false;
  loadedRewards: boolean = false;
  registeredNotifications: boolean = false;
}
