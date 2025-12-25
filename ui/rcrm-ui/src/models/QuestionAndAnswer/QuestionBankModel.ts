export interface QuestionBankQuestion {
    questionId: string;
    questionName: string;
    order: number;
}

export interface QuestionBank {
    id?: string;
    name: string;
    description?: string;
    questions: QuestionBankQuestion[];
    isNew?: boolean;
    questionCount?: number;
}
