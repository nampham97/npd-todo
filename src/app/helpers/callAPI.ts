export async function callAPI<T, D = unknown>(url: string, method: string, data?: D): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json()
}