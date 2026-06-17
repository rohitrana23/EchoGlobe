import { useEffect, useRef } from "react";

type Station = {
  name: string;
  urlResolved: string;
};

type Props = {
  station: Station | null;
};
export default function AudioPlayer({ station }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    if (audioRef.current && station) {
      audioRef.current.load();

      audioRef.current
        .play()
        .catch((err) =>
          console.error("Playback failed:", err)
        );
    }
  }, [station]);
  if (!station) {
    return (
      <div className="h-20 border-t flex items-center px-4">
        Select a station
      </div>
    );
  }
  return (
    <div className="h-24 border-t bg-white flex flex-col justify-center px-4">
      <h3 className="font-bold">
        {station.name}
      </h3>

      <audio
        ref={audioRef}
        controls
        className="w-full"
      >
        <source
          src={station.urlResolved}
          type="audio/mpeg"
        />
      </audio>
    </div>
  );
}