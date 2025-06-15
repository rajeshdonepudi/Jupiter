import * as signalR from "@microsoft/signalr";
import AuthUtilities from "./AuthUtilities";

const SocketUtilities = {
  getConnection: (endpoint: string) => {
    const refererUrl = window.location.href;
    return new signalR.HubConnectionBuilder()
      .withUrl(`${endpoint}?referer=${encodeURIComponent(refererUrl)}`, {
        transport: signalR.HttpTransportType.WebSockets,
        withCredentials: true,
        accessTokenFactory: () => `${AuthUtilities.getJWTToken() ?? ""}`,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();
  },
};

export default SocketUtilities;
