import { io, Socket } from "socket.io-client";

class WampService {
  private socket: Socket;

  constructor() {
    this.socket = io("ws://test.enter-systems.ru/");
    console.log("this.socket", this.socket);
  }

  // Метод для авторизации
  async login(username: string, password: string): Promise<string | null> {
    const callId = "a8FmfgEp38b1gMas"; // Пример ID вызова
    const args = [username, password];
    await this.socket.emit("call", [
      2,
      callId,
      "http://enter.local/login",
      ...args,
    ]);
    return new Promise((resolve, reject) => {
      this.socket.on(`call_result_${callId}`, (data) => {
        resolve(data.result);
      });
      setTimeout(() => reject(new Error("Timeout")), 5000); // Ожидание ответа
    });
  }

  // Метод для подписки на логи
  subscribeToLogs(): void {
    this.socket.emit("subscribe", [
      "http://enter.local/subscription/logs/list",
    ]);
  }

  // Метод для отправки WAMP-пинга
  sendHeartbeat(): void {
    this.socket.emit("heartbeat", [20, 0]);
  }
}

export default new WampService();
