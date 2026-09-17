import { MapPin } from "lucide-react";
import { DISTRICTS } from "../types";
import type { District } from "../types";

interface ProblemMapProps {
  counts: Record<District, number>;
}

function intensityClass(count: number, max: number): string {
  if (max === 0) return "map-tile-0";
  const ratio = count / max;
  if (ratio === 0) return "map-tile-0";
  if (ratio < 0.25) return "map-tile-1";
  if (ratio < 0.5) return "map-tile-2";
  if (ratio < 0.75) return "map-tile-3";
  return "map-tile-4";
}

export default function ProblemMap({ counts }: ProblemMapProps) {
  const max = Math.max(1, ...DISTRICTS.map((d) => counts[d] ?? 0));

  return (
    <div className="problem-map">
      <div className="problem-map-legend">
        <MapPin size={14} /> Hududlar bo'yicha faol murojaatlar zichligi (sxematik)
      </div>
      <div className="problem-map-grid">
        {DISTRICTS.map((d) => (
          <div key={d} className={"map-tile " + intensityClass(counts[d] ?? 0, max)}>
            <span className="map-tile-count">{counts[d] ?? 0}</span>
            <span className="map-tile-name">{d}</span>
          </div>
        ))}
      </div>
      <div className="problem-map-scale">
        <span>Kam</span>
        <span className="scale-dot map-tile-0" />
        <span className="scale-dot map-tile-1" />
        <span className="scale-dot map-tile-2" />
        <span className="scale-dot map-tile-3" />
        <span className="scale-dot map-tile-4" />
        <span>Ko'p</span>
      </div>
    </div>
  );
}
