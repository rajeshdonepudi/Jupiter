import { AppModalState } from "@/models/Common/ModalState";

export function getInitialPageActionsState(): AppModalState {
  return {
    visible: false,
    title: undefined,
    actionId: 0,
    data: undefined,
    okButtonText: undefined,
  };
}
