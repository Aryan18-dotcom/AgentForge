// Helper to handle response parsing and error extraction cleanly
async function handleResponse(response: Response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "An unexpected system error occurred");
  }
  return data;
}

export default handleResponse;