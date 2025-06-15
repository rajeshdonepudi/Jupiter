export interface GetMailRequest {
  email: string;
  password: string;
  mailBox: string;
}
export interface ReadEmailMessage extends GetMailRequest {
  messageId: number;
}

export interface EmailMessageItem {
  subject: string;
  body: string;
  messageId: number;
  isRead: boolean;
  from: string;
  attachments: string[];
  snippet: any;
}

export interface Email {
  body: string;
  bounceAddress: string;
  charset: string;
  debugLogFilePath: string;
  decrypted: boolean;
  emailDateStr: string;
  encryptedBy: string;
  fileDistList: string;
  from: string;
  fromAddress: string;
  fromName: string;
  header: string;
  language: string;
  lastErrorHtml: string;
  lastErrorText: string;
  lastErrorXml: string;
  lastMethodSuccess: boolean;
  localDateStr: string;
  mailer: string;
  numAlternatives: number;
  numAttachedMessages: number;
  numAttachments: number;
  numBcc: number;
  numCC: number;
  numDaysOld: number;
  numDigests: number;
  numHeaderFields: number;
  numRelatedItems: number;
  numReplacePatterns: number;
  numReports: number;
  numTo: number;
  oaepHash: string;
  oaepMgfHash: string;
  oaepPadding: boolean;
  overwriteExisting: boolean;
  pkcs7CryptAlg: string;
  pkcs7KeyLength: number;
  preferredCharset: string;
  prependHeaders: boolean;
  receivedEncrypted: boolean;
  receivedSigned: boolean;
  replyTo: string;
  returnReceipt: boolean;
  sendEncrypted: boolean;
  sender: string;
  sendSigned: boolean;
  signaturesValid: boolean;
  signedBy: string;
  signingAlg: string;
  signingHashAlg: string;
  size: number;
  subject: string;
  uidl: string;
  uncommonOptions: string;
  unpackUseRelPaths: boolean;
  verboseLogging: boolean;
}
