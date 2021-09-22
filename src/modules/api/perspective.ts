import { logError } from '../../utils/log';
import { roundToTwo } from '../../utils/roundToTwo';

const { promisify } = require('util');
const { google } = require('googleapis');

const API_KEY = process.env.PERSPECTIVE_API_TOKEN;
const DISCOVERY_URL =
  'https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1';

const scoreAsPercent = (score?: number) => roundToTwo((score || 0) * 100);
const summaryScore = (response: any) =>
  response?.data?.attributeScores?.TOXICITY?.summaryScore?.value;

/**
 * @param text The text string to analyze with the Perspective API
 * @param communityId A chat id to taylor analysis to a specific group
 * @returns An object with the score in percent
 */
export const toxicityProbability = async (
  text: string,
  communityId: string | number,
): Promise<{ score?: number; error?: string }> => {
  const client = await google.discoverAPI(DISCOVERY_URL);
  const analyze = promisify(client.comments.analyze);

  const analyzeRequest = {
    comment: {
      text,
    },
    requestedAttributes: {
      TOXICITY: {},
    },
    doNotStore: true,
    communityId: `${communityId}`,
  };

  try {
    const response = await analyze({
      key: API_KEY,
      resource: analyzeRequest,
    });

    return {
      score: scoreAsPercent(summaryScore(response)),
    };
  } catch (err) {
    logError(err);

    return {
      error: err.message,
    };
  }
};
