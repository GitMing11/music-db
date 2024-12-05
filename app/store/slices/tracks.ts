// app/store/slices/tracks.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  imageUrl: string;
  spotifyUrl: string;
  initialLiked: boolean;
  initialadded: boolean;
}

interface TracksState {
  list: Track[];
  loading: boolean;
}

const initialState: TracksState = {
  list: [],
  loading: false,
};

export const fetchTracks = createAsyncThunk("tracks/fetchTracks", async () => {
  const response = await axios.get("/api/tracks");
  const data = response.data;

  // 트랙 데이터를 매핑
  return data.map((track: any) => ({
    id: track.id,
    name: track.name,
    artist: track.artist,
    album: track.album,
    imageUrl: track.imageUrl,
    spotifyUrl: track.spotifyUrl,
    initialLiked: track.initialLiked,
    initialadded: track.initialadded,
  }));
});

const tracksSlice = createSlice({
  name: "tracks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTracks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTracks.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchTracks.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default tracksSlice.reducer;
