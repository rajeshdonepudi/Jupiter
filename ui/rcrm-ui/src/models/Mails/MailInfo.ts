import { MailSenderInfo } from "@models/Mails/MailSenderInfo";
import { KeyValuePair } from "@models/Common/KeyValuePair";
import { RecipientInfo } from "./MailRecipientInfo";

export interface MailInfo {
  mailId: string;
  body: string;
  subject: string;
  senderInfo: MailSenderInfo;
  toRecipients: RecipientInfo[];
  bccRecipients: RecipientInfo[];
  ccRecipients: RecipientInfo[];
}
