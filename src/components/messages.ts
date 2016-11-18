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
}
