import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Django base (через Vite proxy /api -> http://127.0.0.1:8000/api)
// или напрямую, если не используешь proxy:
const API = import.meta.env.VITE_API_BASE || "/api";

// --- helpers ---
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return "";
}

async function ensureCsrf() {
  // auth_api.py: csrf view ставит csrftoken cookie
  await fetch(`${API}/auth/csrf/`, {
    method: "GET",
    credentials: "include",
  });
}

export const meThunk = createAsyncThunk("auth/me", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API}/auth/me/`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      // не залогинен — это НЕ ошибка приложения, просто null
      return null;
    }

    return await res.json();
  } catch (e) {
    return rejectWithValue(e?.message || "me failed");
  }
});

export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      await ensureCsrf();
      const csrftoken = getCookie("csrftoken");

      const res = await fetch(`${API}/auth/login/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return rejectWithValue(data?.detail || "Login failed");
      }

      return data; // {id, username, email, is_superuser}
    } catch (e) {
      return rejectWithValue(e?.message || "Login failed");
    }
  }
);

export const logoutThunk = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await ensureCsrf();
    const csrftoken = getCookie("csrftoken");

    const res = await fetch(`${API}/auth/logout/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "X-CSRFToken": csrftoken,
      },
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return rejectWithValue(data?.detail || "Logout failed");
    }

    return true;
  } catch (e) {
    return rejectWithValue(e?.message || "Logout failed");
  }
});

const slice = createSlice({
  name: "auth",
  initialState: {
    user: null,       // {id, username, email, is_superuser} | null
    status: "idle",   // idle | loading | succeeded | failed
    error: "",
  },
  reducers: {
    clearAuthError(state) {
      state.error = "";
    },
    setUser(state, action) {
      state.user = action.payload || null;
    },
  },
  extraReducers: (builder) => {
    builder
      // me
      .addCase(meThunk.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(meThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload || null;
      })
      .addCase(meThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "me error";
      })

      // login
      .addCase(loginThunk.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "login error";
      })

      // logout
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
        state.error = "";
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        // даже если logout не удался — UI можно чистить, но я оставлю ошибку
        state.error = action.payload || "logout error";
      });
  },
});

export const { clearAuthError, setUser } = slice.actions;
export default slice.reducer;
