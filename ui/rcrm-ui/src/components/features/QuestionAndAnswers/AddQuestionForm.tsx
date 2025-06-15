import { QuestionTypeEnum } from "@/enumerations/QuestionAndAnswers/QuestionTypes";
import { Question } from "@/models/QuestionAndAnswer/QuestionModel";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import QuestionTypes from "@/models/QuestionAndAnswer/QuestionTypesList";
import UpsertQuestionValidationScheme from "@/validation-schemes/QuestionAndAnswers/UpsertQuestionValidationScheme";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useImperativeHandle } from "react";
import AppConstants from "@/constants/constants";

const AddQuestionForm = (props: any) => {
  const formik = useFormik<Question>({
    initialValues: {
      id: null,
      name: "",
      type: QuestionTypeEnum.NotSelected,
      options: [],
    },
    validationSchema: UpsertQuestionValidationScheme(),
    onSubmit: (values: Question) => {
      props?.onSubmit(values);
    },
  });

  useImperativeHandle(props?.formikRef, () => {
    return {
      submitForm: formik.submitForm,
      resetForm: formik.resetForm,
      setValues: formik.setValues,
    };
  });

  const addOption = () => {
    formik.setFieldValue("options", [
      ...(formik.values.options ?? []),
      { name: "", value: "" },
    ]);
  };

  const updateOption = (index: number, field: string, value: string) => {
    const updatedOptions = [...(formik.values.options ?? [])] as any;
    updatedOptions[index][field] = value;
    formik.setFieldValue("options", updatedOptions);
  };

  const removeOption = (index: number) => {
    const updatedOptions = formik.values.options?.filter((_, i) => i !== index);
    formik.setFieldValue("options", updatedOptions);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={AppConstants.layout.StandardSpacing}>
        <Grid md={12}>
          <TextField
            fullWidth
            placeholder="Enter question here..."
            label="Question"
            id="Question"
            multiline
            rows={4}
            name="name"
            value={formik.values?.name}
            onChange={formik.handleChange}
            error={formik.touched?.name && Boolean(formik.errors.name)}
            helperText={formik.touched?.name && formik.errors.name}
          />
        </Grid>
        <Grid md={12}>
          <FormControl fullWidth>
            <InputLabel id="question-type-select-box">Question Type</InputLabel>
            <Select
              labelId="question-type-select-box"
              id="demo-simple-select"
              label="Question Type"
              name="type"
              value={formik.values?.type}
              onChange={formik.handleChange}
              error={formik.touched?.type && Boolean(formik.errors.type)}
            >
              {QuestionTypes.map((q) => (
                <MenuItem key={q.value} value={q.value}>
                  {q.displayText}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {(formik.values.type === QuestionTypeEnum.SingleSelectDropdown ||
          formik.values.type === QuestionTypeEnum.MultiSelectDropdown) && (
          <Grid md={12}>
            <Paper variant="outlined" sx={{ padding: "1rem" }}>
              <Stack gap={1}>
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Typography variant="h6">Options</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addOption}
                  >
                    Add Option
                  </Button>
                </Stack>
                {Array.from(formik?.values?.options ?? []).length > 0 ? (
                  formik.values.options?.map((option, index) => (
                    <Stack key={index} direction={"row"} gap={1}>
                      <TextField
                        fullWidth
                        id={`option-name-${index}`}
                        label="Name"
                        placeholder="Enter option name..."
                        variant="outlined"
                        value={option.name}
                        onChange={(e) =>
                          updateOption(index, "name", e.target.value)
                        }
                      />
                      <TextField
                        fullWidth
                        id={`option-value-${index}`}
                        placeholder="Enter value..."
                        label="Value"
                        variant="outlined"
                        value={option.value}
                        onChange={(e) =>
                          updateOption(index, "value", e.target.value)
                        }
                      />

                      <IconButton
                        aria-label="delete"
                        onClick={() => removeOption(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  ))
                ) : (
                  <Stack alignItems={"center"}>No options added.</Stack>
                )}
              </Stack>
            </Paper>
          </Grid>
        )}
      </Grid>
    </form>
  );
};

export default AddQuestionForm;
