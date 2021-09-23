import { google } from 'googleapis';
import { promisify } from 'util';
import { logError } from '../../utils/log';
import { roundToTwo } from '../../utils/roundToTwo';

const API_KEY = process.env.PERSPECTIVE_API_TOKEN;
const DISCOVERY_URL =
  'https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1';

/**
 * Note: this interface does not include all data returned
 */
interface ICommentsAnalyzeResponse {
  data: {
    attributeScores: {
      TOXICITY: {
        summaryScore: {
          value: number;
        };
      };
    };
  };
}

/**
 * Note: This interface does not include all possible parameters
 */
interface ICommentsAnalyzeRequest {
  comment: {
    text: string;
  };
  requestedAttributes: {
    TOXICITY: Record<string, never>;
  };
  doNotStore: boolean;
  communityId: string;
}

interface ICommentsAnalyzeArgs {
  key: string;
  resource: ICommentsAnalyzeRequest;
}

interface ICommentsApi {
  analyze: (
    arg1: ICommentsAnalyzeArgs,
    callback: (err: unknown, result: ICommentsAnalyzeResponse) => void,
  ) => void;
}

const scoreAsPercent = (score?: number) => roundToTwo((score || 0) * 100);
const summaryScore = (response: ICommentsAnalyzeResponse) =>
  response?.data?.attributeScores?.TOXICITY?.summaryScore?.value;

const connectClient = async () =>
  (await google.discoverAPI(DISCOVERY_URL)).comments as ICommentsApi;

/**
 * @param text The text string to analyze with the Perspective API
 * @param communityId A chat id to taylor analysis to a specific group
 * @returns An object with the score in percent
 */
export const toxicityProbability = async (
  text: string,
  communityId: string | number,
): Promise<{ score?: number; error?: string }> => {
  const client = await connectClient();
  const analyze = promisify(client.analyze);

  const analyzeRequest: ICommentsAnalyzeRequest = {
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
