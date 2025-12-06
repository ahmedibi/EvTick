import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase/firebase.config";
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, query, where, arrayUnion, increment } from "firebase/firestore";

// --- Fetch all events ---
export const fetchAllEvents = createAsyncThunk(
  "events/fetchAllEvents",
  async () => {
    const snapshot = await getDocs(collection(db, "events"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
);

// --- Fetch event types ---
export const fetchEventTypes = createAsyncThunk(
  "events/fetchEventTypes",
  async () => {
    const snapshot = await getDocs(collection(db, "eventTypes"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
);

// --- Fetch events by type ---
export const fetchEventsByType = createAsyncThunk(
  "events/fetchEventsByType",
  async (typeId, { dispatch }) => {
    if (typeId === "All") {
      return dispatch(fetchAllEvents()).unwrap();
    }
    const q = query(collection(db, "events"), where("type", "==", typeId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
);

// --- Fetch single event by ID ---
export const fetchEventById = createAsyncThunk(
  "events/fetchEventById",
  async (eventId) => {
    const docRef = doc(db, "events", eventId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() };
  }
);

// --- Update event ---
export const updateEventData = createAsyncThunk(
  "events/updateEvent",
  async ({ eventId, data }) => {
    const docRef = doc(db, "events", eventId);
    await updateDoc(docRef, data);
    return { eventId, data };
  }
);

// --- Add new event ---
export const addNewEvent = createAsyncThunk(
  "events/addEvent",
  async (eventData) => {
    const docRef = await addDoc(collection(db, "events"), eventData);
    return { id: docRef.id, ...eventData }; 
  }
);

export const updateEventAfterCheckout = createAsyncThunk(
  "events/updateEventAfterCheckout",
  async ({ eventId, seats, userId }, { rejectWithValue }) => {
    try {
      const eventRef = doc(db, "events", eventId);

      // bookedSeats جديد
      const bookedSeatsData = seats.map(s => ({
        row: s.row,
        seat: s.seat,
        userId
      }));

      // تحديث seatMap بحيث المقاعد الجديدة تتحجز
      const seatMapUpdate = {};
      seats.forEach(s => {
        const seatId = `${s.row}${s.seat}`;
        seatMapUpdate[`seatMap.${seatId}`] = true; // ✅ هنا الفرق - لازم تحط seatMap. قبل الـ key
      });

      // تحديث ticketsSold
      const ticketsSoldIncrement = seats.length;

      await updateDoc(eventRef, {
        bookedSeats: arrayUnion(...bookedSeatsData),
        ...seatMapUpdate, //  ده هيحدث seatMap بشكل صحيح
        ticketsSold: increment(ticketsSoldIncrement)
      });

      return { eventId, seats, userId };

    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


const eventSlice = createSlice({
  name: "events",
  initialState: {
    types: [],
    events: [],
    currentEvent: null,
    loadingEvents: false,
    loadingTypes: false,
    errorEvents: null,
    errorTypes: null,
    errorCurrentEvent: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- All Events ---
      .addCase(fetchAllEvents.pending, (state) => {
        state.loadingEvents = true;
        state.errorEvents = null;
      })
      .addCase(fetchAllEvents.fulfilled, (state, action) => {
        state.loadingEvents = false;
        state.events = action.payload;
      })
      .addCase(fetchAllEvents.rejected, (state, action) => {
        state.loadingEvents = false;
        state.errorEvents = action.error.message;
      })

      // --- Event Types ---
      .addCase(fetchEventTypes.pending, (state) => {
        state.loadingTypes = true;
        state.errorTypes = null;
      })
      .addCase(fetchEventTypes.fulfilled, (state, action) => {
        state.loadingTypes = false;
        state.types = action.payload;
      })
      .addCase(fetchEventTypes.rejected, (state, action) => {
        state.loadingTypes = false;
        state.errorTypes = action.error.message;
      })

      // --- Events by Type ---
      .addCase(fetchEventsByType.pending, (state) => {
        state.loadingEvents = true;
        state.errorEvents = null;
      })
      .addCase(fetchEventsByType.fulfilled, (state, action) => {
        state.loadingEvents = false;
        state.events = action.payload;
      })
      .addCase(fetchEventsByType.rejected, (state, action) => {
        state.loadingEvents = false;
        state.errorEvents = action.error.message;
      })

      // --- Single Event by ID ---
      .addCase(fetchEventById.pending, (state) => {
        state.errorCurrentEvent = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.currentEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.errorCurrentEvent = action.error.message;
      })

      // --- Update Event ---
      .addCase(updateEventData.fulfilled, (state, action) => {
        const { eventId, data } = action.payload;
        state.events = state.events.map(e =>
          e.id === eventId ? { ...e, ...data } : e
        );
        if (state.currentEvent?.id === eventId) {
          state.currentEvent = { ...state.currentEvent, ...data };
        }
      })

      // --- Add Event ---
      .addCase(addNewEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
      })

          // --- Update Event After Checkout
      .addCase(updateEventAfterCheckout.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEventAfterCheckout.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateEventAfterCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default eventSlice.reducer;
