import { toast } from "react-toastify";

export class ToastService {
  static showMessage(message: string) {
    toast(message);
  }
}
