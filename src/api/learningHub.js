const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

async function parseApiError(response) {
  try {
    const payload = await response.json();
    return payload.detail || 'Request failed';
  } catch {
    return 'Request failed';
  }
}

export async function createChatSessionFromPdf({ file, learnerGoal, detailLevel = 'standard' }) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('learner_goal', learnerGoal || 'Help me study this document');
  formData.append('detail_level', detailLevel);

  const response = await fetch(`${API_BASE_URL}/api/v1/chat/sessions/from-pdf`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}

export async function sendChatMessage({ sessionId, message }) {
  const response = await fetch(`${API_BASE_URL}/api/v1/chat/sessions/${sessionId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}
