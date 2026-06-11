import StatusPanel from "./StatusPanel";

interface Props {
  onClose: () => void;
}

/** The engine room as a deck overlay — no navigation, no reload. */
export default function StatusModal({ onClose }: Props): React.ReactElement {
  return (
    <div
      className="ov-backdrop"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="window status-modal ov-window" role="dialog" aria-label="system status">
        <div className="window-bar">
          <span>jxn-000 — system status</span>
          <span className="win-controls">
            <button className="win-close" onClick={onClose} aria-label="close">
              ×
            </button>
          </span>
        </div>
        <StatusPanel />
      </div>
    </div>
  );
}
