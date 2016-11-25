import {Answer} from "./answer";

export class Survey {
  id: number;
  status: string;
  title: string;
  group_id: number;
  pic1: string;
  pic1_id: number;
  pic2: string;
  pic2_id: number;
  minAge: number;
  maxAge: number;
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
