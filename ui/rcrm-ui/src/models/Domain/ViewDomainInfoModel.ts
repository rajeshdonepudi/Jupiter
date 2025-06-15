export interface DomainWhois {
  domain: string;
  domainId: string;
  status: string;
  createDate: string;
  updateDate: string;
  expireDate: string;
  domainAge: number;
  whoisServer: string;
  registrar: Registrar;
  registrant: Contact;
  admin: Contact;
  tech: Contact;
  billing: Billing;
  nameservers: string[];
}

export interface Registrar {
  ianaId: string;
  name: string;
  url: string;
}

export interface Contact {
  name: string;
  organization: string;
  streetAddress: string;
  city: string;
  region: string;
  zipCode: string;
  country: string;
  phone: string;
  fax: string;
  email: string;
}

export interface Billing {
  name: string;
  organization: string;
  streetAddress: string;
  city: string;
  region: string;
  zipCode: string;
  country: string;
  phone: string;
  fax: string;
  email: string;
}

export interface GetDomainInfo {
  domainName: string;
}
