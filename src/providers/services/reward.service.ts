import {Injectable} from "@angular/core";
import {AtpHttp} from "./atpHttp.service";
import {Observable} from "rxjs";
import {Reward} from "../domain/reward";
import {Model} from "../../components/model.component";

@Injectable()
export class RewardService {

    constructor(public atpHttp: AtpHttp, public model: Model) {}

    getRewards(): Observable<Reward[]> {
        return this.atpHttp.doGetBackground("/app/reward/list");
    }

    claimReward(type: string) {
      this.atpHttp.doPost("/app/reward/claim/" + type, {}, "claiming reward").subscribe(
        data => {
          this.model.user = data.user;
          this.model.setRewards(data.rewards);
        }
      );
    }
}
