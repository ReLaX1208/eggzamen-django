// src/features/bbs/bbsSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API = import.meta.env.VITE_API_BASE || "/api";

export const fetchBbsByRubric = createAsyncThunk(
  "bbs/byRubric",
  async (rubricId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/rubrics/${rubricId}/bbs/`, {
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return rejectWithValue(data?.detail || "Ошибка загрузки объявлений");
      return data;
    } catch (e) {
      return rejectWithValue(e?.message || "Ошибка сети");
    }
  }
);

export const fetchBbById = createAsyncThunk(
  "bbs/detail",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/bbs/${id}/`, {
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return rejectWithValue(data?.detail || "Товар не найден");
      return data;
    } catch (e) {
      return rejectWithValue(e?.message || "Ошибка сети");
    }
  }
);

export const searchBbs = createAsyncThunk(
  "bbs/search",
  async (q, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/search/?q=${encodeURIComponent(q)}`, {
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return rejectWithValue(data?.detail || "Ошибка поиска");
      return data;
    } catch (e) {
      return rejectWithValue(e?.message || "Ошибка сети");
    }
  }
);

const slice = createSlice({
  name: "bbs",
  initialState: {
    items: [],
    status: "idle",
    error: "",

    current: null,

    searchItems: [],
    searchStatus: "idle",
    searchError: "",
  },
  reducers: {},
  extraReducers: (b) => {
    b
      // by rubric
      .addCase(fetchBbsByRubric.pending, (s) => {
        s.status = "loading";
        s.error = "";
        s.items = [];
      })
      .addCase(fetchBbsByRubric.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = Array.isArray(a.payload) ? a.payload : [];
      })
      .addCase(fetchBbsByRubric.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload || "Ошибка";
      })

      // detail
      .addCase(fetchBbById.pending, (s) => {
        s.status = "loading";
        s.error = "";
        s.current = null;
      })
      .addCase(fetchBbById.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.current = a.payload;
      })
      .addCase(fetchBbById.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload || "Ошибка";
      })

      // search
      .addCase(searchBbs.pending, (s) => {
        s.searchStatus = "loading";
        s.searchError = "";
        s.searchItems = [];
      })
      .addCase(searchBbs.fulfilled, (s, a) => {
        s.searchStatus = "succeeded";
        s.searchItems = Array.isArray(a.payload) ? a.payload : [];
      })
      .addCase(searchBbs.rejected, (s, a) => {
        s.searchStatus = "failed";
        s.searchError = a.payload || "Ошибка";
      });
  },
});

export default slice.reducer;
