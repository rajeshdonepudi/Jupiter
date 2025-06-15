import QuestionRender from "@/components/features/QuestionAndAnswers/QuestionRender";
import { QuestionTypeEnum } from "@/enumerations/QuestionAndAnswers/QuestionTypes";
import { Question } from "@/models/QuestionAndAnswer/QuestionModel";
import { Button } from "@mui/material";
import { Formik } from "formik";

const questions: Question[] = [
  { id: "q1", name: "What is your name?", type: QuestionTypeEnum.TextBox },
  { id: "q2", name: "Tell us about yourself", type: QuestionTypeEnum.TextArea },
  { id: "q3", name: "Do you agree?", type: QuestionTypeEnum.Checkbox },
  {
    id: "q4",
    name: "Choose one",
    type: QuestionTypeEnum.RadioGroup,
    options: [
      { value: "option1", name: "Option 1" },
      { value: "option2", name: "Option 2" },
    ],
  },
  {
    id: "q5",
    name: "Checkbox list",
    type: QuestionTypeEnum.CheckboxList,
    options: [
      { value: "option1", name: "Option 1" },
      { value: "option2", name: "Option 2" },
    ],
  },
];

const initialValues = questions.reduce(
  (acc, question) => {
    switch (question.type) {
      case QuestionTypeEnum.TextBox:
      case QuestionTypeEnum.TextArea:
      case QuestionTypeEnum.RadioGroup:
        acc[String(question.id)] = ""; // Default to an empty string
        break;
      case QuestionTypeEnum.Checkbox:
        acc[String(question.id)] = false; // Default to false for a single checkbox
        break;
      case QuestionTypeEnum.CheckboxList:
        acc[String(question.id)] = []; // Default to no selection for radio group
        break;
      default:
        acc[String(question.id)] = null; // Handle unsupported types
    }
    return acc;
  },
  {} as Record<string, any>
);

const Test2 = () => (
  <Formik
    initialValues={initialValues}
    onSubmit={(values) => console.log(values)}
  >
    {(formProps) => (
      <form onSubmit={formProps.handleSubmit}>
        <QuestionRender questions={questions} formProps={formProps as any} />
        <Button type="submit">Submit</Button>
      </form>
    )}
  </Formik>
);

export default Test2;
