import { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { FiVideo, FiVideoOff, FiMic, FiMicOff } from 'react-icons/fi';

const WebcamPanel = () => {
  const webcamRef = useRef(null);
  const [videoOn, setVideoOn] = useState(true);
  const [audioOn, setAudioOn] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="relative rounded-2xl overflow-hidden bg-surface-light border border-surface-border aspect-video">
      {videoOn && !error ? (
        <Webcam
          ref={webcamRef}
          audio={false}
          mirrored
          className="w-full h-full object-cover"
          onUserMediaError={() => setError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
          {error ? 'Camera unavailable' : 'Camera off'}
        </div>
      )}

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <button
          onClick={() => setVideoOn((v) => !v)}
          className={`w-9 h-9 rounded-full flex items-center justify-center ${videoOn ? 'bg-surface-border text-white' : 'bg-rose-600 text-white'}`}
        >
          {videoOn ? <FiVideo /> : <FiVideoOff />}
        </button>
        <button
          onClick={() => setAudioOn((a) => !a)}
          className={`w-9 h-9 rounded-full flex items-center justify-center ${audioOn ? 'bg-surface-border text-white' : 'bg-rose-600 text-white'}`}
        >
          {audioOn ? <FiMic /> : <FiMicOff />}
        </button>
      </div>
    </div>
  );
};

export default WebcamPanel;
