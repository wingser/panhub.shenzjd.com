import { defineStore } from 'pinia';

export interface SearchState {
  loading: boolean;
  deepLoading: boolean;
  paused: boolean;
  error: string;
  searched: boolean;
  elapsedMs: number;
  total: number;
  merged: Record<string, any[]>;
}

export const useSearchStore = defineStore('search', {
  state: (): SearchState => ({
    loading: false,
    deepLoading: false,
    paused: false,
    error: '',
    searched: false,
    elapsedMs: 0,
    total: 0,
    merged: {},
  }),

  actions: {
    setLoading(loading: boolean) {
      this.loading = loading;
    },

    setDeepLoading(deepLoading: boolean) {
      this.deepLoading = deepLoading;
    },

    setPaused(paused: boolean) {
      this.paused = paused;
    },

    setError(error: string) {
      this.error = error;
    },

    setSearched(searched: boolean) {
      this.searched = searched;
    },

    setElapsedMs(elapsedMs: number) {
      this.elapsedMs = elapsedMs;
    },

    setTotal(total: number) {
      this.total = total;
    },

    setMerged(merged: Record<string, any[]>) {
      this.merged = merged;
    },

    updateMerged(newItems: Record<string, any[]>) {
      // 合并新结果到现有结果
      for (const type of Object.keys(newItems)) {
        const existed = this.merged[type] || [];
        const next = newItems[type] || [];
        const seen = new Set(existed.map((x: any) => x.url));
        const mergedArr = [...existed];
        for (const item of next) {
          if (!seen.has(item.url)) {
            seen.add(item.url);
            mergedArr.push(item);
          }
        }
        this.merged[type] = mergedArr;
      }
    },

    reset() {
      this.$reset();
    },
  },

  getters: {
    hasResults(): boolean {
      return Object.keys(this.merged).length > 0;
    },

    platforms(): string[] {
      return Object.keys(this.merged);
    },
  },
});
