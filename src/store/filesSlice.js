import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const uploadFile = createAsyncThunk(
  'files/upload',
  async ({ file, tags }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (tags) formData.append('tags', tags);

      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.data.file;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Upload failed. Please check file type and size.');
    }
  }
);

export const searchFiles = createAsyncThunk(
  'files/search',
  async ({ query = '', sortBy = 'relevance', fileType = '', page = 1, limit = 50 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (query && query.trim()) params.set('query', query.trim());
      if (sortBy) params.set('sortBy', sortBy);
      if (fileType) params.set('fileType', fileType);
      if (page) params.set('page', String(page));
      if (limit) params.set('limit', String(limit));

      const { data } = await api.get(`/search?${params.toString()}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Search failed. Please try again.');
    }
  }
);

export const fetchMyFiles = createAsyncThunk(
  'files/fetchMyFiles',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/files');
      return data.data.files;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load your files.');
    }
  }
);

export const deleteFile = createAsyncThunk(
  'files/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/files/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete file.');
    }
  }
);

export const getFileById = createAsyncThunk(
  'files/getFileById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/files/${id}`);
      return data.data.file;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch file details.');
    }
  }
);

const filesSlice = createSlice({
  name: 'files',
  initialState: {
    files: [],
    myFiles: [],
    searchResults: [],
    total: 0,
    loading: false,
    searchLoading: false,
    uploading: false,
    uploadProgress: 0,
    error: null,
    searchError: null,
    uploadError: null,
    selectedFile: null,
  },
  reducers: {
    clearFilesError: (state) => {
      state.error = null;
      state.searchError = null;
      state.uploadError = null;
    },
    setSelectedFile: (state, action) => {
      state.selectedFile = action.payload;
    },
    clearSelectedFile: (state) => {
      state.selectedFile = null;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload
      .addCase(uploadFile.pending, (state) => {
        state.uploading = true;
        state.uploadError = null;
        state.uploadProgress = 30;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.uploading = false;
        state.uploadProgress = 100;
        state.myFiles.unshift(action.payload);
        state.files.unshift(action.payload);
        state.total += 1;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.uploading = false;
        state.uploadProgress = 0;
        state.uploadError = action.payload;
      })

      // Search
      .addCase(searchFiles.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchFiles.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.files;
        state.files = action.payload.files;
        state.total = action.payload.total;
      })
      .addCase(searchFiles.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload;
      })

      // Fetch My Files
      .addCase(fetchMyFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.myFiles = action.payload;
        state.files = action.payload;
        state.total = action.payload.length;
      })
      .addCase(fetchMyFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteFile.fulfilled, (state, action) => {
        const id = action.payload;
        state.files = state.files.filter((f) => f._id !== id);
        state.myFiles = state.myFiles.filter((f) => f._id !== id);
        state.searchResults = state.searchResults.filter((f) => f._id !== id);
        state.total = Math.max(0, state.total - 1);
        if (state.selectedFile?._id === id) {
          state.selectedFile = null;
        }
      })

      // Get Single File
      .addCase(getFileById.fulfilled, (state, action) => {
        const updated = action.payload;
        state.selectedFile = updated;
        // Update in lists
        const updateInList = (list) =>
          list.map((item) => (item._id === updated._id ? updated : item));
        state.files = updateInList(state.files);
        state.myFiles = updateInList(state.myFiles);
        state.searchResults = updateInList(state.searchResults);
      });
  },
});

export const {
  clearFilesError,
  setSelectedFile,
  clearSelectedFile,
  setUploadProgress,
} = filesSlice.actions;

export default filesSlice.reducer;
