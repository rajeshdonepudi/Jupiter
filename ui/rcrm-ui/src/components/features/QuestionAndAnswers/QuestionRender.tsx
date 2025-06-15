import { QuestionTypeEnum } from "@/enumerations/QuestionAndAnswers/QuestionTypes";
import { Question } from "@/models/QuestionAndAnswer/QuestionModel";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Stack,
  FormGroup,
} from "@mui/material";
import { FormikProps } from "formik";
import { FC } from "react";

interface QuestionRenderProps {
  questions: Question[];
  formProps: FormikProps<Record<string, any>>;
}

const QuestionRender: FC<QuestionRenderProps> = ({ questions, formProps }) => {
  const getFormComponent = (question: Question) => {
    switch (question.type) {
      case QuestionTypeEnum.TextArea:
        return (
          <TextField
            key={question.id}
            id={String(question.id)}
            label={question.name}
            variant="outlined"
            multiline
            rows={4}
            value={formProps.values[String(question.id)] || ""}
            onChange={formProps.handleChange}
            onBlur={formProps.handleBlur}
          />
        );
      case QuestionTypeEnum.TextBox:
        return (
          <TextField
            key={question.id}
            id={String(question.id)}
            label={question.name}
            variant="outlined"
            value={formProps.values[String(question.id)] || ""}
            onChange={formProps.handleChange}
            onBlur={formProps.handleBlur}
          />
        );
      case QuestionTypeEnum.Checkbox:
        return (
          <FormControlLabel
            key={question.id}
            control={
              <Checkbox
                id={String(question.id)}
                checked={
                  (formProps.values[String(question.id)] ?? false) || false
                }
                onChange={formProps.handleChange}
                onBlur={formProps.handleBlur}
              />
            }
            label={question.name}
          />
        );
      case QuestionTypeEnum.CheckboxList:
        return (
          <FormControl component="fieldset" variant="standard">
            <FormLabel component="legend">{question.name}</FormLabel>
            <FormGroup>
              {question.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      id={`${question.id}-${option.value}`}
                      checked={formProps.values[String(question.id)]?.includes(
                        option.value
                      )}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const valueArray =
                          formProps.values[String(question.id)] || [];
                        const newValue = checked
                          ? [...valueArray, option.value]
                          : valueArray.filter((v: any) => v !== option.value);
                        formProps.setFieldValue(String(question.id), newValue);
                      }}
                      onBlur={formProps.handleBlur}
                    />
                  }
                  label={option.name}
                />
              ))}
            </FormGroup>
          </FormControl>
        );
      case QuestionTypeEnum.RadioGroup:
        return (
          <FormControl component="fieldset" variant="standard">
            <FormLabel component="legend">{question.name}</FormLabel>
            <RadioGroup
              value={formProps.values[String(question.id)] || ""}
              onChange={(e) => {
                const selectedValue = e.target.value;
                formProps.setFieldValue(String(question.id), selectedValue);
              }}
              onBlur={formProps.handleBlur}
            >
              {question.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio id={`${question.id}-${option.value}`} />}
                  label={option.name}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );

      // Add additional cases for other question types here
      default:
        return <div key={question.id}>Unsupported question type</div>;
    }
  };

  return <Stack gap={2}>{questions.map((q) => getFormComponent(q))}</Stack>;
};

export default QuestionRender;
