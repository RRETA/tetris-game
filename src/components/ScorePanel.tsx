import { memo } from 'react';

interface ScorePanelProps {
  score: number;
  lines: number;
  level: number;
}

interface StatBoxProps {
  label: string;
  value: number | string;
}

const StatBox = memo(function StatBox({ label, value }: StatBoxProps) {
  return (
    <div className="stat-card">
      <dt className="stat-card__label">{label}</dt>
      <dd className="stat-card__value">{value}</dd>
    </div>
  );
});

export const ScorePanel = memo(function ScorePanel({ score, lines, level }: ScorePanelProps) {
  return (
    <section className="score-panel" aria-labelledby="score-title">
      <h2 id="score-title" className="panel-title">
        Scoreboard
      </h2>
      <dl className="score-panel__stats" aria-live="polite">
        <StatBox label="Score" value={score.toLocaleString()} />
        <StatBox label="Lines" value={lines} />
        <StatBox label="Level" value={level} />
      </dl>
    </section>
  );
});
