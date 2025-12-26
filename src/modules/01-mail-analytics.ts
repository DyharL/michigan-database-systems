/**
 * Module 01: Mail Log Analytics & Regular Expression Text Mining
 * High-throughput email log parser extracting sender domains, hourly traffic distribution,
 * and user message frequency histograms using optimized regex parsing.
 */

export interface MailLogSummary {
  totalMessages: number;
  senders: Record<string, number>;
  hourlyDistribution: Record<string, number>;
  topSender: { email: string; count: number };
}

export function parseMailLogs(rawLogText: string): MailLogSummary {
  const lines = rawLogText.split('\n');
  const senders: Record<string, number> = {};
  const hourlyDistribution: Record<string, number> = {};
  let totalMessages = 0;

  // Regex pattern matching mbox "From " separator lines:
  // e.g., "From stephen.marquard@uct.ac.za Sat Jan  5 09:14:16 2008"
  const fromRegex = /^From\s+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\s+.*?\s+(\d{2}):\d{2}:\d{2}\s+\d{4}/;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('From ')) continue;

    const match = trimmed.match(fromRegex);
    if (!match) continue;

    const [, email, hour] = match;
    totalMessages++;

    senders[email] = (senders[email] || 0) + 1;
    hourlyDistribution[hour] = (hourlyDistribution[hour] || 0) + 1;
  }

  // Find top sender
  let topSender = { email: '', count: 0 };
  for (const [email, count] of Object.entries(senders)) {
    if (count > topSender.count) {
      topSender = { email, count };
    }
  }

  return {
    totalMessages,
    senders,
    hourlyDistribution,
    topSender
  };
}
