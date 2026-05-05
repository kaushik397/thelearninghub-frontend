import { supabase } from '../lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

async function getAuthHeader() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {};
}

async function parseApiError(response) {
  try {
    const payload = await response.json();
    return payload.detail || 'Request failed';
  } catch {
    return 'Request failed';
  }
}

export async function createChatSessionFromPdf({ file, learnerGoal, detailLevel = 'standard', sessionId, materialId }) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('learner_goal', learnerGoal || 'Help me study this document');
  formData.append('detail_level', detailLevel);
  if (sessionId) formData.append('session_id', sessionId);
  if (materialId) formData.append('material_id', materialId);

  const response = await fetch(`${API_BASE_URL}/api/v1/chat/sessions/from-pdf`, {
    method: 'POST',
    headers: await getAuthHeader(),
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}

export async function createChatSessionFromYoutube({ url, learnerGoal, detailLevel = 'standard', sessionId, materialId }) {
  const response = await fetch(`${API_BASE_URL}/api/v1/chat/sessions/from-youtube`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeader()),
    },
    body: JSON.stringify({
      url,
      learner_goal: learnerGoal || 'Help me study this video',
      detail_level: detailLevel,
      session_id: sessionId,
      material_id: materialId,
    }),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}

export async function createChatSessionFromLink({ url, learnerGoal, detailLevel = 'standard', sessionId, materialId }) {
  const response = await fetch(`${API_BASE_URL}/api/v1/chat/sessions/from-link`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeader()),
    },
    body: JSON.stringify({
      url,
      learner_goal: learnerGoal || 'Help me study this article',
      detail_level: detailLevel,
      session_id: sessionId,
      material_id: materialId,
    }),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}

export async function sendChatMessage({ sessionId, message, materialId, notesMarkdown }) {
  const response = await fetch(`${API_BASE_URL}/api/v1/chat/sessions/${sessionId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeader()),
    },
    body: JSON.stringify({
      message,
      material_id: materialId,
      notes_markdown: notesMarkdown,
    }),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}

export async function generateSourceSections({ sessionId, learnerGoal }) {
  const params = new URLSearchParams();
  if (learnerGoal) params.set('learner_goal', learnerGoal);

  const response = await fetch(`${API_BASE_URL}/api/v1/chat/sessions/${sessionId}/sections?${params.toString()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeader()),
    },
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}

export async function generateDiagnosticQuiz({ sessionId, learnerGoal, sections }) {
  const response = await fetch(`${API_BASE_URL}/api/v1/chat/sessions/${sessionId}/quiz`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeader()),
    },
    body: JSON.stringify({
      learner_goal: learnerGoal,
      sections,
    }),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}

export async function submitDiagnosticQuizResults({
  sessionId,
  learnerGoal,
  detailLevel = 'standard',
  questions,
  answers,
}) {
  const response = await fetch(`${API_BASE_URL}/api/v1/chat/sessions/${sessionId}/quiz-results`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeader()),
    },
    body: JSON.stringify({
      learner_goal: learnerGoal,
      detail_level: detailLevel,
      questions,
      answers,
    }),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}
