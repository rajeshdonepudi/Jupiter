import { QuestionTypeEnum } from "@/enumerations/QuestionAndAnswers/QuestionTypes";

export interface Question {
  id: string | null;
  type: QuestionTypeEnum;
  name: string;
  questionTypeName?: string;
  resourceAlias?: string;
  options?: QuestionOption[];
}

export interface QuestionOption {
  name: string;
  value: string;
}
