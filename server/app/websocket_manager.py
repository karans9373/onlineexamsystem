from collections import defaultdict

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.rooms: dict[str, list[WebSocket]] = defaultdict(list)

    async def connect(self, room: str, websocket: WebSocket):
        await websocket.accept()
        self.rooms[room].append(websocket)

    def disconnect(self, room: str, websocket: WebSocket):
        if websocket in self.rooms.get(room, []):
            self.rooms[room].remove(websocket)

    async def broadcast(self, room: str, payload: dict):
        stale = []
        for socket in self.rooms.get(room, []):
            try:
                await socket.send_json(payload)
            except Exception:
                stale.append(socket)
        for socket in stale:
            self.disconnect(room, socket)


manager = ConnectionManager()
