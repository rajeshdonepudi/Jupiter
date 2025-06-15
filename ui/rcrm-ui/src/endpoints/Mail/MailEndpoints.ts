export default {
  getUserSentMails: "Mail/sent-mails",
  getUserReceivedMails: "Mail/received-mails",
  sendNewMail: "Mail/new-mail",
  getMailInfo: (mailId: string) => `Mail/view-mail?mailId=${mailId}`,
};
