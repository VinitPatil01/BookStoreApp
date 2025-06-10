
export const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const payload = token.split('.')[1];
  const decoded = JSON.parse(atob(payload));

  return decoded?.authorities?.[0] || null;
};


export const getUserEmail = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  
  const payload = token.split('.')[1];
  const decoded = JSON.parse(atob(payload));
  
  return decoded?.sub || null;
};