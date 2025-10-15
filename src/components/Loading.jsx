import { UI_LABELS } from '../constants/labels';

function Loading() {
  return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>{UI_LABELS.LOADING_MESSAGE}</p>
      </div>
  );
}

export default Loading;
