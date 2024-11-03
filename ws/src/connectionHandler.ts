import { WebSocket } from "ws";
import GameManager from "./gameManager";
import { sendError } from "./utils";
import { createGame } from "./createGame";
import { verifyToken } from "./verify";

export function handleConnection(ws: WebSocket) {
  const gameManager = GameManager.getInstance();
  gameManager.addClient(ws);

  ws.on("message", async  (raw: Buffer) => { //raw- message
    try {
      const { data } = JSON.parse(raw.toString());
      const token = data?.token;
      if(!token){
        sendError(ws, `Token not found`);
        ws.close;
        return;
      }
      const authroized = await verifyToken(ws, token)
      if(!authroized){
        sendError(ws, `Unauthorized`);
        ws.close();  
        return;
      }
      handleMessage(ws, raw.toString());
    } catch (error) {
      sendError(ws, "Failed to process message");
    }
  });

  ws.on("close", () => {
    gameManager.removeClient(ws);
  });
}

function handleMessage(ws: WebSocket, message: string) {
  const gameManager = GameManager.getInstance();
  const { type, data } = JSON.parse(message);

  switch (type) {
    case "create-game":
      const newGame = createGame(data);
      gameManager.addGame(newGame);
      break;
    case "place-bid":
      gameManager.updateGame(data.id, data);
      break;
    default:
      sendError(ws, `Unknown message type: ${type}`);
  }
}

