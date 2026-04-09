import type * as Party from "partykit/server";

type Player = {
  id: string;
  name: string;
  score: number;
  answer: string | null;
};

type GameMode = "classic" | "sudden_death" | "bombs_ticking" | "whos_next";

type GameState = {
  status: "waiting" | "playing" | "results";
  subStatus: "memorize" | "pick" | "review";
  currentMode: GameMode;
  players: Record<string, Player>;
  currentColor: string | null;
  sequenceColors: string[] | null;
  round: number;
  maxRounds: number;
  timerEnd?: number;
};

function randomHSL(): string {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * 40) + 40;
  const l = Math.floor(Math.random() * 30) + 35;
  return `hsl(${h},${s}%,${l}%)`;
}

function toHSLString(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s));
  l = Math.max(0, Math.min(100, l));
  return `hsl(${Math.round(h)},${Math.round(s)}%,${Math.round(l)}%)`;
}

function generateSequence(): { sequence: string[]; target: string } {
  const hStart = Math.floor(Math.random() * 360);
  const sStart = Math.floor(Math.random() * 40) + 40;
  const lStart = Math.floor(Math.random() * 30) + 35;

  const types = ["hue", "sat", "light"];
  const trendType = types[Math.floor(Math.random() * types.length)];

  let hStep = 0, sStep = 0, lStep = 0;
  const isPositive = Math.random() > 0.5;

  switch (trendType) {
    case "hue":
      hStep = (isPositive ? 1 : -1) * (Math.random() * 10 + 15);
      break;
    case "sat":
      sStep = (isPositive ? 1 : -1) * (Math.random() * 5 + 10);
      break;
    case "light":
      lStep = (isPositive ? 1 : -1) * (Math.random() * 4 + 8);
      break;
  }

  const colors: string[] = [];
  for (let i = 0; i < 4; i++) {
    colors.push(toHSLString(
      hStart + hStep * i,
      sStart + sStep * i,
      lStart + lStep * i
    ));
  }

  return {
    sequence: colors.slice(0, 3),
    target: colors[3],
  };
}

function scoreAnswer(original: string, answer: string): number {
  const parse = (c: string): [number, number, number] | null => {
    const m = c.match(/hsl\((\d+),(\d+)%,(\d+)%\)/);
    if (!m) return null;
    return [
      parseInt(m[1], 10),
      parseInt(m[2], 10),
      parseInt(m[3], 10),
    ];
  };

  const p1 = parse(original);
  const p2 = parse(answer);
  if (!p1 || !p2) return 0;

  const [h1, s1, l1] = p1;
  const [h2, s2, l2] = p2;

  const dh = Math.min(Math.abs(h1 - h2), 360 - Math.abs(h1 - h2)) / 180;
  const ds = Math.abs(s1 - s2) / 100;
  const dl = Math.abs(l1 - l2) / 100;

  const weightedDiff = dh * 0.6 + ds * 0.2 + dl * 0.2;
  const score = Math.pow(Math.max(0, 1 - weightedDiff), 3) * 100;

  return Math.round(score);
}

export default class GameServer implements Party.Server {
  state: GameState = {
    status: "waiting",
    subStatus: "memorize",
    currentMode: "classic",
    players: {},
    currentColor: null,
    sequenceColors: null,
    round: 0,
    maxRounds: 5,
  };

  // 🔥 gestion propre des timers
  memoTimeout: ReturnType<typeof setTimeout > | null = null;
  pickTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(readonly room: Party.Room) {}

  broadcast() {
    this.room.broadcast(JSON.stringify({ type: "state", state: this.state }));
  }

  startRound() {
    // 🔥 clear anciens timers
    if (this.memoTimeout) clearTimeout(this.memoTimeout);
    if (this.pickTimeout) clearTimeout(this.pickTimeout);

    this.state.status = "playing";
    this.state.subStatus = "memorize";
    this.state.round++;
    this.state.timerEnd = undefined;
    this.state.sequenceColors = null;

    const rand = Math.random();
    if (rand < 0.6) {
      this.state.currentMode = "classic";
      this.state.currentColor = randomHSL();
    } else if (rand < 0.7) {
      this.state.currentMode = "sudden_death";
      this.state.currentColor = randomHSL();
    } else if (rand < 0.8) {
      this.state.currentMode = "bombs_ticking";
      this.state.currentColor = randomHSL();
    } else {
      this.state.currentMode = "whos_next";
      const { sequence, target } = generateSequence();
      this.state.sequenceColors = sequence;
      this.state.currentColor = target;
    }

    Object.values(this.state.players).forEach((p) => (p.answer = null));
    this.broadcast();

    const memoDuration = this.state.currentMode === "whos_next" ? 7000 : 5000;

    this.memoTimeout = setTimeout(() => {
      this.state.subStatus = "pick";

      let pickDuration = 20000;
      if (this.state.currentMode === "bombs_ticking") pickDuration = 4000;

      this.state.timerEnd = Date.now() + pickDuration;
      this.broadcast();

      this.pickTimeout = setTimeout(() => {
        if (this.state.subStatus === "pick") {
          this.endPickPhase();
        }
      }, pickDuration + 500);

    }, memoDuration);
  }

  isEndingPhase = false;

  endPickPhase() {
    if (this.state.subStatus !== "pick" || this.isEndingPhase) return;
    this.isEndingPhase = true;

    if (this.pickTimeout) {
      clearTimeout(this.pickTimeout);
      this.pickTimeout = null;
    }

    this.calculateScores();
    this.state.subStatus = "review";
    this.state.timerEnd = undefined;
    this.broadcast();

    setTimeout(() => {
      if (this.state.round >= this.state.maxRounds) {
        this.state.status = "results";
      } else {
        this.isEndingPhase = false;
        this.startRound();
      }
      this.broadcast();
    }, 4000);
  }

  calculateScores() {
    const players = Object.values(this.state.players);
    const currentColor = this.state.currentColor!;

    if (
      this.state.currentMode === "classic" ||
      this.state.currentMode === "bombs_ticking" ||
      this.state.currentMode === "whos_next"
    ) {
      players.forEach((p) => {
        if (p.answer) {
          p.score += scoreAnswer(currentColor, p.answer);
        }
      });
    } else if (this.state.currentMode === "sudden_death") {
      let bestScore = -1;
      let winners: string[] = [];

      players.forEach((p) => {
        if (p.answer) {
          const currentPrecision = scoreAnswer(currentColor, p.answer);
          if (currentPrecision > bestScore) {
            bestScore = currentPrecision;
            winners = [p.id];
          } else if (currentPrecision === bestScore && bestScore > 0) {
            winners.push(p.id);
          }
        }
      });

      winners.forEach((id) => {
        this.state.players[id].score += bestScore;
      });
    }
  }

  onConnect(conn: Party.Connection) {
    conn.send(JSON.stringify({ type: "state", state: this.state }));
  }

  onClose(conn: Party.Connection) {
    delete this.state.players[conn.id];
    this.broadcast();
  }

  onMessage(message: string, sender: Party.Connection) {
    const data = JSON.parse(message);

    if (data.type === "join") {
      this.state.players[sender.id] = {
        id: sender.id,
        name: data.name,
        score: 0,
        answer: null,
      };
      this.broadcast();
    }

    if (data.type === "start" && this.state.status !== "playing") {
      this.state.round = 0;
      this.isEndingPhase = false;
      Object.values(this.state.players).forEach((p) => (p.score = 0));
      this.startRound();
    }

    if (data.type === "answer" && this.state.subStatus === "pick" && !this.isEndingPhase) {
      const player = this.state.players[sender.id];

      if (player && !player.answer && this.state.currentColor) {
        player.answer = data.color;
        this.broadcast();
      }

      const allAnswered = Object.values(this.state.players).every(
        (p) => p.answer !== null
      );

      if (allAnswered) {
        this.endPickPhase();
      }
    }
  }
}

GameServer satisfies Party.Worker;