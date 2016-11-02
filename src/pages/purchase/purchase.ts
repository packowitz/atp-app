import {Component} from "@angular/core";
import {Model} from "../../components/model.component";
import {Achievement} from "../../components/domain/achievement.component";
import {AchievementService} from "../../providers/achievement.service";
import {SettingsPage} from "../settings/settings";
import {NavController} from "ionic-angular";

@Component({
  templateUrl: 'purchase.html'
})
export class PurchasePage {
  selection: string;


  constructor(public model: Model,
              public achievementService: AchievementService,
              public nav: NavController) {
    model.claimableAchievements > 0 ? this.selection = 'achievements' : 'shop';
  }

  claimAchievementReward(achievement: Achievement) {
    this.achievementService.claimReward(achievement.type);
  }

  openSettingsPage() {
    this.nav.push(SettingsPage);
  }
}
