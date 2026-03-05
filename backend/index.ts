import express from "express";
import * as dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import db from "./database.js";
import cors from "cors";

dotenv.config({ path: ".env.local" }); // Load local env
dotenv.config(); // fallback to .env

const getAI = () => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set. Please add it to .env.local");
    }
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

async function startServer() {
    const app = express();
    const PORT = 3000;

    app.use(express.json());
    app.use(cors());

    // API rutas
    app.get("/api/health", (req, res) => {
        res.json({ status: "ok", time: new Date().toISOString() });
    });

    app.get("/api/matches", async (req, res) => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const stmt = db.prepare("SELECT * FROM matches WHERE date = ? ORDER BY time ASC");
            let rows = stmt.all(today);

            if (rows.length === 0) {
                console.log("No matches found for today, fetching real fixtures via Gemini...");
                const ai = getAI();
                const prompt = `
                Busca en internet los 5 partidos de fútbol más importantes y atractivos que se jueguen EXACTAMENTE HOY (${today}) en las principales ligas del mundo (La Liga, Premier League, Champions League, Serie A, Bundesliga, etc).
                Si hoy no hay partidos importantes, busca los partidos más importantes del día de MAÑANA.
                Para cada partido encuentra las cuotas aproximadas de apuestas (1X2).
                
                Devuelve ÚNICAMENTE un array JSON con esta estructura estricta y sin markdown u otro texto:
                [
                  {
                    "id": "generar_uuid_unico_o_texto",
                    "homeTeam": "Nombre Local",
                    "awayTeam": "Nombre Visitante",
                    "league": "Nombre Liga",
                    "date": "YYYY-MM-DD",
                    "time": "HH:MM",
                    "odds": { "home": 2.10, "draw": 3.40, "away": 3.20 }
                  }
                ]
                `;

                const response = await ai.models.generateContent({
                    model: "gemini-3-flash-preview",
                    contents: prompt,
                    config: {
                        tools: [{ googleSearch: {} }],
                        responseMimeType: "application/json",
                    },
                });

                const fetchedMatches = JSON.parse(response.text || "[]");

                if (fetchedMatches && fetchedMatches.length > 0) {
                    const insertMatch = db.prepare(`
                        INSERT INTO matches (id, homeTeam, awayTeam, league, date, time, oddsHome, oddsDraw, oddsAway)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `);

                    const insertMany = db.transaction((items) => {
                        for (const item of items) {
                            // Convertir a string id por si acaso
                            const strId = String(item.id || Math.random().toString(36).substring(7));
                            insertMatch.run(strId, item.homeTeam, item.awayTeam, item.league, item.date || today, item.time, item.odds.home, item.odds.draw, item.odds.away);
                        }
                    });
                    insertMany(fetchedMatches);

                    rows = stmt.all(today); // Re-fetch from DB
                }
            }

            const formattedMatches = rows.map((row: any) => ({
                id: row.id,
                homeTeam: row.homeTeam,
                awayTeam: row.awayTeam,
                league: row.league,
                date: row.date,
                time: row.time,
                odds: {
                    home: row.oddsHome,
                    draw: row.oddsDraw,
                    away: row.oddsAway
                }
            }));

            res.json(formattedMatches);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error fetchings matches" });
        }
    });

    app.get("/api/predictions", (req, res) => {
        try {
            const stmt = db.prepare("SELECT * FROM predictions");
            const rows = stmt.all();
            const predictions = rows.map((row: any) => ({
                matchId: row.matchId,
                prediction: row.prediction,
                confidence: row.confidence,
                reasoning: row.reasoning,
                suggestedBet: row.suggestedBet,
                probability: {
                    home: row.probHome,
                    draw: row.probDraw,
                    away: row.probAway
                },
                advanced: row.advancedJson ? JSON.parse(row.advancedJson) : undefined
            }));
            res.json(predictions);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error fetching predictions" });
        }
    });

    app.post("/api/analyze", async (req, res) => {
        const match = req.body;
        if (!match || !match.id) {
            res.status(400).json({ error: "Invalid match data" });
            return;
        }

        try {
            // Check if prediction already exists
            const existing = db.prepare("SELECT * FROM predictions WHERE matchId = ?").get(match.id) as any;
            if (existing) {
                console.log("Returning existing prediction for", match.id);
                res.json({
                    matchId: existing.matchId,
                    prediction: existing.prediction,
                    confidence: existing.confidence,
                    reasoning: existing.reasoning,
                    suggestedBet: existing.suggestedBet,
                    probability: {
                        home: existing.probHome,
                        draw: existing.probDraw,
                        away: existing.probAway
                    },
                    advanced: existing.advancedJson ? JSON.parse(existing.advancedJson) : undefined
                });
                return;
            }

            // Call Gemini
            const ai = getAI();
            const prompt = `
        Analiza el siguiente partido de fútbol y proporciona una predicción detallada MÁS eventos del partido y rendimiento de jugadores.
        Partido: ${match.homeTeam} vs ${match.awayTeam}
        Liga: ${match.league}
        Fecha: ${match.date}
        Cuotas actuales: Local ${match.odds.home}, Empate ${match.odds.draw}, Visitante ${match.odds.away}

        BUSCA EN INTERNET (Google Search) posibles formaciones actuales, jugadores lesionados/sancionados, y tendencias estadísticas recientes de ambos equipos. Necesito predecir goleadores, asistencias, tarjetas y córners probables.

        Devuelve ÚNICAMENTE la respuesta en formato JSON con la siguiente estructura exacta:
        {
          "matchId": "${match.id}",
          "prediction": "Resultado principal recomendado en 3 a 5 palabras MAX",
          "confidence": número del 0 al 100,
          "reasoning": "Explicación detallada de por qué esta apuesta es valiosa en base a lesiones y rachas",
          "suggestedBet": "Apostar a: (tu sugerencia final)",
          "probability": { "home": número, "draw": número, "away": número },
          "probability": { "home": número, "draw": número, "away": número },
          "advanced": {
            "topTeamPredictions": [
              { "selection": "Ej: Más de 2.5 goles", "probability": numero_0_a_100, "impliedOdds": cuota_como_1.5, "type": "MATCH_EVENT", "market": "OVER_UNDER" }
            ],
            "topPlayerPredictions": [
              { "selection": "Ej: Jugador Anota", "probability": numero_0_a_100, "impliedOdds": cuota, "type": "PLAYER_PROP", "market": "PLAYER_SHOTS" }
            ],
            "confidenceScore": numero_0_a_100
          }
        }
        `;

            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                    responseMimeType: "application/json",
                },
            });

            const result = JSON.parse(response.text || "{}");
            result.matchId = match.id; // Force matchId correctly from request

            // Extract advanced info explicitly
            const advancedInfo = result.advanced || null;
            const advancedJson = advancedInfo ? JSON.stringify(advancedInfo) : null;

            // Save to DB
            const insertPrediction = db.prepare(`
            INSERT INTO predictions (matchId, prediction, confidence, reasoning, suggestedBet, probHome, probDraw, probAway, advancedJson)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

            insertPrediction.run(
                result.matchId, result.prediction, result.confidence, result.reasoning, result.suggestedBet,
                result.probability?.home || 0, result.probability?.draw || 0, result.probability?.away || 0,
                advancedJson
            );

            res.json(result);
        } catch (error) {
            console.error("Error analyzing match:", error);
            res.status(500).json({ error: "Error analyzing match from Gemini" });
        }
    });

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`API Server running on http://0.0.0.0:${PORT}`);
    });
}

startServer();
