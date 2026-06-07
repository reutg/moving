"use client";

import { useEffect, useState } from "react";
import type { Box } from "@/features/boxes";
import type { ApiResponse } from "@/lib/api/response";

export default function HomePage() {
  const [boxes, setBoxes] = useState<Box[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/boxes")
      .then((res) => res.json() as Promise<ApiResponse<Box[]>>)
      .then((payload) => {
        if (cancelled) return;
        if (payload.ok) setBoxes(payload.data);
        else setError(payload.error.message);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <main className="container">
        <h1>Moving</h1>
        <p className="error">Error: {error}</p>
      </main>
    );
  }

  if (boxes === null) {
    return (
      <main className="container">
        <h1>Moving</h1>
        <p>Loading…</p>
      </main>
    );
  }

  const byStatus = countBy(boxes, (b) => b.status);
  const byPriority = countBy(boxes, (b) => b.priority);

  return (
    <main className="container">
      <h1>Moving</h1>

      <section className="cards">
        <Stat label="Total boxes" value={boxes.length} />
        <Stat
          label="By status"
          value={formatCounts(byStatus)}
        />
        <Stat
          label="By priority"
          value={formatCounts(byPriority)}
        />
      </section>

      <section>
        <h2>Boxes</h2>
        {boxes.length === 0 ? (
          <p>No boxes yet. POST to /api/boxes to add one.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Destination</th>
                <th>Status</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {boxes.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.name}</td>
                  <td>{b.destinationRoom ?? "—"}</td>
                  <td>{b.status}</td>
                  <td>{b.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card">
      <div className="card-label">{label}</div>
      <div className="card-value">{value}</div>
    </div>
  );
}

function countBy<T, K extends string>(
  items: T[],
  key: (item: T) => K,
): Record<K, number> {
  const out = {} as Record<K, number>;
  for (const item of items) {
    const k = key(item);
    out[k] = (out[k] ?? 0) + 1;
  }
  return out;
}

function formatCounts(counts: Record<string, number>): string {
  const entries = Object.entries(counts);
  if (entries.length === 0) return "—";
  return entries.map(([k, v]) => `${k}: ${v}`).join(", ");
}
