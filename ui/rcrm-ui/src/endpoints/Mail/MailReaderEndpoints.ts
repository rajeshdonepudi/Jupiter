export default {
  getMailMessage: "MailReader/read",
  getMailMessages: "MailReader/all/read",
  readEmailMessage: `MailReader/read-message`,
  downloadAttachment: (payload: any) =>
    `MailReader/download-attachment?attachmentId=${payload.attachmentId}&name=${payload.name}`,
};
