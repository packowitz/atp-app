import {Answer} from "./answer";

export class Survey {
  id: number;
  status: string;
  title: string;
  groupId: number;
  multiPicture: boolean;
  pic1: string;
  pic1_id: number;
  pic2: string;
  pic2_id: number;
  minAge: number;
  maxAge: number;
  age_1: boolean;
  age_2: boolean;
  age_3: boolean;
  age_4: boolean;
  age_5: boolean;
  age_6: boolean;
  age_7: boolean;
  age_8: boolean;
  age_9: boolean;
  countries: string;
  male: boolean;
  female: boolean;
  answered: number;
  noOpinionCount: number;
  pic1Count: number;
  pic2Count: number;
  abuseCount: number;
  startedDate: string;

  answers: Answer[];
}
