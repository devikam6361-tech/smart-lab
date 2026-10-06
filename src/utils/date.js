export const getToday = () => {
  return new Date().toISOString().split("T")[0];
};

export const getCurrentTime = () => {
  return new Date().toLocaleTimeString();
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString();
};