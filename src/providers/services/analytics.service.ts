declare var FirebasePlugin: any;

export class Analytics {

  public static enterPage(name: string) {
    if(typeof FirebasePlugin != 'undefined') {
      FirebasePlugin.setScreenName(name);
    }
  }

  public static event(name: string, event: any) {
    if(typeof FirebasePlugin != 'undefined') {
      FirebasePlugin.logEvent(name, event);
    }
  }

}
