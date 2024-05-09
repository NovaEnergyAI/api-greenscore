export async function addAsset(asset) {
    try {
      const response = await fetch("/api/add-asset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(asset),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding asset:", error);
      return null;
    }
}