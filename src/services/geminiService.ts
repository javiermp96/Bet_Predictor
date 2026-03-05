import { Match, Prediction } from "../types";

export async function getUpcomingMatches(): Promise<Match[]> {
  try {
    const response = await fetch('/api/matches');
    if (!response.ok) throw new Error('Failed to fetch matches');
    return await response.json();
  } catch (error) {
    console.error("Error fetching matches:", error);
    return [];
  }
}

export async function analyzeMatch(match: Match): Promise<Prediction> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(match),
    });

    if (!response.ok) throw new Error('Failed to analyze match');
    return await response.json();
  } catch (error) {
    console.error("Error analyzing match:", error);
    throw error;
  }
}

export async function getPredictionsHistory(): Promise<Prediction[]> {
  try {
    const response = await fetch('/api/predictions');
    if (!response.ok) throw new Error('Failed to fetch predictions');
    return await response.json();
  } catch (error) {
    console.error("Error fetching predictions:", error);
    return [];
  }
}
