export class Messages {
  public static answeredMsg: Array<string> = [
    "Thank you for your answer",
    "Good choice, mate",
    "Cheers",
    "The next one will be harder!",
    "Thanks, every voice counts",
    "So Long, and Thanks for All the Fish",
    "The right answer would have been 42",
    "That was easy",
    "Awesome job",
    "Hasta la vista, Baby",
    "Keen choice"
  ];
  public static getAnsweredMsg(): string {
    return Messages.answeredMsg[Math.floor(Math.random() * Messages.answeredMsg.length)];
  }

  public static startAtpExampleMsg: Array<string> = [
    "haircut",
    "best looking",
    "color",
    "shape",
    "tastes better?",
    "funnier"
  ];
  public static getStartAtpExampleMsg(): string {
    return Messages.startAtpExampleMsg[Math.floor(Math.random() * Messages.startAtpExampleMsg.length)];
  }

  public static startupMsg: Array<string> = [
    "\"I don't know\" is a valid answer and you earn pax with that",
    "Log in daily and get a free 50 pax reward",
    "If you see an ATP with illegal content, please report that to us",
    "Weekly Highscore resets every Monday morning at 0:00 UTC",
    "Ask the People is still in beta. Please provide feedback",
    "You can create an ATP that compares up to 5 pictures",
    "If you create an ATP with more than 2 pictures it will lead to one ATP per combination",
    "Have you used the magnifying glass on the answer ATP page to enlarge the pictures again?",
    "We do not share your data with any 3rd party company",
    "ATP is completely anonymous",
    "ATP doesn't ask for more permissions than required",
    "Your data belongs to you",
    "Answer every ATP seriously. We keep track of your reliability"
  ];
  public static getStartupMsg(): string {
    return Messages.startupMsg[Math.floor(Math.random() * Messages.startupMsg.length)];
  }
}
