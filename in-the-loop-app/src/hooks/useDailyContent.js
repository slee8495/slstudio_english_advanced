import { useEffect, useState } from "react";
import { readJSON, writeJSON } from "../utils/storage";
import { getSeedDailyContent } from "../data/seedContent";

// Cached per calendar day so revisiting the same day never re-triggers
// generation (cost control) and past days stay reproducible.
export function useDailyContent(dayNum, dateKey) {
  const [content, setContent] = useState(() => readJSON(`content_${dateKey}`, null));
  const [loading, setLoading] = useState(!content);

  useEffect(() => {
    let cancelled = false;
    const cached = readJSON(`content_${dateKey}`, null);
    if (cached) {
      setContent(cached);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    fetch(`/api/daily-content?day=${dayNum}&date=${dateKey}`)
      .then((res) => {
        if (!res.ok) throw new Error("bad response");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setContent(data);
        writeJSON(`content_${dateKey}`, data);
      })
      .catch(() => {
        if (cancelled) return;
        setContent(getSeedDailyContent(dayNum));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [dayNum, dateKey]);

  return { content, loading };
}
