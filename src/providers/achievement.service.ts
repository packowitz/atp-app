import {Injectable} from "@angular/core";
import {AtpHttp} from "./atpHttp.service";
import {Observable} from "rxjs";
import {Achievement} from "../components/domain/achievement.component";
import {Model} from "../components/model.component";

@Injectable()
export class AchievementService {

    constructor(public atpHttp: AtpHttp, public model: Model) {}

    getAchievements(): Observable<Achievement[]> {
        return this.atpHttp.doGetBackground("/app/achievement/list");
    }

    claimReward(type: string) {
      this.atpHttp.doPost("/app/achievement/claim/" + type, {}, "claiming reward").subscribe(
        data => {
          this.model.user = data.user;
          this.model.setAchievements(data.achievements);
        }
      );
    }
}
