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
    dart: { x: 0.804, y: 0.334, w: 0.105, h: 0.185 },
    memo: { x: 0.831, y: 0.255, w: 0.205, h: 0.315 },
  },
  mobile: {
    dart: { x: 0.64, y: 0.33, w: 0.13, h: 0.19 },
    memo: { x: 0.74, y: 0.25, w: 0.23, h: 0.33 },
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
    return hotspots.desktop;
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
          onClick={(e) => {
            const params = new URLSearchParams(window.location.search);
            const debug = params.get("debugHotspots") === "1";
            if (!debug) return;

            const rect = e.currentTarget.getBoundingClientRect();
            const nx = (e.clientX - rect.left) / rect.width;
            const ny = (e.clientY - rect.top) / rect.height;

            console.log("좌표:", {
              x: Number(nx.toFixed(3)),
              y: Number(ny.toFixed(3)),
            });
          }}
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
            style={{ ...toStyle(activeHotspots.dart), pointerEvents: "none" }}
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
            style={{ ...toStyle(activeHotspots.memo), pointerEvents: "none" }}
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
