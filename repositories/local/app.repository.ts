import type { AppData } from "../../domain/models";
import { isAppData, migrateAppData } from "../../services/app-data";

export interface AppRepository {
  load(): Promise<AppData | null>;
  save(data: AppData): Promise<void>;
  clear(): Promise<void>;
}

export const STORAGE_KEY = "nexo:v2:app";
export const LEGACY_KEY = "nexo:v1:app";
export const DEMO_STORAGE_KEY = "nexo-demo:v2:app";

export class StorageError extends Error {
  constructor(message = "No se pudo guardar el cambio en este dispositivo.") {
    super(message);
    this.name = "StorageError";
  }
}

export class LocalAppRepository implements AppRepository {
  lastLoadError: string | null = null;

  constructor(
    private readonly storageKey = STORAGE_KEY,
    private readonly legacyKey: string | null = LEGACY_KEY,
    private readonly prefix = "nexo:",
  ) {}

  async load() {
    if (typeof window === "undefined") return null;
    this.lastLoadError = null;
    try {
      const current = localStorage.getItem(this.storageKey);
      if (current !== null) {
        const parsed = this.parse(current);
        if (parsed) return parsed;
        this.lastLoadError = "Los datos locales de Nexo están dañados o usan una versión no compatible. No fueron reemplazados.";
      }
      if (this.legacyKey) {
        const legacy = localStorage.getItem(this.legacyKey);
        if (legacy !== null) {
          const migrated = this.parse(legacy);
          if (migrated) {
            await this.save(migrated);
            this.lastLoadError = null;
            return migrated;
          }
          this.lastLoadError = "Los datos locales anteriores de Nexo no pudieron migrarse y no fueron reemplazados.";
        }
      }
      return null;
    } catch {
      this.lastLoadError = "Nexo no pudo leer el almacenamiento local. Comprueba los permisos del navegador.";
      return null;
    }
  }

  private parse(raw: string) {
    try { return migrateAppData(JSON.parse(raw)); } catch { return null; }
  }

  async save(data: AppData) {
    if (typeof window === "undefined") return;
    if (!isAppData(data)) throw new StorageError("Los datos no son válidos y no se guardaron.");
    try { localStorage.setItem(this.storageKey, JSON.stringify(data)); } catch { throw new StorageError(); }
  }

  async clear() {
    if (typeof window === "undefined") return;
    try {
      for (let index = localStorage.length - 1; index >= 0; index--) {
        const key = localStorage.key(index);
        if (key?.startsWith(this.prefix)) localStorage.removeItem(key);
      }
    } catch { throw new StorageError("No se pudieron eliminar los datos de Nexo."); }
  }
}

export const realRepository = () => new LocalAppRepository();
export const demoRepository = () => new LocalAppRepository(DEMO_STORAGE_KEY, null, "nexo-demo:");
