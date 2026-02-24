"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Hotspot = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type HotspotConfig = {
  desktop: { dart: Hotspot; memo: Hotspot };
  mobile: { dart: Hotspot; memo: Hotspot };
};

const defaultHotspots: HotspotConfig = {
  desktop: {
    dart: { x: 0.08, y: 0.16, w: 0.12, h: 0.2 },
    memo: { x: 0.82, y: 0.14, w: 0.13, h: 0.2 },
  },
  mobile: {
    dart: { x: 0.06, y: 0.08, w: 0.18, h: 0.16 },
    memo: { x: 0.76, y: 0.08, w: 0.18, h: 0.16 },
  },
};

function toStyle(hotspot: Hotspot) {
  return {
    left: `${hotspot.x * 100}%`,
    top: `${hotspot.y * 100}%`,
    width: `${hotspot.w * 100}%`,
    height: `${hotspot.h * 100}%`,
  };
}

export default function RoomScene() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [hotspots, setHotspots] = useState<HotspotConfig>(defaultHotspots);

  useEffect(() => {
    let alive = true;

    const loadHotspots = async () => {
      try {
        const response = await fetch("/scene/room/hotspots.json", { cache: "no-store" });
        if (!response.ok) return;
        const json = (await response.json()) as HotspotConfig;
        if (!alive) return;
        if (json?.desktop?.dart && json?.desktop?.memo && json?.mobile?.dart && json?.mobile?.memo) {
          setHotspots(json);
        }
      } catch {
        // Use default hotspots when JSON read fails.
      }
    };

    loadHotspots();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const activeGoal = pathname === "/goal";
  const activeTodo = pathname === "/todo";
  const activeHotspots = useMemo(() => (isMobile ? hotspots.mobile : hotspots.desktop), [hotspots, isMobile]);

  return (
    <div className="scene-root">
      <Image src="/scene/room/bg.png" alt="" fill className="scene-side-fill" sizes="100vw" priority />

      <div className="scene-center">
        <Image src="/scene/room/bg.png" alt="" fill className="scene-bg" sizes="100vw" priority />

        <button
          type="button"
          onClick={() => router.push("/goal?panel=open")}
          className={["hotspot dart", activeGoal ? "room-hotspot-active" : ""].join(" ").trim()}
          style={toStyle(activeHotspots.dart)}
          aria-label="목표 탭으로 이동"
        >
          <Image src="/scene/room/dart.png" alt="" fill className="object-contain" sizes="180px" />
        </button>

        <button
          type="button"
          onClick={() => router.push("/todo?panel=open")}
          className={["hotspot memo", activeTodo ? "room-hotspot-active" : ""].join(" ").trim()}
          style={toStyle(activeHotspots.memo)}
          aria-label="투두 탭으로 이동"
        >
          <Image src="/scene/room/memo.png" alt="" fill className="object-contain" sizes="180px" />
        </button>
      </div>
    </div>
  );
}
