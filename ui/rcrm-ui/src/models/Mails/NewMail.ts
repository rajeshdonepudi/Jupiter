export interface NewMail {
  senderId: string;
  subject: string;
  body: string;
  toRecipients: string[];
  ccRecipients: string[];
  bccRecipients: string[];
}
