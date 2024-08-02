import { ref, onMounted } from "vue";
import LoggerService from "../app/LoggerService";

export const useLogger = () => {
  const logs = ref([]);

  try {
    // const token = await WampService.login("enter", "A505a");
    const service = new LoggerService();
    const res = service.connect("enter", "A505a");
    console.log("Authenticated with token:", service);

    setInterval(() => service, 4000); // Пинг каждые 30 секунд
    // WampService.subscribeToLogs();

    // setInterval(WampService.sendHeartbeat, 30000); // Периодический WAMP-пинг
  } catch (error: any) {
    console.error("Authentication failed:", error.message);
  }
};
