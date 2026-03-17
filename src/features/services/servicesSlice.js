import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiFetch } from "../../api/apiClient";

export const fetchServices = createAsyncThunk("services/fetch", async () => {
  return await apiFetch("/services/");
});

const slice = createSlice({
  name: "services",
  initialState: { items: [], status: "idle", error: "" },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchServices.pending, (s) => { s.status = "loading"; s.error = ""; });
    b.addCase(fetchServices.fulfilled, (s, a) => { s.status = "succeeded"; s.items = a.payload; });
    b.addCase(fetchServices.rejected, (s, a) => { s.status = "failed"; s.error = a.error.message || "Ошибка"; });
  },
});

export default slice.reducer;
