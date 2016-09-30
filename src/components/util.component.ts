export class Util {

  public static getTimeDiff(date: string) {
    let surveyStarted: number = new Date(Date.parse(date)).getTime();
    let diffInMin = Math.round((new Date().getTime() - surveyStarted) / 60000);
    if(diffInMin < 60) {
      return diffInMin + " min";
    }
    if(diffInMin < 1440) {
      return Math.round(diffInMin / 60) + " hours";
    }
    return Math.round(diffInMin / 1440) + " days";
  }

}