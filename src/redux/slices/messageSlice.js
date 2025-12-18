import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db, auth } from "../../firebase/firebase.config";

export const fetchUserMessages = createAsyncThunk(
  "messages/fetchUserMessages",
  async (_, { rejectWithValue }) => {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("User not logged in");
      }

      const q = query(
        collection(db, "contactMessages"),
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);

      const messages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
          createdAt: doc.data().createdAt.toDate().toISOString(),
      }));

      return messages;
    } catch (error) {
      console.error("Firestore Error:", error);
      return rejectWithValue(error.message);
    }
  }
);

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchUserMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
