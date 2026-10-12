import axios from 'axios';

export function getError(error, fallback = 'Something went wrong') {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data?.message) {
      return data.message;
    }
    if (data?.errors) {
      const firstKey = Object.keys(data.errors)[0];
      const firstMessage = firstKey ? data.errors[firstKey]?.[0] : undefined;
      if (firstMessage) {
        return firstMessage;
      }
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

export function getFormErrors(error) {
  if (!axios.isAxiosError(error)) {
    return {};
  }
  const errors = error.response?.data?.errors;
  if (!errors) {
    return {};
  }
  const result = {};
  for (const key of Object.keys(errors)) {
    const messages = errors[key];
    if (messages?.[0]) {
      result[key] = messages[0];
    }
  }
  return result;
}
