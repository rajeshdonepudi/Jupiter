import AppPage from "@/components/ui-components/AppPage";
import { Button, IconButton, Stack, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AppModal from "@/components/ui-components/AppModal";
import { lazy, useCallback, useMemo, useRef, useState } from "react";
import AppDataGrid from "@/components/ui-components/AppDataGrid";
const EditOutlinedIcon = lazy(() => import("@mui/icons-material/EditOutlined"));
const DeleteOutlineOutlinedIcon = lazy(() => import("@mui/icons-material/DeleteOutlineOutlined"));

import {
    useGetAllQuestionBanksQuery,
    useUpsertQuestionBankMutation,
    useDeleteQuestionBankMutation,
    useGetQuestionBankQuery
} from "@/services/QuestionsAndAnswers/QuestionBankService";
import { FilterQuestionBanks } from "@/models/QuestionAndAnswer/FilterQuestionBankModel";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { QuestionBank } from "@/models/QuestionAndAnswer/QuestionBankModel";
import { AppModalState } from "@/models/Common/ModalState";
import { toast } from "react-toastify";
import ManageQuestionBankForm from "@/components/features/QuestionAndAnswers/ManageQuestionBankForm";

enum ActionType {
    None = 0,
    Add = 1,
    Edit = 2
}

const QuestionBankList = () => {
    const formikRef = useRef<any>(null);

    const [filterState, setFilterState] = useState<FilterQuestionBanks>({
        page: 1,
        pageSize: 10,
    });

    const { data: banksResponse, isFetching } = useGetAllQuestionBanksQuery(filterState);
    const [upsertQuestionBank, { isLoading: isUpserting }] = useUpsertQuestionBankMutation();
    const [deleteQuestionBank] = useDeleteQuestionBankMutation();

    // For editing, we might need to fetch details if not fully available in list
    // The list has QuestionCount but not details.
    // We'll fetch details when opening edit modal.
    const [editingId, setEditingId] = useState<string | null>(null);
    // We can skip this if we trigger refetch in the modal or just pass ID to form if form handles fetch.
    // But ManageQuestionBankForm takes initialValues.
    // Let's use useGetQuestionBankQuery with skip.

    const { data: bankDetails, isFetching: isFetchingDetails } = useGetQuestionBankQuery(editingId!, {
        skip: !editingId
    });

    // Effect to set form values when details arrive
    useMemo(() => {
        if (bankDetails?.data && editingId && formikRef.current) {
            formikRef.current.setValues(bankDetails.data);
        }
    }, [bankDetails, editingId]);


    const [modalState, setModalState] = useState<AppModalState>({
        visible: false,
        title: undefined,
        actionId: 0,
        data: undefined,
        okButtonText: undefined,
    });

    const handleEdit = (row: any) => {
        setEditingId(row.id);
        setModalState({
            visible: true,
            title: "Edit Question Bank",
            actionId: ActionType.Edit,
            okButtonText: "Save",
            data: {}
        });
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this Question Bank?")) {
            await deleteQuestionBank(id).unwrap();
            toast.success("Question Bank deleted successfully");
        }
    };

    const columns = useMemo(() => {
        const cols: GridColDef[] = [
            { field: "name", headerName: "Name", flex: 1 },
            { field: "description", headerName: "Description", flex: 1 },
            { field: "questionCount", headerName: "Questions", width: 100 },
            {
                field: "actions",
                headerName: "Actions",
                width: 120,
                sortable: false,
                renderCell: (params: GridRenderCellParams<any>) => (
                    <Stack direction="row" spacing={1}>
                        <Tooltip title="Edit">
                            <IconButton onClick={() => handleEdit(params.row)} size="small">
                                <EditOutlinedIcon color="primary" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton onClick={() => handleDelete(params.row.id)} size="small">
                                <DeleteOutlineOutlinedIcon color="error" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                ),
            },
        ];
        return cols;
    }, []);

    const handleCreate = () => {
        setEditingId(null);
        if (formikRef.current) formikRef.current.resetForm();

        setModalState({
            visible: true,
            title: "Create Question Bank",
            actionId: ActionType.Add,
            okButtonText: "Create",
            data: {}
        });
    };

    const handleClose = () => {
        setModalState(prev => ({ ...prev, visible: false }));
        setEditingId(null);
        formikRef.current?.resetForm();
    };

    const handleSubmit = async (values: QuestionBank) => {
        try {
            await upsertQuestionBank(values).unwrap();
            toast.success(`Question Bank ${values.id ? 'updated' : 'created'} successfully`);
            handleClose();
        } catch (error) {
            toast.error("Failed to save Question Bank");
        }
    };

    return (
        <>
            <AppPage
                title="Question Banks"
                content={
                    <AppDataGrid
                        records={banksResponse?.data.items ?? []}
                        columns={columns}
                        totalRecords={banksResponse?.data.totalItems ?? 0}
                        isFetching={isFetching}
                        paginationState={filterState}
                        setPaginationState={setFilterState}
                        setRowId={(row) => row.id}
                        columnsToHide={{ id: false }}
                        hasNextPage={banksResponse?.data.isNextPage ?? false}
                    />
                }
                rightHeaderActions={
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
                        Create Bank
                    </Button>
                }
            />

            <AppModal
                show={modalState.visible}
                modalTitle={modalState.title}
                okButtonText={modalState.okButtonText}
                handleClose={handleClose}
                handleOk={() => formikRef.current?.submitForm()}
                disableActions={isUpserting || isFetchingDetails}
                fullScreen
            >
                <ManageQuestionBankForm formikRef={formikRef} onSubmit={handleSubmit} />
            </AppModal>
        </>
    );
};

export default QuestionBankList;
