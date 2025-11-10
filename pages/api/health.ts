import type { NextApiRequest, NextApiResponse } from 'next';

interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  checks: {
    memory: { status: string; used: number; limit: number };
    env: { status: string; variables: string[] };
    dependencies: { status: string; available: string[] };
  };
  version: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthCheckResponse>
) {
  if (req.method !== 'GET') {
    res.status(405).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: {
        memory: { status: 'unknown', used: 0, limit: 0 },
        env: { status: 'unknown', variables: [] },
        dependencies: { status: 'unknown', available: [] }
      },
      version: '1.0.0'
    });
    return;
  }

  try {
    const memoryUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);
    
    // Check environment variables
    const requiredEnvVars = ['GROQ_API_KEY'];
    const availableEnvVars = requiredEnvVars.filter(v => process.env[v]);
    
    // Check available dependencies
    const dependencies = [];
    if (process.env.GROQ_API_KEY) dependencies.push('Groq AI');
    if (process.env.OPENAI_API_KEY) dependencies.push('OpenAI');
    if (process.env.ANTHROPIC_API_KEY) dependencies.push('Claude');
    
    const memoryStatus = heapUsedMB < 900 ? 'ok' : 'warning';
    const envStatus = availableEnvVars.length >= 1 ? 'ok' : 'warning';
    const depStatus = dependencies.length >= 1 ? 'ok' : 'degraded';
    
    const overallStatus = 
      memoryStatus === 'ok' && envStatus === 'ok' && depStatus === 'ok' ? 'healthy' :
      memoryStatus === 'warning' || depStatus === 'degraded' ? 'degraded' :
      'unhealthy';

    const response: HealthCheckResponse = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: {
        memory: {
          status: memoryStatus,
          used: heapUsedMB,
          limit: heapTotalMB
        },
        env: {
          status: envStatus,
          variables: availableEnvVars
        },
        dependencies: {
          status: depStatus,
          available: dependencies
        }
      },
      version: '1.0.0'
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: {
        memory: { status: 'error', used: 0, limit: 0 },
        env: { status: 'error', variables: [] },
        dependencies: { status: 'error', available: [] }
      },
      version: '1.0.0'
    });
  }
}
