import { QuestionTypeEnum } from "@/enumerations/QuestionAndAnswers/QuestionTypes";

interface QuestionType {
  displayText: string;
  value: QuestionTypeEnum;
}

const QuestionTypes: QuestionType[] = [
  {
    displayText: "-- Select question type --",
    value: QuestionTypeEnum.NotSelected,
  },
  {
    displayText: "Textarea",
    value: QuestionTypeEnum.TextArea,
  },
  {
    displayText: "Textbox",
    value: QuestionTypeEnum.TextBox,
  },
  {
    displayText: "Yes or No",
    value: QuestionTypeEnum.Checkbox,
  },
  {
    displayText: "Select box",
    value: QuestionTypeEnum.SingleSelectDropdown,
  },
  {
    displayText: "Multi select box",
    value: QuestionTypeEnum.MultiSelectDropdown,
  },
];

export default QuestionTypes;
