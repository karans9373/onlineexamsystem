from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from ..websocket_manager import manager

router = APIRouter(tags=["websocket"])


@router.websocket("/ws/leaderboard/{exam_id}")
async def leaderboard_socket(websocket: WebSocket, exam_id: int):
    room = f"leaderboard:{exam_id}"
    await manager.connect(room, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(room, websocket)


@router.websocket("/ws/monitor/{exam_id}")
async def monitor_socket(websocket: WebSocket, exam_id: int):
    room = f"monitor:{exam_id}"
    await manager.connect(room, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(room, websocket)
