"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const [isMobile, setIsMobile] = useState(false);
  const [hotspots, setHotspots] = useState<HotspotConfig>(defaultHotspots);
  const [aspect, setAspect] = useState(16 / 9);
  const [frameWidth, setFrameWidth] = useState(0);
  const debugHotspots = searchParams.get("debugHotspots") === "1";

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

  useEffect(() => {
    let alive = true;
    const img = new window.Image();
    img.src = "/scene/room/bg.png";
    img.onload = () => {
      if (!alive || !img.naturalWidth || !img.naturalHeight) return;
      setAspect(img.naturalWidth / img.naturalHeight);
    };
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const updateFrame = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const width = Math.min(vw, vh * aspect);
      setFrameWidth(width);
    };
    updateFrame();
    window.addEventListener("resize", updateFrame);
    return () => window.removeEventListener("resize", updateFrame);
  }, [aspect]);

  const activeGoal = pathname === "/goal";
  const activeTodo = pathname === "/todo";
  const activeHotspots = useMemo(() => {
    if (isMobile) {
      return hotspots.mobile;
    }
    return {
      dart: { x: 0.68, y: 0.33, w: 0.1, h: 0.18 },
      memo: { x: 0.79, y: 0.26, w: 0.16, h: 0.3 },
    };
  }, [hotspots, isMobile]);

  const frameHeight = frameWidth > 0 ? frameWidth / aspect : 0;

  return (
    <>
      <div className="scene-root">
        <Image src="/scene/room/bg.png" alt="" fill className="scene-side-fill" sizes="100vw" priority />
        <div
          className="scene-center"
          style={{
            width: frameWidth ? `${frameWidth}px` : undefined,
            height: frameHeight ? `${frameHeight}px` : undefined,
          }}
        >
          <Image src="/scene/room/bg.png" alt="" fill className="scene-bg" sizes="100vw" priority />
        </div>
      </div>

      <div className="scene-hit-root">
        <div
          className="scene-center"
          style={{
            width: frameWidth ? `${frameWidth}px` : undefined,
            height: frameHeight ? `${frameHeight}px` : undefined,
          }}
        >
          <button
            type="button"
            onClick={() => {
              console.log("dart click");
              router.push("/goal?panel=open");
            }}
            className={["hotspot dart", activeGoal ? "room-hotspot-active" : "", debugHotspots ? "hotspot-debug" : ""].join(" ").trim()}
            style={toStyle(activeHotspots.dart)}
            aria-label="목표 탭으로 이동"
            aria-current={activeGoal ? "page" : undefined}
          >
            <Image src="/scene/room/dart.png" alt="" fill className="object-contain pointer-events-none" sizes="180px" />
            {debugHotspots ? (
              <span className="pointer-events-none absolute inset-0 border-2 border-dashed border-yellow-400" />
            ) : null}
          </button>

          <button
            type="button"
            onClick={() => {
              console.log("memo click");
              router.push("/todo?panel=open");
            }}
            className={["hotspot memo", activeTodo ? "room-hotspot-active" : "", debugHotspots ? "hotspot-debug" : ""].join(" ").trim()}
            style={toStyle(activeHotspots.memo)}
            aria-label="투두 탭으로 이동"
            aria-current={activeTodo ? "page" : undefined}
          >
            <Image src="/scene/room/memo.png" alt="" fill className="object-contain pointer-events-none" sizes="220px" />
            {debugHotspots ? (
              <span className="pointer-events-none absolute inset-0 border-2 border-dashed border-yellow-400" />
            ) : null}
          </button>
        </div>
      </div>
    </>
  );
}
