export interface SystemLog {
  id: string;
  ip: string;
  userAgent: string;
  traceIdentifier: string;
  resourceCode: string;
  controller: string;
  method: string;
  action: string;
  host: string;
  path: string;
  protocol: string;
  port: number;
  scheme: string;
  recordedOn: string;
  tenantId: string | null;
}
