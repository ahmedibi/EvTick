import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase/firebase.config";
import { doc, getDoc } from "firebase/firestore";

// --- Fetch seat model by ID ---
export const fetchSeatModelById = createAsyncThunk(
  "seatModel/fetchSeatModelById",
  async (modelId) => {
    const docRef = doc(db, "seatModel", modelId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error("Seat model not found");
    }
    return { id: docSnap.id, ...docSnap.data() };
  }
);

const seatModelSlice = createSlice({
  name: "seatModel",
  initialState: {
    currentModel: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSeatModel: (state) => {
      state.currentModel = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeatModelById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeatModelById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentModel = action.payload;
      })
      .addCase(fetchSeatModelById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSeatModel } = seatModelSlice.actions;
export default seatModelSlice.reducer;

