import {Answer} from "./answer.component";

export class Survey {
  id: number;
  status: string;
  title: string;
  pic1: string;
  pic2: string;
  minAge: number;
  maxAge: number;
  country: string;
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