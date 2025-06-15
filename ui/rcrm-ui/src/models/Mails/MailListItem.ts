import { MailSenderInfo } from "@models/Mails/MailSenderInfo";

export interface MailListItem {
  id: string;
  subject: string;
  body: string;
  senderInfo: MailSenderInfo;
}
