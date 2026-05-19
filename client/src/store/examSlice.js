import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../lib/api'

export const fetchDashboard = createAsyncThunk('exam/dashboard', async (role, thunkApi) => {
  try {
    const { data } = await api.get(`/dashboard/${role}`)
    return { role, data }
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.detail || 'Failed to load dashboard')
  }
})

export const fetchExams = createAsyncThunk('exam/list', async (scope = '', thunkApi) => {
  try {
    const { data } = await api.get('/exams', { params: scope ? { scope } : {} })
    return data
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.detail || 'Failed to fetch exams')
  }
})

export const startExam = createAsyncThunk('exam/start', async (examId, thunkApi) => {
  try {
    const { data } = await api.post(`/exams/${examId}/start`)
    return data
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.detail || 'Unable to start exam')
  }
})

export const autosaveExam = createAsyncThunk('exam/autosave', async ({ examId, payload }, thunkApi) => {
  try {
    const { data } = await api.put(`/exams/${examId}/autosave`, payload)
    return data
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.detail || 'Autosave failed')
  }
})

export const submitExam = createAsyncThunk('exam/submit', async ({ examId, payload }, thunkApi) => {
  try {
    const { data } = await api.post(`/exams/${examId}/submit`, payload)
    return data
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.detail || 'Submission failed')
  }
})

export const logSuspiciousActivity = createAsyncThunk('exam/log', async ({ examId, payload }) => {
  const { data } = await api.post(`/exams/${examId}/suspicious-activity`, payload)
  return data
})

export const fetchResult = createAsyncThunk('exam/result', async (attemptId, thunkApi) => {
  try {
    const { data } = await api.get(`/results/${attemptId}`)
    return data
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.detail || 'Result not found')
  }
})

export const fetchLeaderboard = createAsyncThunk('exam/leaderboard', async (examId, thunkApi) => {
  try {
    const { data } = await api.get('/leaderboard', { params: { exam_id: examId } })
    return data
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.detail || 'Leaderboard unavailable')
  }
})

export const createExam = createAsyncThunk('exam/createExam', async (payload, thunkApi) => {
  try {
    const { data } = await api.post('/exams', payload)
    return data
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.detail || 'Unable to create exam')
  }
})

export const publishExam = createAsyncThunk('exam/publishExam', async (examId, thunkApi) => {
  try {
    const { data } = await api.post(`/exams/${examId}/publish`)
    return { examId, ...data }
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.detail || 'Unable to publish exam')
  }
})

export const deleteExam = createAsyncThunk('exam/deleteExam', async (examId, thunkApi) => {
  try {
    const { data } = await api.delete(`/exams/${examId}`)
    return { examId, ...data }
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.detail || 'Unable to delete exam')
  }
})

export const aiGenerateQuestions = createAsyncThunk('exam/aiGenerate', async (payload, thunkApi) => {
  try {
    const { data } = await api.post('/teacher/ai-generate', payload)
    return data.questions
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.detail || 'AI generation failed')
  }
})

export const importQuestionFile = createAsyncThunk('exam/importQuestionFile', async ({ examId, file }, thunkApi) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post(`/teacher/import-questions?exam_id=${examId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.detail || 'Question paper upload failed')
  }
})

export const fetchAdminUsers = createAsyncThunk('exam/adminUsers', async (_, thunkApi) => {
  try {
    const { data } = await api.get('/admin/users')
    return data
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.detail || 'Unable to fetch users')
  }
})

export const toggleBlockUser = createAsyncThunk('exam/toggleBlockUser', async (userId, thunkApi) => {
  try {
    const { data } = await api.post(`/admin/users/${userId}/toggle-block`)
    return { userId, ...data }
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.detail || 'Unable to update user status')
  }
})

const examSlice = createSlice({
  name: 'exam',
  initialState: {
    dashboards: {},
    exams: [],
    activeAttempt: null,
    activeExam: null,
    result: null,
    leaderboard: [],
    adminUsers: [],
    aiQuestions: [],
    status: 'idle',
    error: '',
    teacherActionMessage: '',
  },
  reducers: {
    clearExamState(state) {
      state.activeAttempt = null
      state.activeExam = null
      state.result = null
    },
    setActiveExamState(state, action) {
      state.activeExam = action.payload
    },
    clearTeacherActionMessage(state) {
      state.teacherActionMessage = ''
      state.error = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.dashboards[action.payload.role] = action.payload.data
      })
      .addCase(fetchExams.fulfilled, (state, action) => {
        state.exams = action.payload
      })
      .addCase(startExam.fulfilled, (state, action) => {
        state.activeAttempt = action.payload.attempt_id
        state.activeExam = action.payload.exam
      })
      .addCase(submitExam.fulfilled, (state, action) => {
        state.result = action.payload
      })
      .addCase(fetchResult.fulfilled, (state, action) => {
        state.result = action.payload
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.leaderboard = action.payload
      })
      .addCase(createExam.fulfilled, (state, action) => {
        state.exams.unshift(action.payload)
        state.teacherActionMessage = 'Exam saved successfully.'
      })
      .addCase(createExam.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(publishExam.fulfilled, (state) => {
        state.teacherActionMessage = 'Exam published successfully. Students can see it now.'
      })
      .addCase(publishExam.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(deleteExam.fulfilled, (state, action) => {
        state.exams = state.exams.filter((item) => item.id !== action.payload.examId)
        state.teacherActionMessage = 'Exam deleted successfully.'
      })
      .addCase(deleteExam.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(aiGenerateQuestions.fulfilled, (state, action) => {
        state.aiQuestions = action.payload
        state.teacherActionMessage = `Generated ${action.payload.length} quality questions.`
      })
      .addCase(aiGenerateQuestions.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(importQuestionFile.fulfilled, (state, action) => {
        state.teacherActionMessage = action.payload.message || 'Question paper uploaded successfully.'
      })
      .addCase(importQuestionFile.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.adminUsers = action.payload
      })
      .addCase(toggleBlockUser.fulfilled, (state, action) => {
        state.adminUsers = state.adminUsers.map((item) =>
          item.id === action.payload.userId ? { ...item, is_blocked: action.payload.is_blocked } : item,
        )
      })
  },
})

export const { clearExamState, setActiveExamState, clearTeacherActionMessage } = examSlice.actions
export default examSlice.reducer
