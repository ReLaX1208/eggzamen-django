import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiFetch } from "../../api/apiClient";

export const fetchRubrics = createAsyncThunk("rubrics/fetch", async () => {
  return await apiFetch("/rubrics/");
});

const slice = createSlice({
  name: "rubrics",
  initialState: { items: [], status: "idle", error: "" },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchRubrics.pending, (s) => { s.status = "loading"; s.error = ""; });
    b.addCase(fetchRubrics.fulfilled, (s, a) => { s.status = "succeeded"; s.items = a.payload; });
    b.addCase(fetchRubrics.rejected, (s, a) => { s.status = "failed"; s.error = a.error.message || "Ошибка"; });
  },
});

export default slice.reducer;
