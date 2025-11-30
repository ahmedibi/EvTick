// src/store/eventSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase/firebase.config";
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, query, where } from "firebase/firestore";



export const fetchEventTypes = createAsyncThunk(
  "events/fetchEventTypes",
  async () => {
    const snapshot = await getDocs(collection(db, "eventTypes"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
);


export const fetchEventsByType = createAsyncThunk(
  "events/fetchEventsByType",
  async (typeId) => {
    const q = query(collection(db, "events"), where("type", "==", typeId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
);


export const fetchEventById = createAsyncThunk(
  "events/fetchEventById",
  async (eventId) => {
    const docRef = doc(db, "events", eventId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() };
  }
);


export const updateEventData = createAsyncThunk(
  "events/updateEvent",
  async ({ eventId, data }) => {
    const docRef = doc(db, "events", eventId);
    await updateDoc(docRef, data);
    return { eventId, data };
  }
);


export const addNewEvent = createAsyncThunk(
  "events/addEvent",
  async (eventData) => {
    await addDoc(collection(db, "events"), eventData);
    return eventData;
  }
);



const eventSlice = createSlice({
  name: "events",
  initialState: {
    types: [],
    events: [],
    currentEvent: null,
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      // --- Event Types
      .addCase(fetchEventTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEventTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.types = action.payload;
      })
      .addCase(fetchEventTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // --- Events by Type
      .addCase(fetchEventsByType.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEventsByType.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })

      // --- Event by ID
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.currentEvent = action.payload;
      })

      // --- Update Event
      .addCase(updateEventData.fulfilled, (state, action) => {
        const { eventId, data } = action.payload;
        state.events = state.events.map(e =>
          e.id === eventId ? { ...e, ...data } : e
        );
      })

      // --- Add Event
      .addCase(addNewEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
      });
  },
});

export default eventSlice.reducer;
