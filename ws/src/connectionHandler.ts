import { WebSocket } from "ws";
import GameManager from "./gameManager";
import { sendError } from "./utils";
import { createGame } from "./createGame";

export function handleConnection(ws: WebSocket) {
  const gameManager = GameManager.getInstance();
  gameManager.addClient(ws);

  ws.on("message", (raw: Buffer) => { //raw- message
    try {
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

