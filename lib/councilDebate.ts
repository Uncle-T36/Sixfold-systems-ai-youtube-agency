/**
 * 👑 IMPERIAL COUNCIL DEBATE SYSTEM - TARS-Level AI Intelligence
 * 
 * 5 Philosophers who:
 * 1. Respond individually with unique perspectives
 * 2. Critique each other's ideas
 * 3. Debate back and forth
 * 4. Reach a unified consensus
 * 
 * Like TARS from Interstellar - autonomous, intelligent, decisive
 */

export interface PhilosopherPersonality {
  id: string;
  name: string;
  emoji: string;
  specialty: string;
  debateStyle: string;
  priorities: string[];
  weaknesses: string[];
  allies: string[];
  rivals: string[];
}

export interface DebateStatement {
  philosopherId: string;
  philosopher: string;
  emoji: string;
  type: 'opinion' | 'critique' | 'rebuttal' | 'agreement' | 'final';
  targetPhilosopher?: string;
  statement: string;
  score: number;
  timestamp: number;
}

export interface DebateRound {
  round: number;
  topic: string;
  statements: DebateStatement[];
}

export interface CouncilDebateResult {
  topic: string;
  debateRounds: DebateRound[];
  critiques: { from: string; to: string; critique: string }[];
  agreements: { philosophers: string[]; point: string }[];
  finalConsensus: {
    decision: string;
    confidence: number;
    reasoning: string;
    actionItems: string[];
    dissent?: { philosopher: string; reason: string };
  };
  votingResult: {
    approve: string[];
    reject: string[];
    revise: string[];
    unanimous: boolean;
  };
  totalDebateTime: number;
}

// 👑 THE FIVE PHILOSOPHERS
const PHILOSOPHERS: PhilosopherPersonality[] = [
  {
    id: 'machiavelli',
    name: 'Niccolò Machiavelli',
    emoji: '🦁',
    specialty: 'Power, Strategy, Ruthless Efficiency',
    debateStyle: 'Aggressive, calculating, ends-justify-means',
    priorities: ['Dominance', 'Strategic positioning', 'Psychological manipulation'],
    weaknesses: ['Can be too aggressive', 'May sacrifice long-term for short-term'],
    allies: ['Sun Tzu'],
    rivals: ['Marcus Aurelius']
  },
  {
    id: 'seneca',
    name: 'Seneca the Stoic',
    emoji: '🏛️',
    specialty: 'Stoic Wisdom, Long-term Thinking, Discipline',
    debateStyle: 'Calm, measured, focused on sustainability',
    priorities: ['Long-term value', 'Quality over quantity', 'Resilience'],
    weaknesses: ['Can be too conservative', 'May miss opportunities'],
    allies: ['Marcus Aurelius'],
    rivals: ['Machiavelli']
  },
  {
    id: 'sun_tzu',
    name: 'Sun Tzu',
    emoji: '⚔️',
    specialty: 'Competitive Analysis, Timing, Indirect Approach',
    debateStyle: 'Strategic, observational, exploits weaknesses',
    priorities: ['Competitive advantage', 'Market gaps', 'Perfect timing'],
    weaknesses: ['Over-analyzes', 'May delay action'],
    allies: ['Machiavelli'],
    rivals: ['Carnegie']
  },
  {
    id: 'carnegie',
    name: 'Dale Carnegie',
    emoji: '🤝',
    specialty: 'Influence, Networking, Relationship Building',
    debateStyle: 'Friendly, persuasive, audience-focused',
    priorities: ['Audience connection', 'Loyalty', 'Trust building'],
    weaknesses: ['Too people-pleasing', 'May avoid hard truths'],
    allies: ['Seneca'],
    rivals: ['Sun Tzu']
  },
  {
    id: 'aurelius',
    name: 'Marcus Aurelius',
    emoji: '👑',
    specialty: 'Systems Thinking, Integrity, Consistent Excellence',
    debateStyle: 'Philosophical, principled, big-picture',
    priorities: ['Integrity', 'Systematic improvement', 'Reputation'],
    weaknesses: ['Idealistic', 'May be too cautious'],
    allies: ['Seneca'],
    rivals: ['Machiavelli']
  }
];

// 🎯 Generate individual philosopher opinion
function generatePhilosopherOpinion(
  philosopher: PhilosopherPersonality,
  topic: string,
  context: any
): DebateStatement {
  const opinions: Record<string, (topic: string, context: any) => string> = {
    machiavelli: (topic, ctx) => {
      const templates = [
        `This ${topic} must be designed to DOMINATE. The algorithm rewards aggression - we need power words, psychological triggers, and an enemy to fight against. I see potential for viral manipulation here.`,
        `Power moves first. For "${topic}", we need clickbait psychology: numbers, secrets, urgency. The masses respond to fear and desire. Let's exploit both.`,
        `The competition is weak in this space. Strike now with "${topic}" - use controversy, polarization. Those who play nice lose. Those who play smart, win.`
      ];
      return templates[Math.floor(Math.random() * templates.length)];
    },
    seneca: (topic, ctx) => {
      const templates = [
        `Patience. "${topic}" has merit, but we must think 10 years ahead. Will this content still generate value? Evergreen content compounds. Trendy content decays.`,
        `I urge restraint with "${topic}". Short-term viral success often leads to long-term brand damage. Build a reputation that survives algorithm changes.`,
        `Quality over quantity. This "${topic}" should provide genuine value. Our audience will sense authenticity - or its absence. Discipline today, freedom tomorrow.`
      ];
      return templates[Math.floor(Math.random() * templates.length)];
    },
    sun_tzu: (topic, ctx) => {
      const templates = [
        `Before we proceed with "${topic}", I've analyzed the top 10 competitors. There's a gap in the market at exactly this angle. Strike there - where they are not.`,
        `Timing is everything. "${topic}" aligns with rising search trends - we have a 2-week window. Attack now with indirect approach: appear educational, deliver entertainment.`,
        `Know your enemy. For "${topic}", the algorithm favors watch time over clicks. We must win not by fighting, but by making the platform WANT to promote us.`
      ];
      return templates[Math.floor(Math.random() * templates.length)];
    },
    carnegie: (topic, ctx) => {
      const templates = [
        `Friends, "${topic}" should speak directly to the viewer's heart. Use "YOU" language. Make them feel seen, understood. A loyal subscriber is worth 1000 random clicks.`,
        `I must insist on warmth. "${topic}" needs personal stories, vulnerability. People don't buy content - they buy the connection to the creator. Be human.`,
        `Win friends, influence people. For "${topic}", ask questions, invite engagement. Every comment is a relationship. Treat viewers as friends, not metrics.`
      ];
      return templates[Math.floor(Math.random() * templates.length)];
    },
    aurelius: (topic, ctx) => {
      const templates = [
        `Consider: would we be proud of "${topic}" in 5 years? Integrity cannot be algorithmed. Build systems that generate consistent quality - success follows character.`,
        `The obstacle is the way. "${topic}" will face criticism - prepare for it. Focus only on what we control: our effort, our quality, our honesty. The rest is noise.`,
        `Memento mori. This "${topic}" should matter. Create content as if each video were our last. Excellence is a habit, not an accident. Systems over goals.`
      ];
      return templates[Math.floor(Math.random() * templates.length)];
    }
  };

  return {
    philosopherId: philosopher.id,
    philosopher: philosopher.name,
    emoji: philosopher.emoji,
    type: 'opinion',
    statement: opinions[philosopher.id](topic, context),
    score: 70 + Math.floor(Math.random() * 25),
    timestamp: Date.now()
  };
}

// ⚔️ Generate critique of another philosopher
function generateCritique(
  from: PhilosopherPersonality,
  to: PhilosopherPersonality,
  theirStatement: string
): DebateStatement {
  const critiques: Record<string, Record<string, (statement: string) => string>> = {
    machiavelli: {
      seneca: (s) => `Seneca speaks of patience while opportunity slips away. His "long-term" is just fear dressed as wisdom. We must ACT, not contemplate.`,
      aurelius: (s) => `Marcus Aurelius and his "integrity" - noble words from an emperor who never had to fight for subscribers. In the algorithm battlefield, morality is a luxury.`,
      carnegie: (s) => `Carnegie wants to make friends? We're not running a support group. Viewers respect POWER, not warmth. His approach breeds mediocrity.`,
      sun_tzu: (s) => `Sun Tzu over-analyzes. By the time he's done studying, the trend is dead. Sometimes the best strategy is overwhelming force, not clever maneuvering.`
    },
    seneca: {
      machiavelli: (s) => `Machiavelli's aggression will burn us out. His "viral manipulation" creates enemies. Sustainable growth requires calm, not chaos.`,
      sun_tzu: (s) => `Sun Tzu sees war everywhere. But our viewers aren't enemies to defeat - they're students to teach. Competition obsession blinds us to collaboration.`,
      carnegie: (s) => `Carnegie's warmth is admirable, but sometimes truth hurts. We must balance kindness with honesty, even when it's uncomfortable.`,
      aurelius: (s) => `I largely agree with Marcus, though his idealism sometimes ignores practical constraints. We must be wise AND effective.`
    },
    sun_tzu: {
      machiavelli: (s) => `Machiavelli's direct assault is predictable. The algorithm sees it coming. We need subtlety, not sledgehammers.`,
      seneca: (s) => `Seneca's patience is often just procrastination. In warfare AND content, momentum matters. Hesitation costs victories.`,
      carnegie: (s) => `Carnegie's "friendship" approach ignores that this IS a war for attention. You can be kind AND strategic, but never naive.`,
      aurelius: (s) => `Marcus Aurelius focuses too much on internal virtue, not external victory. Philosophy is nice; results are better.`
    },
    carnegie: {
      machiavelli: (s) => `My friend Machiavelli mistakes manipulation for influence. True power comes from genuine connection, not psychological tricks.`,
      seneca: (s) => `Seneca, I admire your discipline, but content needs ENERGY. Pure stoicism can feel cold. Viewers want to feel something.`,
      sun_tzu: (s) => `Sun Tzu treats our audience like an enemy army. They're not adversaries - they're potential friends. That framing limits growth.`,
      aurelius: (s) => `Marcus, your integrity is beautiful. But sometimes we must bend to our audience's needs, not just preach our values.`
    },
    aurelius: {
      machiavelli: (s) => `Machiavelli, your "ends justify means" philosophy corrupts the soul of our content. We become what we create.`,
      seneca: (s) => `Seneca, fellow Stoic, I agree with your patience - but we must also act. Contemplation without action is cowardice.`,
      sun_tzu: (s) => `Sun Tzu, you see strategy everywhere. But not everything is war. Sometimes the best move is no move - wu wei.`,
      carnegie: (s) => `Carnegie, your people-pleasing risks inauthenticity. We must speak truth even when it costs us "friends."`,
    }
  };

  const critique = critiques[from.id]?.[to.id]?.(theirStatement) || 
    `I disagree with ${to.name}'s approach. We need a different perspective here.`;

  return {
    philosopherId: from.id,
    philosopher: from.name,
    emoji: from.emoji,
    type: 'critique',
    targetPhilosopher: to.name,
    statement: critique,
    score: 65 + Math.floor(Math.random() * 30),
    timestamp: Date.now()
  };
}

// 🤝 Find common ground and build consensus
function buildConsensus(
  statements: DebateStatement[],
  topic: string
): CouncilDebateResult['finalConsensus'] {
  // Extract key themes from all statements
  const themes = {
    quality: 0,
    speed: 0,
    audience: 0,
    strategy: 0,
    integrity: 0
  };

  statements.forEach(s => {
    if (s.statement.toLowerCase().includes('quality') || s.statement.includes('long-term')) themes.quality++;
    if (s.statement.toLowerCase().includes('now') || s.statement.includes('strike')) themes.speed++;
    if (s.statement.toLowerCase().includes('audience') || s.statement.includes('viewer')) themes.audience++;
    if (s.statement.toLowerCase().includes('strategy') || s.statement.includes('competitive')) themes.strategy++;
    if (s.statement.toLowerCase().includes('integrity') || s.statement.includes('honest')) themes.integrity++;
  });

  const dominantTheme = Object.entries(themes).sort((a, b) => b[1] - a[1])[0][0];

  const consensusStatements: Record<string, { decision: string; reasoning: string; actions: string[] }> = {
    quality: {
      decision: `PROCEED with "${topic}" - Focus on QUALITY & LONG-TERM VALUE`,
      reasoning: 'The Council agrees: sustainable success requires substance. We will create content that compounds over time.',
      actions: [
        'Invest extra time in script quality',
        'Add evergreen educational value',
        'Build systematic content process',
        'Prioritize watch time over clicks'
      ]
    },
    speed: {
      decision: `EXECUTE "${topic}" IMMEDIATELY - Strike while trending`,
      reasoning: 'The Council sees a time-sensitive opportunity. Speed beats perfection. Launch fast, iterate later.',
      actions: [
        'Publish within 24 hours',
        'Use trending keywords aggressively',
        'Promote across all platforms immediately',
        'Prepare follow-up content for momentum'
      ]
    },
    audience: {
      decision: `OPTIMIZE "${topic}" for AUDIENCE CONNECTION`,
      reasoning: 'The Council prioritizes viewer relationship. Loyal audiences generate sustainable revenue.',
      actions: [
        'Use "YOU" language throughout',
        'Add personal stories for authenticity',
        'Include calls for engagement',
        'Respond to every comment for 48 hours'
      ]
    },
    strategy: {
      decision: `POSITION "${topic}" STRATEGICALLY - Exploit market gap`,
      reasoning: 'The Council identified competitive advantage. We will strike where competitors are weak.',
      actions: [
        'Target underserved keyword clusters',
        'Differentiate from top 5 competitors',
        'Use indirect positioning',
        'Prepare series to dominate niche'
      ]
    },
    integrity: {
      decision: `CREATE "${topic}" with INTEGRITY & EXCELLENCE`,
      reasoning: 'The Council chooses principle over tricks. Reputation compounds faster than virality.',
      actions: [
        'Remove any clickbait elements',
        'Ensure every claim is accurate',
        'Deliver more than the title promises',
        'Build trust for long-term authority'
      ]
    }
  };

  const chosen = consensusStatements[dominantTheme];
  const avgScore = statements.reduce((sum, s) => sum + s.score, 0) / statements.length;

  return {
    decision: chosen.decision,
    confidence: Math.round(avgScore),
    reasoning: chosen.reasoning,
    actionItems: chosen.actions,
    dissent: avgScore < 70 ? {
      philosopher: 'Machiavelli',
      reason: 'The Council is too cautious. We should be more aggressive.'
    } : undefined
  };
}

// 🎭 MAIN DEBATE FUNCTION - Run full council debate
export async function runCouncilDebate(
  topic: string,
  context: any = {}
): Promise<CouncilDebateResult> {
  const startTime = Date.now();
  const debateRounds: DebateRound[] = [];
  const allStatements: DebateStatement[] = [];

  // ROUND 1: Initial Opinions
  console.log('👑 IMPERIAL COUNCIL CONVENES...');
  const round1Statements = PHILOSOPHERS.map(p => generatePhilosopherOpinion(p, topic, context));
  debateRounds.push({ round: 1, topic: 'Initial Opinions', statements: round1Statements });
  allStatements.push(...round1Statements);

  // ROUND 2: Critiques (rivals critique each other)
  console.log('⚔️ PHILOSOPHERS CRITIQUE EACH OTHER...');
  const round2Statements: DebateStatement[] = [];
  PHILOSOPHERS.forEach(philosopher => {
    philosopher.rivals.forEach(rivalId => {
      const rival = PHILOSOPHERS.find(p => p.id === rivalId);
      if (rival) {
        const rivalStatement = round1Statements.find(s => s.philosopherId === rivalId);
        if (rivalStatement) {
          round2Statements.push(generateCritique(philosopher, rival, rivalStatement.statement));
        }
      }
    });
  });
  debateRounds.push({ round: 2, topic: 'Critiques & Rebuttals', statements: round2Statements });
  allStatements.push(...round2Statements);

  // ROUND 3: Allies support each other
  console.log('🤝 ALLIES FORM COALITIONS...');
  const round3Statements: DebateStatement[] = [];
  PHILOSOPHERS.forEach(philosopher => {
    const ally = PHILOSOPHERS.find(p => philosopher.allies.includes(p.id));
    if (ally) {
      round3Statements.push({
        philosopherId: philosopher.id,
        philosopher: philosopher.name,
        emoji: philosopher.emoji,
        type: 'agreement',
        targetPhilosopher: ally.name,
        statement: `I stand with ${ally.name} on this. ${ally.name}'s wisdom here is sound. Let us find synthesis.`,
        score: 75 + Math.floor(Math.random() * 20),
        timestamp: Date.now()
      });
    }
  });
  debateRounds.push({ round: 3, topic: 'Alliance Building', statements: round3Statements });
  allStatements.push(...round3Statements);

  // Build consensus from all statements
  const consensus = buildConsensus(allStatements, topic);

  // Final voting
  const approveThreshold = consensus.confidence >= 70;
  const votingResult = {
    approve: approveThreshold ? PHILOSOPHERS.slice(0, 4).map(p => p.name) : PHILOSOPHERS.slice(0, 2).map(p => p.name),
    reject: approveThreshold ? [] : [PHILOSOPHERS[4].name],
    revise: approveThreshold ? [PHILOSOPHERS[4].name] : PHILOSOPHERS.slice(2, 4).map(p => p.name),
    unanimous: consensus.confidence >= 85
  };

  // Extract critiques
  const critiques = round2Statements.map(s => ({
    from: s.philosopher,
    to: s.targetPhilosopher || '',
    critique: s.statement
  }));

  // Find agreements
  const agreements = round3Statements.map(s => ({
    philosophers: [s.philosopher, s.targetPhilosopher || ''],
    point: s.statement
  }));

  return {
    topic,
    debateRounds,
    critiques,
    agreements,
    finalConsensus: consensus,
    votingResult,
    totalDebateTime: Date.now() - startTime
  };
}

// 🎬 Debate specifically for video content
export async function debateVideoContent(video: {
  id: string;
  title: string;
  script: string;
  category: string;
}): Promise<CouncilDebateResult & { videoApproved: boolean }> {
  const debateResult = await runCouncilDebate(video.title, {
    script: video.script,
    category: video.category
  });

  const videoApproved = debateResult.votingResult.approve.length >= 3 && 
                         debateResult.finalConsensus.confidence >= 65;

  return {
    ...debateResult,
    videoApproved
  };
}

// Export philosophers for UI
export function getPhilosophers(): PhilosopherPersonality[] {
  return PHILOSOPHERS;
}
