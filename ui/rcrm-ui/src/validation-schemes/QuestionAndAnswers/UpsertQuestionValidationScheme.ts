import { QuestionTypeEnum } from "@/enumerations/QuestionAndAnswers/QuestionTypes";
import * as yup from "yup";

const UpsertQuestionValidationScheme = () => {
  return yup.object({
    name: yup.string().required("Question is required"),
    type: yup
      .mixed<QuestionTypeEnum>()
      .oneOf(
        Object.values(QuestionTypeEnum as any),
        "Question type is required."
      )
      .required("Question type is required"),
  });
};

export default UpsertQuestionValidationScheme;
