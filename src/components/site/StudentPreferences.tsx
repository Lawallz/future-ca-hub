import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
const key = "caads-student-preferences-v1";
type Preferences = { period: number; favorites: number[] };
type Context = Preferences & {
  setPeriod: (period: number) => void;
  toggleFavorite: (period: number) => void;
};
const StudentContext = createContext<Context | null>(null);
function valid(value: unknown): Preferences {
  const data = value as Partial<Preferences> | null;
  return {
    period:
      Number.isInteger(data?.period) && data!.period! >= 0 && data!.period! <= 6
        ? data!.period!
        : 0,
    favorites: Array.isArray(data?.favorites)
      ? [...new Set(data.favorites.filter((n) => Number.isInteger(n) && n >= 1 && n <= 6))]
      : [],
  };
}
export function StudentPreferences({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>({ period: 0, favorites: [] });
  const current = useRef(preferences);
  current.current = preferences;
  useEffect(() => {
    try {
      setPreferences(valid(JSON.parse(localStorage.getItem(key) || "null")));
    } catch {
      /* Storage is optional. */
    }
    const sync = (event: StorageEvent) => {
      if (event.key === key) {
        try {
          setPreferences(valid(JSON.parse(event.newValue || "null")));
        } catch {
          /* Ignore corrupt data. */
        }
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  function update(change: (current: Preferences) => Preferences) {
    const next = change(current.current);
    current.current = next;
    setPreferences(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* Keep the session usable. */
    }
  }
  return (
    <StudentContext.Provider
      value={{
        ...preferences,
        setPeriod: (period) => update((current) => ({ ...current, period })),
        toggleFavorite: (period) =>
          update((current) => ({
            ...current,
            favorites: current.favorites.includes(period)
              ? current.favorites.filter((n) => n !== period)
              : [...current.favorites, period],
          })),
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}
// Shared selection keeps the materials and schedule sections in sync.
// eslint-disable-next-line react-refresh/only-export-components
export function useStudentPreferences() {
  const context = useContext(StudentContext);
  if (!context) throw new Error("StudentPreferences is required");
  return context;
}
export function PeriodPicker() {
  const { period, setPeriod } = useStudentPreferences();
  return (
    <div
      className="period-picker"
      role="group"
      aria-label="Filtrar materiais e horários por período"
    >
      {[0, 1, 2, 3, 4, 5, 6].map((n) => (
        <button key={n} type="button" aria-pressed={period === n} onClick={() => setPeriod(n)}>
          {n ? `${n}º` : "Todos"}
        </button>
      ))}
    </div>
  );
}
