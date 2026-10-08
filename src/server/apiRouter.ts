import express, { Request, Response } from 'express';
import {
  analyzeDisruptionWithAI,
  simulateRerouteWithAI,
  generateSupplierNoticeWithAI,
  generateCascadeAnalysisWithAI,
} from './geminiService';

export const apiRouter = express.Router();

apiRouter.use(express.json());

apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'GeoLogix AI Risk Intelligence Engine',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    timestamp: new Date().toISOString(),
  });
});

apiRouter.post('/disruption-analysis', async (req: Request, res: Response) => {
  try {
    const { incidentId, userPrompt } = req.body;
    const result = await analyzeDisruptionWithAI(incidentId || 'red-sea-kinetic-strikes', userPrompt);
    res.json(result);
  } catch (error: any) {
    console.error('Error in /api/disruption-analysis:', error);
    res.status(500).json({ error: error?.message || 'Failed to analyze disruption' });
  }
});

apiRouter.post('/simulate-reroute', async (req: Request, res: Response) => {
  try {
    const params = req.body;
    const result = await simulateRerouteWithAI(params);
    res.json(result);
  } catch (error: any) {
    console.error('Error in /api/simulate-reroute:', error);
    res.status(500).json({ error: error?.message || 'Failed to simulate reroute' });
  }
});

apiRouter.post('/generate-notice', async (req: Request, res: Response) => {
  try {
    const params = req.body;
    const result = await generateSupplierNoticeWithAI(params);
    res.json(result);
  } catch (error: any) {
    console.error('Error in /api/generate-notice:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate supplier notice' });
  }
});

apiRouter.post('/cascade-analysis', async (req: Request, res: Response) => {
  try {
    const { scenarioName } = req.body;
    const result = await generateCascadeAnalysisWithAI(scenarioName || 'red-sea-kinetic-strikes');
    res.json(result);
  } catch (error: any) {
    console.error('Error in /api/cascade-analysis:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate cascade analysis' });
  }
});
