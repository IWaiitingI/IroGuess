import { writable } from 'svelte/store';
import PartySocket from 'partysocket';

export const gameStore = writable<any>(null);
let socket: PartySocket | null = null;

export const gameActions = {
    connect: (roomId: string, playerName: string) => {
        if (socket) socket.close();
        
        socket = new PartySocket({
            host: "localhost:1999",
            room: roomId,
        });

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "state") {
                gameStore.set(data.state);
            }
        };

        socket.onopen = () => {
            socket?.send(JSON.stringify({ type: "join", name: playerName }));
        };
    },
    start: () => socket?.send(JSON.stringify({ type: "start" })),
    sendAnswer: (color: string) => socket?.send(JSON.stringify({ type: "answer", color })),
    leave: () => {
        socket?.close();
        gameStore.set(null);
    }
};