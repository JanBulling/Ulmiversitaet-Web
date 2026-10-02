"use client";

import * as React from "react";

type Status = "IDLE" | "LOADING" | "ERROR" | "SUCCESS";

const POLL_INTERVAL = 15_000;

/**
 * Loads `fetchData(key)` and refreshes it every 15 s (paused while the tab is
 * hidden). `countdown` keeps ticking every second, measured from the time of
 * the fetch, so it doesn't drift when the browser throttles timers.
 *
 * `fetchData` must be stable (e.g. defined at module level).
 * `key === undefined` means idle: nothing is fetched.
 */
export function useLiveCountdowns<K, T extends { countdown: number }>(
  key: K | undefined,
  fetchData: (key: K) => Promise<T[]>,
  initialItems?: T[],
) {
  const [state, setState] = React.useState(() => ({
    items: initialItems ?? [],
    fetchedAt: Date.now(),
    status: (initialItems ? "SUCCESS" : "IDLE") as Status,
  }));
  const [now, setNow] = React.useState(() => Date.now());

  React.useEffect(() => {
    if (key === undefined) return;

    // Drops responses that arrive after the key changed
    let ignore = false;

    async function load(showLoading: boolean) {
      if (showLoading) setState((s) => ({ ...s, status: "LOADING" }));
      try {
        const items = await fetchData(key as K);
        if (!ignore)
          setState({ items, fetchedAt: Date.now(), status: "SUCCESS" });
      } catch (error) {
        console.error("[useLiveCountdowns]", error);
        if (!ignore) setState((s) => ({ ...s, status: "ERROR" }));
      }
    }

    function refreshIfVisible() {
      if (!document.hidden) load(false);
    }

    load(true);
    const pollInterval = setInterval(refreshIfVisible, POLL_INTERVAL);
    document.addEventListener("visibilitychange", refreshIfVisible);

    return () => {
      ignore = true;
      clearInterval(pollInterval);
      document.removeEventListener("visibilitychange", refreshIfVisible);
    };
  }, [key, fetchData]);

  React.useEffect(() => {
    const tickInterval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tickInterval);
  }, []);

  if (key === undefined) return { items: [] as T[], status: "IDLE" as Status };

  const elapsed = Math.max(0, Math.round((now - state.fetchedAt) / 1000));
  return {
    items: state.items.map((item) => ({
      ...item,
      countdown: item.countdown - elapsed,
    })),
    status: state.status,
  };
}
