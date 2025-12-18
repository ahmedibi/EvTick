// src/redux/slices/checkoutSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db, auth } from "../../firebase/firebase.config";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  deleteDoc,
  doc
} from "firebase/firestore";

/* =========================
   SAVE CHECKOUT (SUBCOLLECTION)
========================= */
export const saveCheckout = createAsyncThunk(
  "checkout/saveCheckout",
  async (checkoutData, { rejectWithValue }) => {
    try {
      if (!auth.currentUser) throw new Error("User not logged in");

      const uid = auth.currentUser.uid;

      const dataToSave = {
        ...checkoutData,
        createdAt: serverTimestamp(),
      };

      const checkoutRef = collection(db, "users", uid, "checkout");
      const docRef = await addDoc(checkoutRef, dataToSave);

      return { id: docRef.id, ...dataToSave };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* =========================
   FETCH LATEST CHECKOUT
========================= */
export const fetchLatestCheckout = createAsyncThunk(
  "checkout/fetchLatestCheckout",
  async (_, { rejectWithValue }) => {
    try {
      if (!auth.currentUser) throw new Error("User not logged in");

      const uid = auth.currentUser.uid;

      const q = query(
        collection(db, "users", uid, "checkout"),
        orderBy("createdAt", "desc"),
        limit(1)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) return null;

      const docSnap = snapshot.docs[0];
          const data = docSnap.data();
      
      // تحويل Firestore timestamp إلى ISO string إذا كان موجود
      if (data.eventDate && data.eventDate.seconds) {
        data.eventDate = new Date(data.eventDate.seconds * 1000).toISOString();
      }
      
      // تحويل createdAt timestamp إذا كان موجود
      if (data.createdAt && data.createdAt.seconds) {
        data.createdAt = new Date(data.createdAt.seconds * 1000).toISOString();
      }
      
      return { id: docSnap.id, ...data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* =========================
   DELETE CHECKOUT (AFTER PAYMENT)
========================= */
export const deleteCheckout = createAsyncThunk(
  "checkout/deleteCheckout",
  async (checkoutId, { rejectWithValue }) => {
    try {
      if (!auth.currentUser) throw new Error("User not logged in");

      const uid = auth.currentUser.uid;

      await deleteDoc(doc(db, "users", uid, "checkout", checkoutId));
      return checkoutId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* =========================
   SLICE
========================= */
const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCheckout(state) {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // saveCheckout
      .addCase(saveCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(saveCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchLatestCheckout
      .addCase(fetchLatestCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLatestCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchLatestCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteCheckout
      .addCase(deleteCheckout.fulfilled, (state) => {
        state.data = null;
      });
  },
});

export const { clearCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
