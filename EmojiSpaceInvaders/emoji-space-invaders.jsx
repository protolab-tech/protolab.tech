import { useState, useEffect, useRef, useCallback } from "react";

const COLS = 11;
const ROWS = 4;
const CELL_W = 56;
const CELL_H = 52;
const CANVAS_W = 660;
const CANVAS_H = 560;
const PLAYER_Y = CANVAS_H - 56;
const PLAYER_SPEED = 5;
const BULLET_SPEED = 9;
const ENEMY_BULLET_SPEED = 4;
const ENEMY_DROP = 18;

const ENEMY_EMOJIS = ["👾", "👽", "🛸", "🤖"];
const EXPLOSION = "💥";
const PLAYER_EMOJI = "🚀";
const BULLET_EMOJI = "⚡";
const ENEMY_BULLET_EMOJI = "🔴";
const SHIELD_EMOJI = "🛡️";
const STAR_EMOJI = "⭐";
const LIVES_EMOJI = "❤️";

function makeInvaders() {
  const grid = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      grid.push({
        id: r * COLS + c,
        row: r,
        col: c,
        x: 40 + c * CELL_W,
        y: 60 + r * CELL_H,
        alive: true,
        emoji: ENEMY_EMOJIS[Math.min(r, ENEMY_EMOJIS.length - 1)],
        exploding: false,
        explodeTimer: 0,
      });
    }
  }
  return grid;
}

function makeShields() {
  return [120, 260, 400, 540].map((x, i) => ({
    id: i,
    x,
    y: PLAYER_Y - 60,
    hp: 4,
  }));
}

export default function SpaceInvaders() {
  const [screen, setScreen] = useState("title"); // title | playing | dead | win
  const [score, setScore] = useState(0);
  const [hiScore, setHiScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(1);
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const animRef = useRef(null);
  const keysRef = useRef({});

  const initGame = useCallback((waveNum = 1) => {
    stateRef.current = {
      player: { x: CANVAS_W / 2 - 20, y: PLAYER_Y },
      invaders: makeInvaders(),
      shields: makeShields(),
      bullets: [],
      enemyBullets: [],
      explosions: [],
      stars: Array.from({ length: 60 }, () => ({
        x: Math.random() * CANVAS_W,
        y: Math.random() * CANVAS_H,
        s: Math.random() * 2 + 0.5,
        sp: Math.random() * 0.4 + 0.1,
      })),
      dir: 1,
      moveTimer: 0,
      moveInterval: Math.max(8, 28 - waveNum * 3),
      shootTimer: 0,
      shootInterval: Math.max(40, 90 - waveNum * 8),
      playerShootCooldown: 0,
      score: 0,
      lives: 3,
      wave: waveNum,
      gameOver: false,
      won: false,
      playerHit: false,
      playerHitTimer: 0,
    };
  }, []);

  const startGame = useCallback(() => {
    initGame(1);
    setScore(0);
    setLives(3);
    setWave(1);
    setScreen("playing");
  }, [initGame]);

  useEffect(() => {
    if (screen !== "playing") return;
    const onKey = (e) => { keysRef.current[e.code] = e.type === "keydown"; };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, [screen]);

  useEffect(() => {
    if (screen !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const loop = () => {
      const s = stateRef.current;
      if (!s) return;

      // Stars
      s.stars.forEach(st => { st.y += st.sp; if (st.y > CANVAS_H) st.y = 0; });

      // Player movement
      if (keysRef.current["ArrowLeft"] || keysRef.current["KeyA"]) s.player.x = Math.max(0, s.player.x - PLAYER_SPEED);
      if (keysRef.current["ArrowRight"] || keysRef.current["KeyD"]) s.player.x = Math.min(CANVAS_W - 44, s.player.x + PLAYER_SPEED);

      // Player shoot
      if (s.playerShootCooldown > 0) s.playerShootCooldown--;
      if ((keysRef.current["Space"] || keysRef.current["ArrowUp"]) && s.playerShootCooldown === 0) {
        s.bullets.push({ x: s.player.x + 20, y: s.player.y - 10, id: Math.random() });
        s.playerShootCooldown = 18;
      }

      // Move bullets
      s.bullets = s.bullets.filter(b => b.y > -20);
      s.bullets.forEach(b => { b.y -= BULLET_SPEED; });

      // Enemy bullets
      s.enemyBullets = s.enemyBullets.filter(b => b.y < CANVAS_H + 20);
      s.enemyBullets.forEach(b => { b.y += ENEMY_BULLET_SPEED; });

      // Move invaders
      s.moveTimer++;
      if (s.moveTimer >= s.moveInterval) {
        s.moveTimer = 0;
        const alive = s.invaders.filter(i => i.alive);
        const leftmost = Math.min(...alive.map(i => i.x));
        const rightmost = Math.max(...alive.map(i => i.x + CELL_W - 10));
        let drop = false;
        if (s.dir === 1 && rightmost >= CANVAS_W - 10) { s.dir = -1; drop = true; }
        if (s.dir === -1 && leftmost <= 10) { s.dir = 1; drop = true; }
        s.invaders.forEach(inv => {
          if (!inv.alive) return;
          inv.x += s.dir * 14;
          if (drop) inv.y += ENEMY_DROP;
        });
        const anyBottom = s.invaders.some(i => i.alive && i.y + 40 >= PLAYER_Y);
        if (anyBottom) { s.lives = 0; s.gameOver = true; }
      }

      // Enemy shoot
      s.shootTimer++;
      if (s.shootTimer >= s.shootInterval) {
        s.shootTimer = 0;
        const alive = s.invaders.filter(i => i.alive);
        if (alive.length) {
          const shooter = alive[Math.floor(Math.random() * alive.length)];
          s.enemyBullets.push({ x: shooter.x + 20, y: shooter.y + 36, id: Math.random() });
        }
      }

      // Bullet-invader collisions
      s.bullets.forEach(b => {
        s.invaders.forEach(inv => {
          if (!inv.alive || inv.exploding) return;
          if (b.x > inv.x && b.x < inv.x + 44 && b.y > inv.y && b.y < inv.y + 44) {
            inv.alive = false;
            inv.exploding = true;
            inv.explodeTimer = 20;
            b.y = -999;
            s.score += (ROWS - inv.row) * 10;
            s.explosions.push({ x: inv.x, y: inv.y, t: 20, id: Math.random() });
          }
        });
      });

      // Explosions
      s.explosions = s.explosions.filter(e => e.t > 0);
      s.explosions.forEach(e => e.t--);
      s.invaders.forEach(inv => { if (inv.exploding) { inv.explodeTimer--; if (inv.explodeTimer <= 0) inv.exploding = false; } });

      // Enemy bullet - player collision
      if (!s.playerHit) {
        s.enemyBullets.forEach(b => {
          if (b.x > s.player.x && b.x < s.player.x + 44 && b.y > s.player.y && b.y < s.player.y + 44) {
            b.y = CANVAS_H + 100;
            s.lives--;
            s.playerHit = true;
            s.playerHitTimer = 60;
            if (s.lives <= 0) s.gameOver = true;
          }
        });
      } else {
        s.playerHitTimer--;
        if (s.playerHitTimer <= 0) s.playerHit = false;
      }

      // Shield collisions
      s.enemyBullets.forEach(b => {
        s.shields.forEach(sh => {
          if (sh.hp <= 0) return;
          if (b.x > sh.x - 10 && b.x < sh.x + 50 && b.y > sh.y && b.y < sh.y + 30) {
            b.y = CANVAS_H + 100;
            sh.hp--;
          }
        });
      });
      s.bullets.forEach(b => {
        s.shields.forEach(sh => {
          if (sh.hp <= 0) return;
          if (b.x > sh.x - 10 && b.x < sh.x + 50 && b.y > sh.y && b.y < sh.y + 30) {
            b.y = -999;
            sh.hp--;
          }
        });
      });

      // Win check
      if (s.invaders.filter(i => i.alive).length === 0) s.won = true;

      // ---- DRAW ----
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      // BG
      ctx.fillStyle = "#050a14";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Stars
      ctx.fillStyle = "#ffffff";
      s.stars.forEach(st => {
        ctx.globalAlpha = 0.4 + Math.sin(Date.now() / 800 + st.x) * 0.3;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.s, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Scanlines
      ctx.fillStyle = "rgba(0,200,80,0.015)";
      for (let y = 0; y < CANVAS_H; y += 3) {
        ctx.fillRect(0, y, CANVAS_W, 1);
      }

      // Ground line
      ctx.strokeStyle = "#00ff6633";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, PLAYER_Y + 44);
      ctx.lineTo(CANVAS_W, PLAYER_Y + 44);
      ctx.stroke();

      ctx.font = "36px serif";
      ctx.textAlign = "left";

      // Invaders
      s.invaders.forEach(inv => {
        if (!inv.alive && !inv.exploding) return;
        ctx.font = "34px serif";
        ctx.globalAlpha = inv.exploding ? inv.explodeTimer / 20 : 1;
        ctx.fillText(inv.exploding ? EXPLOSION : inv.emoji, inv.x, inv.y + 36);
        ctx.globalAlpha = 1;
      });

      // Shields
      s.shields.forEach(sh => {
        if (sh.hp <= 0) return;
        ctx.globalAlpha = sh.hp / 4;
        ctx.font = "30px serif";
        ctx.fillText(SHIELD_EMOJI, sh.x, sh.y + 28);
        ctx.globalAlpha = 1;
      });

      // Player bullets
      s.bullets.forEach(b => {
        if (b.y < -10) return;
        ctx.font = "20px serif";
        ctx.fillText(BULLET_EMOJI, b.x - 10, b.y + 12);
      });

      // Enemy bullets
      s.enemyBullets.forEach(b => {
        ctx.font = "18px serif";
        ctx.fillText(ENEMY_BULLET_EMOJI, b.x - 9, b.y + 10);
      });

      // Player
      if (!s.gameOver) {
        ctx.globalAlpha = s.playerHit ? (Math.floor(s.playerHitTimer / 6) % 2 === 0 ? 0.3 : 1) : 1;
        ctx.font = "40px serif";
        ctx.fillText(PLAYER_EMOJI, s.player.x, s.player.y + 38);
        ctx.globalAlpha = 1;
      }

      // HUD
      ctx.fillStyle = "#00ff66";
      ctx.font = "bold 14px 'Courier New', monospace";
      ctx.textAlign = "left";
      ctx.fillText(`SCORE: ${s.score}`, 10, 24);
      ctx.textAlign = "center";
      ctx.fillText(`WAVE ${s.wave}`, CANVAS_W / 2, 24);
      ctx.textAlign = "right";
      ctx.fillText(`HI: ${Math.max(s.score, hiScore)}`, CANVAS_W - 10, 24);

      // Lives
      ctx.textAlign = "left";
      ctx.font = "18px serif";
      for (let i = 0; i < s.lives; i++) ctx.fillText(LIVES_EMOJI, 10 + i * 24, CANVAS_H - 8);

      // Spacebar hint
      ctx.fillStyle = "#00ff6644";
      ctx.font = "11px 'Courier New', monospace";
      ctx.textAlign = "right";
      ctx.fillText("← → MOVE   SPACE SHOOT", CANVAS_W - 10, CANVAS_H - 8);

      setScore(s.score);
      setLives(s.lives);

      if (s.gameOver) {
        setHiScore(h => Math.max(h, s.score));
        setScreen("dead");
        return;
      }
      if (s.won) {
        setHiScore(h => Math.max(h, s.score));
        const nextWave = s.wave + 1;
        setWave(nextWave);
        initGame(nextWave);
        stateRef.current.score = s.score;
        stateRef.current.lives = s.lives;
        setScreen("playing");
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [screen, hiScore, initGame]);

  const overlayStyle = {
    position: "absolute", inset: 0, display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", background: "rgba(5,10,20,0.88)",
    fontFamily: "'Courier New', monospace", color: "#00ff66",
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#020608",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "16px",
      fontFamily: "'Courier New', monospace",
    }}>
      <div style={{ marginBottom: 12, textAlign: "center" }}>
        <div style={{
          color: "#00ff66", fontSize: 28, fontWeight: "bold", letterSpacing: 6,
          textShadow: "0 0 18px #00ff66, 0 0 40px #00ff6688",
        }}>
          👾 EMOJI INVADERS 👾
        </div>
        <div style={{ color: "#00ff6666", fontSize: 12, letterSpacing: 3, marginTop: 2 }}>
          HI-SCORE: {hiScore}
        </div>
      </div>

      <div style={{ position: "relative", border: "2px solid #00ff6633", borderRadius: 4, boxShadow: "0 0 40px #00ff6622" }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          style={{ display: "block", maxWidth: "100%", borderRadius: 2 }}
        />

        {screen === "title" && (
          <div style={overlayStyle}>
            <div style={{ fontSize: 64, marginBottom: 8 }}>👾</div>
            <div style={{ fontSize: 32, fontWeight: "bold", letterSpacing: 5, textShadow: "0 0 20px #00ff66" }}>
              EMOJI INVADERS
            </div>
            <div style={{ marginTop: 24, fontSize: 13, color: "#00ff6699", lineHeight: 2, textAlign: "center" }}>
              <div>👾 👽 🛸 🤖 — defend Earth!</div>
              <div>← → to move &nbsp;&nbsp; SPACE to fire</div>
              <div>🛡️ shields absorb hits</div>
            </div>
            <button onClick={startGame} style={{
              marginTop: 32, padding: "12px 40px", background: "transparent",
              border: "2px solid #00ff66", color: "#00ff66", fontSize: 16,
              fontFamily: "'Courier New', monospace", letterSpacing: 3,
              cursor: "pointer", textTransform: "uppercase",
              boxShadow: "0 0 20px #00ff6655",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => e.target.style.background = "#00ff6622"}
              onMouseLeave={e => e.target.style.background = "transparent"}
            >
              INSERT COIN
            </button>
          </div>
        )}

        {screen === "dead" && (
          <div style={overlayStyle}>
            <div style={{ fontSize: 56 }}>💀</div>
            <div style={{ fontSize: 28, fontWeight: "bold", letterSpacing: 4, marginTop: 8, color: "#ff4444", textShadow: "0 0 20px #ff4444" }}>
              GAME OVER
            </div>
            <div style={{ marginTop: 16, fontSize: 20, color: "#00ff66" }}>SCORE: {score}</div>
            <div style={{ fontSize: 14, color: "#00ff6666", marginTop: 4 }}>HI-SCORE: {hiScore}</div>
            <button onClick={startGame} style={{
              marginTop: 28, padding: "12px 40px", background: "transparent",
              border: "2px solid #ff4444", color: "#ff4444", fontSize: 15,
              fontFamily: "'Courier New', monospace", letterSpacing: 3,
              cursor: "pointer", boxShadow: "0 0 20px #ff444455",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => e.target.style.background = "#ff444422"}
              onMouseLeave={e => e.target.style.background = "transparent"}
            >
              TRY AGAIN
            </button>
          </div>
        )}
      </div>

      <div style={{ marginTop: 10, color: "#00ff6633", fontSize: 11, letterSpacing: 2 }}>
        USE KEYBOARD — ARROWS + SPACE &nbsp;|&nbsp; CLICK CANVAS TO FOCUS
      </div>
    </div>
  );
}
