export class Messages {
  public static tooFastMsg: Array<string> = [
    "Not too hasty, my friend!",
    "Take some time to choose!"
  ];
  public static getTooFastMsg(): string {
    return Messages.tooFastMsg[Math.floor(Math.random() * Messages.tooFastMsg.length)];
  }

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
}
