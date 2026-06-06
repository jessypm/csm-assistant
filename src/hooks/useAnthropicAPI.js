import { useState, useCallback } from 'react';
import { SYSTEM_PROMPT } from '../utils/prompts';

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-5';

export function useAnthropicAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callAPI = useCallback(async (userMessage, options = {}) => {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

    if (!apiKey || apiKey === 'sk-ant-api03-...') {
      setError(
        'Clé API Anthropic manquante. Créez un fichier .env à la racine du projet avec : VITE_ANTHROPIC_API_KEY=votre_clé'
      );
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: options.model || MODEL,
          max_tokens: options.maxTokens || 4096,
          system: options.systemPrompt !== undefined ? options.systemPrompt : SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userMessage }],
        }),
      });

      if (!response.ok) {
        let errorMsg = `Erreur API (${response.status})`;
        try {
          const errData = await response.json();
          errorMsg = errData.error?.message || errorMsg;
        } catch {
          /* ignore parse error */
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      return data.content?.[0]?.text ?? null;
    } catch (err) {
      const msg = err.message || "Une erreur est survenue lors de l'appel API";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { callAPI, loading, error, clearError };
}

export function parseJSON(text) {
  if (!text) return null;
  try {
    // Strip potential markdown code fences
    const cleaned = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}
