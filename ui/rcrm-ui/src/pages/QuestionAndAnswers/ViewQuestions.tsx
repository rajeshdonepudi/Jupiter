import AppPage from "@/components/ui-components/AppPage";
import { Button, IconButton, Stack, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AppModal from "@/components/ui-components/AppModal";
import { lazy, useCallback, useMemo, useRef, useState } from "react";
import AddQuestionForm from "@/components/features/QuestionAndAnswers/AddQuestionForm";
import AppDataGrid from "@/components/ui-components/AppDataGrid";
const ArrowForwardIcon = lazy(() => import("@mui/icons-material/ArrowForward"));
const EditOutlinedIcon = lazy(() => import("@mui/icons-material/EditOutlined"));
const DeleteOutlineOutlinedIcon = lazy(
  () => import("@mui/icons-material/DeleteOutlineOutlined")
);
import {
  useGetAllQuestionsQuery,
  useUpsertQuestionMutation,
  useDeleteQuestionMutation,
} from "@/services/QuestionsAndAnswers/QuestionService";
import { FilterQuestions } from "@/models/QuestionAndAnswer/FilterQuestionModel";
import {
  GridCallbackDetails,
  GridColDef,
  GridRenderCellParams,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { Question } from "@/models/QuestionAndAnswer/QuestionModel";
import { AppModalState } from "@/models/Common/ModalState";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import NavUtilities from "@/utilities/NavUtilities";
import { useNavigate } from "react-router-dom";

enum QuestionActionsEnum {
  NotSpecified = 0,
  AddQuestion = 1,
  UpdateQuestion = 2,
  DeleteQuestion = 3,
}
const ViewQuestions = () => {
  const formikRef = useRef<any>(null);
  const { t: commonLocale } = useTranslation();
  const navigate = useNavigate();

  const [questionFilterState, setQuestionFilterState] =
    useState<FilterQuestions>({
      page: 0,
      pageSize: 10,
    });

  const { data: questionsResponse, isFetching } =
    useGetAllQuestionsQuery(questionFilterState);

  const [upsertQuestion, { isLoading }] = useUpsertQuestionMutation();

  const onEditQuestionClicked = useCallback((rowData: Question) => {
    setPageActionsState({
      actionId: QuestionActionsEnum.UpdateQuestion,
      title: "Edit Question",
      data: rowData,
      visible: true,
      okButtonText: commonLocale("save"),
    });
    setTimeout(() => {
      if (formikRef.current) {
        formikRef.current.setValues(rowData);
      }
    }, 100);
  }, [commonLocale]);

  const onDeleteQuestionClicked = useCallback((rowData: Question) => {
    setPageActionsState({
      actionId: QuestionActionsEnum.DeleteQuestion,
      title: "Delete Question",
      data: rowData,
      visible: true,
      okButtonText: commonLocale("delete"),
    });
  }, [commonLocale]);

  // ... (columns definition remains same, but using these callbacks)

  // ... (questionsList memo remains same)

  // Remove unused selectedAction state if not needed, or keep for batch actions.

  // ... (onQuestionSelected remains)

  const [pageActionsState, setPageActionsState] = useState<AppModalState>({
    visible: false,
    title: undefined,
    actionId: 0,
    data: undefined,
    okButtonText: undefined,
  });

  const [deleteQuestion, { isLoading: isDeleting }] = useDeleteQuestionMutation();

  const handleModalClose = () => {
    formikRef?.current?.resetForm();
    setPageActionsState((prev: AppModalState) => ({
      ...prev,
      visible: false,
      data: {},
      title: undefined,
      okButtonText: undefined,
      actionId: 0,
    }));
  };

  const showMessage = (msg: string) => {
    toast.success(msg);
  };

  const onClickAddQuestion = () => {
    setPageActionsState({
      actionId: QuestionActionsEnum.AddQuestion,
      title: `Add Question`,
      data: {},
      visible: true,
      okButtonText: commonLocale("add"),
    });
  };

  const handleOk = async () => {
    switch (pageActionsState.actionId) {
      case QuestionActionsEnum.AddQuestion:
      case QuestionActionsEnum.UpdateQuestion:
        formikRef?.current?.submitForm();
        break;
      case QuestionActionsEnum.DeleteQuestion:
        if (pageActionsState.data?.id) {
          try {
            await deleteQuestion(pageActionsState.data.id).unwrap();
            showMessage("Question deleted successfully");
            handleModalClose();
          } catch (e) {
            toast.error("Failed to delete question");
          }
        }
        break;
    }
  };

  const handleSubmit = (values: Question) => {
    upsertQuestion(values)
      .unwrap()
      .then(() => {
        showMessage(values.id ? "Question updated successfully" : "Question added successfully");
        handleModalClose();
      })
      .catch((err) => {
        toast.error("Failed to save question");
      });
  };

  const columns = useMemo(() => {
    const columns: GridColDef[] = [
      {
        field: "name",
        headerName: "Question",
        type: "string",
        editable: false,
        width: 800,
      },
      {
        field: "questionTypeName",
        headerName: "Question Type",
        type: "string",
        editable: false,
        width: 160,
      },
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        width: 160,
        renderCell: (params: GridRenderCellParams<any>) => {
          return (
            <Stack
              style={{ height: "100%" }}
              justifyContent="start"
              flexDirection="row"
              rowGap={1}
            >
              <Tooltip title="View more">
                <IconButton
                  onClick={() =>
                    navigate(
                      NavUtilities.ToSecureArea(
                        `users/view?resourceId=${params.row.resourceAlias}`
                      )
                    )
                  }
                  aria-label="Example"
                >
                  <ArrowForwardIcon sx={{ color: "darkgreen" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Question">
                <IconButton
                  onClick={() => {
                    onEditQuestionClicked(params.row);
                  }}
                  aria-label="Example"
                >
                  <EditOutlinedIcon sx={{ color: "darkblue" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Question">
                <IconButton
                  onClick={() =>
                    onDeleteQuestionClicked(params.row)
                  }
                  aria-label="Example"
                >
                  <DeleteOutlineOutlinedIcon sx={{ color: "darkred" }} />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        },
      },
    ];
    return columns;
  }, []);

  const questionsList = useMemo(() => {
    return questionsResponse?.data.items ?? [];
  }, [questionsResponse]);

  const [selectedAction, setSelectedAction] = useState<{
    questions: string[];
    action: QuestionActionsEnum;
    popup: {
      visible: boolean;
      title: string;
      okButtonText: string;
      message: string;
    };
  }>({
    questions: [],
    action: QuestionActionsEnum.NotSpecified,
    popup: {
      visible: false,
      title: "",
      okButtonText: "",
      message: "",
    },
  });

  const onQuestionSelected = (
    model: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {
    setSelectedAction((prev) => {
      return {
        ...prev,
        questions: model as string[],
      };
    });
  };









  return (
    <>
      <AppPage
        title={"Questions"}
        content={
          <>
            <AppDataGrid
              columnsToHide={{
                id: false,
              }}
              records={questionsList}
              columns={columns}
              totalRecords={questionsResponse?.data.totalItems ?? 0}
              isFetching={isFetching}
              paginationState={questionFilterState}
              setPaginationState={setQuestionFilterState}
              setRowId={(row) => row.id}
              disableRowSelectionOnClick={true}
              selectedRows={selectedAction.questions}
              onRowSelectionModelChange={onQuestionSelected}
              hasNextPage={questionsResponse?.data?.isNextPage ?? false}
            />
          </>
        }
        rightHeaderActions={
          <>
            <Button
              onClick={onClickAddQuestion}
              variant="contained"
              startIcon={<AddIcon />}
            >
              Add Question
            </Button>
          </>
        }
      />
      <AppModal
        modalTitle={pageActionsState.title}
        show={pageActionsState.visible}
        okButtonText={pageActionsState.okButtonText}
        handleOk={handleOk}
        fullScreen
        handleClose={handleModalClose}
        disableActions={isLoading}
      >
        <AddQuestionForm formikRef={formikRef} onSubmit={handleSubmit} />
      </AppModal>
    </>
  );
};

export default ViewQuestions;
