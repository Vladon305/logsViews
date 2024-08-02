function generateUniqueId(): string {
  // Массив всех возможных символов
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // Пустая строка для накопления результата
  let result = "";

  // Выбор 16 символов случайным образом
  for (let i = 0; i < 16; i++) {
    // Получение случайного индекса символа
    const randomIndex = Math.floor(Math.random() * characters.length);

    // Добавление символа к результату
    result += characters[randomIndex];
  }

  return result;
}

interface SubscribeResponse {
  Action: number;
  Items: LogItem[];
}

interface LogItem {
  Timestamp: string;
  Level: "FATAL" | "ERROR" | "DEBUG" | "INFO" | "TRACE";
  Message: string;
  Source: string;
}

class LoggerService {
  private socket: WebSocket;
  private token: string | null;
  private logs: LogItem[];

  constructor() {
    this.socket = new WebSocket("ws://test.enter-systems.ru/");
    this.token = null; // Инициализируем токен как null до авторизации
    this.logs = [];
  }

  async connect(username: string, password: string): Promise<void> {
    await this.login(username, password);
    const result = await this.subscribeToLogs();
    console.log("success subscribe", result);
    setInterval(() => this.sendPing(), 30000); // Пинг каждые 30 секунд
    return result;
  }

  private async login(username: string, password: string): Promise<void> {
    const args = [username, password];
    const result = await this.call("http://enter.local/login", 2, ...args);
    this.token = result.Token;
    console.log("login success", result);
  }

  private async subscribeToLogs(): Promise<void> {
    const result = await this.call(
      "http://enter.local/subscription/logs/list",
      5
    );
    return result;
  }

  private sendPing(): void {
    this.socket.send(JSON.stringify([20, 0])); // Отправляем пинг без счетчика
  }

  private onMessage(callback: (data: any) => void): void {
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("data", data);
      callback(data);
      // if (data[0] === 3 && data[1] === callId) {
      //   resolve(data[2]);
      // } else if (data[0] === 4 && data[1] === callId) {
      //   reject(new Error(`Call failed: ${data[2]}`));
      // }
    };
  }

  private async call(
    uri: string,
    method: number,
    ...args: any[]
  ): Promise<any> {
    const callId = generateUniqueId();
    // this.socket.send(JSON.stringify([2, callId, uri, ...args]));
    this.send(JSON.stringify([method, callId, uri, ...args]));
  }
  private async callWithOnMessage(
    uri: string,
    method: number,
    onMessage: (data: any) => void,
    ...args: any[]
  ): Promise<any> {
    const callId = generateUniqueId();
    // this.socket.send(JSON.stringify([2, callId, uri, ...args]));
    this.send(JSON.stringify([method, callId, uri, ...args]));
    return new Promise((resolve, reject) => {
      this.onMessage((data) => {
        if (data[0] === 3 && data[1] === callId) {
          onMessage(data[2]);
          resolve(data[2]);
        } else if (data[0] === 4 && data[1] === callId) {
          reject(new Error(`Call failed: ${data[2]}`));
        }
      });
    });
  }
  private waitForConnection(callback: () => void, interval: number) {
    if (this.socket.readyState === 1) {
      callback();
    } else {
      setTimeout(() => {
        this.waitForConnection(callback, interval);
      }, interval);
    }
  }
  send(message: string, callback?: () => void) {
    this.waitForConnection(() => {
      this.socket.send(message);
      if (callback) {
        callback();
      }
    }, 1000);
  }
}
export default LoggerService;
