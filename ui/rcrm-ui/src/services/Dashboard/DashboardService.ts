import EnvUtilities from "@/utilities/EnvUtilities";
import * as signalR from "@microsoft/signalr";

class DashboardService {
  public hubConnection: signalR.HubConnection;
  public hubConnection2: signalR.HubConnection;

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${EnvUtilities.GetApiRootURL("user-dashboard")}`, {
        transport: signalR.HttpTransportType.WebSockets,
        withCredentials: true, // Include credentials
      }) // Replace with your API URL
      .build();

    this.hubConnection2 = new signalR.HubConnectionBuilder()
      .withUrl(`${EnvUtilities.GetApiRootURL("test-hub")}`, {
        transport: signalR.HttpTransportType.WebSockets,
        withCredentials: true, // Include credentials
      }) // Replace with your API URL
      .build();

    this.hubConnection
      .start()
      .catch((err) => console.error("SignalR Connection Error: ", err));

    this.hubConnection2
      .start()
      .catch((err) => console.error("SignalR Connection Error: ", err));
  }

  public getConnection = (endpoint: string) => {
    return new signalR.HubConnectionBuilder()
      .withUrl(endpoint, {
        transport: signalR.HttpTransportType.WebSockets,
        withCredentials: true,
      })
      .build();
  };

  public onReceiveMessage(callback: (count: number) => void) {
    this.hubConnection.on("GET_USER_COUNT", callback);
  }

  public onUserJoined(callback: (message: string) => void) {
    this.hubConnection.on("USER_JOINED", callback);
  }

  public onTest(callback: (message: string) => void) {
    this.hubConnection2.on("TestHub", callback);
  }

  public sendMessage = (message: string) => {
    this.hubConnection.send("ReceiveMessage", message);
  };
}

export default new DashboardService();
