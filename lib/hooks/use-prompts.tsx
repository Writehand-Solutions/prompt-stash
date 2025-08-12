/**
 * Prompt Management Global Local State
 *
 * - Initializes from /api/prompts
 * - Persists to localStorage
 * - Background refresh: HEAD /api/prompts every 60s
 *   If `x-prompts-version` changes, re-fetches prompts.
 */

"use client";

import { useCallback, useEffect, useRef } from "react";
import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { z } from "zod";

import {
  PromptStructure,
  promptStructureSchema,
} from "@/lib/data/validator";

/* -------------------- types & config -------------------- */

type Config = {
  selected: PromptStructure["id"] | null;
  isInitialized: boolean;
  shouldLoadDefaults: boolean;
  firstRun: boolean;
};

const configSchema = z.object({
  selected: z.string().nullable(),
  isInitialized: z.boolean(),
  shouldLoadDefaults: z.boolean(),
  firstRun: z.boolean(),
});

const getInitialConfig = (): Config => {
  if (typeof window === "undefined") {
    return {
      selected: null,
      isInitialized: false,
      shouldLoadDefaults: true,
      firstRun: true,
    };
  }
  try {
    const raw = localStorage.getItem("promptConfig");
    if (!raw) {
      return {
        selected: null,
        isInitialized: false,
        shouldLoadDefaults: true,
        firstRun: true,
      };
    }
    const parsed = JSON.parse(raw);
    const result = configSchema.safeParse(parsed);
    if (result.success) {
      return {
        selected: result.data.selected ?? null,
        isInitialized: result.data.isInitialized ?? false,
        shouldLoadDefaults: result.data.shouldLoadDefaults ?? true,
        firstRun: result.data.firstRun ?? true,
      };
    }
  } catch {}
  return {
    selected: null,
    isInitialized: false,
    shouldLoadDefaults: true,
    firstRun: true,
  };
};

/* -------------------- atoms -------------------- */

const configAtom = atomWithStorage<Config>("promptConfig", getInitialConfig(), {
  getItem: (key) => {
    if (typeof window === "undefined") return getInitialConfig();
    const v = localStorage.getItem(key);
    try {
      return v ? JSON.parse(v) : getInitialConfig();
    } catch {
      return getInitialConfig();
    }
  },
  setItem: (key, value) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
  removeItem: (key) => {
    if (typeof window !== "undefined") localStorage.removeItem(key);
  },
  subscribe: (key, cb) => {
    if (typeof window === "undefined") return () => {};
    const h = (e: StorageEvent) => {
      if (e.key === key) {
        cb(e.newValue ? JSON.parse(e.newValue) : getInitialConfig());
      }
    };
    window.addEventListener("storage", h);
    return () => window.removeEventListener("storage", h);
  },
});

export const promptsAtom = atomWithStorage<PromptStructure[]>("prompts", [], {
  getItem: (key) => {
    if (typeof window === "undefined") return [];
    const v = localStorage.getItem(key);
    try {
      return v ? JSON.parse(v) : [];
    } catch {
      return [];
    }
  },
  setItem: (key, value) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
  removeItem: (key) => {
    if (typeof window !== "undefined") localStorage.removeItem(key);
  },
  subscribe: (key, cb) => {
    if (typeof window === "undefined") return () => {};
    const h = (e: StorageEvent) => {
      if (e.key === key) {
        cb(e.newValue ? JSON.parse(e.newValue) : []);
      }
    };
    window.addEventListener("storage", h);
    return () => window.removeEventListener("storage", h);
  },
});

export const draftPromptsAtom = atomWithStorage<Record<string, PromptStructure>>(
  "draftPrompts",
  {},
  {
    getItem: (key) => {
      if (typeof window === "undefined") return {};
      const v = localStorage.getItem(key);
      try {
        return v ? JSON.parse(v) : {};
      } catch {
        return {};
      }
    },
    setItem: (key, value) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(value));
      }
    },
    removeItem: (key) => {
      if (typeof window !== "undefined") localStorage.removeItem(key);
    },
    subscribe: (key, cb) => {
      if (typeof window === "undefined") return () => {};
      const h = (e: StorageEvent) => {
        if (e.key === key) {
          cb(e.newValue ? JSON.parse(e.newValue) : {});
        }
      };
      window.addEventListener("storage", h);
      return () => window.removeEventListener("storage", h);
    },
  }
);

// in-memory only: last known version from server
const versionAtom = atom<string | null>(null);

/* -------------------- public hooks -------------------- */

export function usePrompt() {
  return useAtom(configAtom);
}

export const usePrompts = () => {
  const [prompts, setPrompts] = useAtom(promptsAtom);
  const [draftPrompts, setDraftPrompts] = useAtom(draftPromptsAtom);
  const [config, setConfig] = useAtom(configAtom);
  const [serverVersion, setServerVersion] = useAtom(versionAtom);

  const initRef = useRef(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchPrompts = useCallback(async () => {
    const res = await fetch("/api/prompts", { cache: "no-store" });
    const ver = res.headers.get("x-prompts-version") ?? null;
    try {
      const data = (await res.json()) as PromptStructure[];
      setPrompts(data || []);
      if (ver) setServerVersion(ver);
    } catch {
      // swallow
    }
  }, [setPrompts, setServerVersion]);

  // Initial load
  useEffect(() => {
    const initialize = async () => {
      if (config.shouldLoadDefaults && prompts.length === 0) {
        await fetchPrompts();
        setConfig({
          ...config,
          isInitialized: true,
          shouldLoadDefaults: false,
          firstRun: false,
        });
      } else if (!config.isInitialized) {
        setConfig({
          ...config,
          isInitialized: true,
          shouldLoadDefaults: false,
        });
      }
    };

    if (!initRef.current) {
      initialize();
      initRef.current = true;
    }
  }, [config, prompts.length, fetchPrompts, setConfig]);

  // Background version polling (every 60s)
  useEffect(() => {
    const start = () => {
      if (pollRef.current) return;
      pollRef.current = setInterval(async () => {
        try {
          const res = await fetch("/api/prompts", { method: "HEAD", cache: "no-store" });
          const ver = res.headers.get("x-prompts-version");
          if (ver && ver !== serverVersion) {
            await fetchPrompts(); // version changed → reload list
          }
        } catch {
          // ignore network errors
        }
      }, 60000);
    };

    const stop = () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };

    start();
    // pause when tab is hidden to save resources
    const vis = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", vis);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", vis);
    };
  }, [serverVersion, fetchPrompts]);

  /* --------------- CRUD helpers --------------- */

  const createPrompt = useCallback(
    async (prompt: Omit<PromptStructure, "id">) => {
      const candidate = { ...prompt, id: generateUniqueId() };
      const parsed = promptStructureSchema.safeParse(candidate);
      if (!parsed.success) {
        console.error("Failed to create prompt:", parsed.error);
        return;
      }

      // Write to server so it persists in /prompts/*.md
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) {
        console.error("Failed to POST prompt");
        return;
      }

      // Re-fetch canonical list (keeps sort order & IDs consistent)
      await fetchPrompts();
    },
    [fetchPrompts]
  );

  const deletePrompt = useCallback(
    (id: string) => {
      setPrompts(prompts.filter((p) => p.id !== id));
      if (config?.selected === id) {
        setConfig({ ...config, selected: null });
      }
      // NOTE: if you also want to remove from filesystem, add a DELETE API later.
    },
    [prompts, setPrompts, config, setConfig]
  );

  const editPrompt = useCallback(
    (id: string, updated: Partial<PromptStructure>) => {
      setPrompts(
        prompts.map((p) => {
          if (p.id !== id) return p;
          const next = { ...p, ...updated };
          const parsed = promptStructureSchema.safeParse(next);
          return parsed.success ? parsed.data : p;
        })
      );
      // NOTE: Persisting edits back to filesystem would need a PUT/PATCH API.
    },
    [prompts, setPrompts]
  );

  const toggleBookmark = useCallback(
    (id: string) => {
      setPrompts(
        prompts.map((p) => (p.id === id ? { ...p, bookmarked: !p.bookmarked } : p))
      );
    },
    [prompts, setPrompts]
  );

  const saveDraftPrompt = useCallback(
    (id: string, draft: PromptStructure) => {
      const parsed = promptStructureSchema.safeParse(draft);
      if (parsed.success) {
        setDraftPrompts({ ...draftPrompts, [id]: parsed.data });
      } else {
        console.error("Invalid draft:", parsed.error);
      }
    },
    [draftPrompts, setDraftPrompts]
  );

  const deleteDraftPrompt = useCallback(
    (id: string) => {
      const { [id]: _omit, ...rest } = draftPrompts;
      setDraftPrompts(rest);
    },
    [draftPrompts, setDraftPrompts]
  );

  const saveDraftAsFinalPrompt = useCallback(
    (id: string) => {
      const draft = draftPrompts[id];
      if (!draft) return;
      const parsed = promptStructureSchema.safeParse(draft);
      if (!parsed.success) {
        console.error("Invalid draft:", parsed.error);
        return;
      }
      editPrompt(id, parsed.data);
      deleteDraftPrompt(id);
    },
    [draftPrompts, editPrompt, deleteDraftPrompt]
  );

  const deleteAllPrompts = useCallback(() => {
    setPrompts([]);
    setDraftPrompts({});
    setConfig({
      ...config,
      selected: null,
      isInitialized: true,
      shouldLoadDefaults: false,
      firstRun: false,
    });
    initRef.current = false;
  }, [setPrompts, setDraftPrompts, setConfig, config]);

  const restoreDefaultPrompts = useCallback(async () => {
    await fetchPrompts();
    setDraftPrompts({});
    setConfig({
      ...config,
      isInitialized: true,
      shouldLoadDefaults: false,
      firstRun: false,
    });
    initRef.current = false;
  }, [fetchPrompts, setDraftPrompts, setConfig, config]);

  return {
    prompts,
    createPrompt,
    deletePrompt,
    editPrompt,
    toggleBookmark,
    draftPrompts,
    saveDraftPrompt,
    deleteDraftPrompt,
    saveDraftAsFinalPrompt,
    deleteAllPrompts,
    restoreDefaultPrompts,
  };
};

/* -------------------- helpers -------------------- */

const generateUniqueId = () => Math.random().toString(36).slice(2, 11);

/* ------- edit/delete atoms (unchanged external API) ------- */

export const editPromptAtom = atom(
  null,
  (
    get,
    set,
    { id, updatedPrompt }: { id: string; updatedPrompt: Partial<PromptStructure> }
  ) => {
    const prompts = get(promptsAtom);
    set(
      promptsAtom,
      prompts.map((p) => {
        if (p.id !== id) return p;
        const next = { ...p, ...updatedPrompt };
        const parsed = promptStructureSchema.safeParse(next);
        return parsed.success ? parsed.data : p;
      })
    );
  }
);

export const deletePromptAtom = atom(null, (get, set, id: string) => {
  const prompts = get(promptsAtom);
  set(
    promptsAtom,
    prompts.filter((p) => p.id !== id)
  );
  const cfg = get(configAtom);
  if (cfg?.selected === id) {
    set(configAtom, { ...cfg, selected: null });
  }
});

export function useEditPrompt() {
  const [, editPrompt] = useAtom(editPromptAtom);
  return editPrompt;
}

export function useDeletePrompt() {
  const [, deletePrompt] = useAtom(deletePromptAtom);
  return deletePrompt;
}
