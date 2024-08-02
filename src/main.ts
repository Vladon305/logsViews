import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import LoggerService from "./app/LoggerService";

async function authenticateAndSubscribe() {
  try {
    // const token = await WampService.login("enter", "A505a");
    const service = new LoggerService();
    service.connect("enter", "A505a");
    console.log("Authenticated with token:", service);

    // setInterval(() => console.log("service", service), 4000); // Пинг каждые 30 секунд
    // WampService.subscribeToLogs();

    // setInterval(WampService.sendHeartbeat, 30000); // Периодический WAMP-пинг
  } catch (error: any) {
    console.error("Authentication failed:", error.message);
  }
}

createApp(App).mount("#app");
authenticateAndSubscribe();
