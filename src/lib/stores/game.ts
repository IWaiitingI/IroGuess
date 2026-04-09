import { writable } from 'svelte/store';
import PartySocket from 'partysocket';
import { PUBLIC_PARTYKIT_HOST } from '$env/static/public';

export const gameStore = writable<any>(null);
let socket: PartySocket | null = null;

const PARTYKIT_HOST = PUBLIC_PARTYKIT_HOST || "localhost:1999";

export const gameActions = {
    connect: (roomId: string, playerName: string) => {
        if (socket) socket.close();
        
        socket = new PartySocket({
            host: PARTYKIT_HOST,
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

    sendAnswer: (color: string) =>
        socket?.send(JSON.stringify({ type: "answer", color })),

    leave: () => {
        socket?.close();
        gameStore.set(null);
    }
};