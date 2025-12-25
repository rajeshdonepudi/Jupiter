import { Question } from "@/models/QuestionAndAnswer/QuestionModel";
import { QuestionBank } from "@/models/QuestionAndAnswer/QuestionBankModel";
import { useGetAllQuestionsQuery } from "@/services/QuestionsAndAnswers/QuestionService";
import {
    Box,
    Button,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useImperativeHandle, useMemo, useState } from "react";
import * as Yup from "yup";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AppConstants from "@/constants/constants";

const ManageQuestionBankForm = (props: any) => {
    const { data: questionsResponse } = useGetAllQuestionsQuery({
        page: 1,
        pageSize: 1000,
    });

    const allQuestions = useMemo(() => questionsResponse?.data.items ?? [], [questionsResponse]);

    const [selectedQuestionToAdd, setSelectedQuestionToAdd] = useState<string>("");

    const formik = useFormik<QuestionBank>({
        initialValues: {
            id: undefined,
            name: "",
            description: "",
            questions: [],
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required"),
            description: Yup.string().optional(),
        }),
        onSubmit: (values) => {
            props?.onSubmit(values);
        },
    });

    useImperativeHandle(props?.formikRef, () => ({
        submitForm: formik.submitForm,
        resetForm: formik.resetForm,
        setValues: formik.setValues,
    }));

    const handleAddQuestion = () => {
        if (!selectedQuestionToAdd) return;
        const question = allQuestions.find((q) => q.id === selectedQuestionToAdd);
        if (!question) return;

        if (formik.values.questions.some((q) => q.questionId === question.id)) return;

        const newQuestions = [
            ...formik.values.questions,
            {
                questionId: question.id!,
                questionName: question.name,
                order: formik.values.questions.length,
            },
        ];
        formik.setFieldValue("questions", newQuestions);
        setSelectedQuestionToAdd("");
    };

    const removeQuestion = (index: number) => {
        const newQuestions = formik.values.questions.filter((_, i) => i !== index);
        // Reorder
        const reordered = newQuestions.map((q, i) => ({ ...q, order: i }));
        formik.setFieldValue("questions", reordered);
    };

    const moveQuestion = (index: number, direction: "up" | "down") => {
        if (direction === "up" && index === 0) return;
        if (direction === "down" && index === formik.values.questions.length - 1) return;

        const newQuestions = [...formik.values.questions];
        const targetIndex = direction === "up" ? index - 1 : index + 1;

        [newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]];

        // Update orders
        const reordered = newQuestions.map((q, i) => ({ ...q, order: i }));
        formik.setFieldValue("questions", reordered);
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={AppConstants.layout.StandardSpacing}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Question Bank Name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        multiline
                        rows={2}
                        value={formik.values.description}
                        onChange={formik.handleChange}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Questions
                        </Typography>

                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel>Select Question to Add</InputLabel>
                                <Select
                                    label="Select Question to Add"
                                    value={selectedQuestionToAdd}
                                    onChange={(e) => setSelectedQuestionToAdd(e.target.value)}
                                >
                                    {allQuestions
                                        .filter(q => !formik.values.questions.some(bq => bq.questionId === q.id))
                                        .map((q) => (
                                            <MenuItem key={q.id} value={q.id ?? ""}>
                                                {q.name} ({q.questionTypeName})
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                            <Button variant="contained" onClick={handleAddQuestion} disabled={!selectedQuestionToAdd}>
                                Add
                            </Button>
                        </Stack>

                        <List>
                            {formik.values.questions.map((q, index) => (
                                <ListItem key={q.questionId} divider>
                                    <ListItemText primary={q.questionName} secondary={`Order: ${index + 1}`} />
                                    <ListItemSecondaryAction>
                                        <IconButton size="small" onClick={() => moveQuestion(index, "up")} disabled={index === 0}>
                                            <ArrowUpwardIcon />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => moveQuestion(index, "down")} disabled={index === formik.values.questions.length - 1}>
                                            <ArrowDownwardIcon />
                                        </IconButton>
                                        <IconButton edge="end" aria-label="delete" onClick={() => removeQuestion(index)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                            {formik.values.questions.length === 0 && (
                                <Typography variant="body2" color="textSecondary" align="center">
                                    No questions added yet.
                                </Typography>
                            )}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </form>
    );
};

export default ManageQuestionBankForm;
