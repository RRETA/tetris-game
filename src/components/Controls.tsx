import { memo } from 'react';

interface ControlsProps {
  onLeft: () => void;
  onRight: () => void;
  onDown: () => void;
  onRotate: () => void;
  onDrop: () => void;
  onPause: () => void;
  onRestart: () => void;
  paused: boolean;
  gameOver: boolean;
}

interface ControlButtonProps {
  label: string;
  ariaLabel: string;
  onClick: () => void;
  subLabel?: string;
  wide?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

const ControlButton = memo(function ControlButton({
  label,
  ariaLabel,
  onClick,
  subLabel,
  wide = false,
  disabled = false,
  variant = 'primary',
}: ControlButtonProps) {
  return (
    <button
      type="button"
      className={`control-button control-button--${variant}${wide ? ' control-button--wide' : ''}`}
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="control-button__label">{label}</span>
      {subLabel ? <span className="control-button__sub-label">{subLabel}</span> : null}
    </button>
  );
});

export const Controls = memo(function Controls({
  onLeft,
  onRight,
  onDown,
  onRotate,
  onDrop,
  onPause,
  onRestart,
  paused,
  gameOver,
}: ControlsProps) {
  return (
    <section className="controls-card" aria-labelledby="controls-title">
      <h2 id="controls-title" className="panel-title">
        Controls
      </h2>

      <div className="controls-grid" aria-label="Touch controls">
        <div className="controls-grid__row controls-grid__row--center">
          <ControlButton label="↑" subLabel="Rotate" ariaLabel="Rotate piece" onClick={onRotate} disabled={gameOver} />
        </div>

        <div className="controls-grid__row controls-grid__row--three">
          <ControlButton label="←" ariaLabel="Move piece left" onClick={onLeft} disabled={gameOver} />
          <ControlButton label="↓" subLabel="Down" ariaLabel="Soft drop piece" onClick={onDown} disabled={gameOver} />
          <ControlButton label="→" ariaLabel="Move piece right" onClick={onRight} disabled={gameOver} />
        </div>

        <ControlButton
          label="Hard drop"
          ariaLabel="Hard drop piece"
          onClick={onDrop}
          disabled={gameOver}
          wide
        />
      </div>

      <div className="controls-actions">
        <ControlButton
          label={paused ? 'Resume' : 'Pause'}
          ariaLabel={paused ? 'Resume game' : 'Pause game'}
          onClick={onPause}
          disabled={gameOver}
          variant="secondary"
          wide
        />
        <ControlButton label="Restart" ariaLabel="Restart game" onClick={onRestart} variant="secondary" wide />
      </div>
    </section>
  );
});
