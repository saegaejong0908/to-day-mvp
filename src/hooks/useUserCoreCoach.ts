"use client";

import { useEffect, useState } from "react";

import { loadJSON, saveJSON } from "@/lib/storage/localStore";
import type { CoreCoach } from "@/types/coach";

const USER_CORE_KEY_PREFIX = "toDay.userCoreCoach.v1";

function getCoreKey(userId: string | undefined) {
  return userId ? `${USER_CORE_KEY_PREFIX}.${userId}` : null;
}

export function useUserCoreCoach(userId?: string) {
  const [coreCoach, setCoreCoachState] = useState<CoreCoach | null>(null);
  const [initialized, setInitialized] = useState(false);
  const storageKey = getCoreKey(userId);

  useEffect(() => {
    if (!storageKey) {
      setInitialized(true);
      return;
    }
    const savedCore = loadJSON<CoreCoach | null>(storageKey, null);
    setCoreCoachState(savedCore);
    setInitialized(true);
  }, [storageKey]);

  const setCoreCoach = (nextCore: CoreCoach) => {
    if (!storageKey) return;
    setCoreCoachState(nextCore);
    saveJSON(storageKey, nextCore);
  };

  return {
    coreCoach,
    setCoreCoach,
    initialized,
  };
}
