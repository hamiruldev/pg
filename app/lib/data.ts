const TOKEN = 'Ns-d1nsty5IhoxzzTef6xZY_zrmbZwI5FDq-ai-C';
const DEALERS_URL = 'https://app.nocodb.com/api/v2/tables/m21ipqeu0aarax6/records?offset=0&limit=25&viewId=vwymej52p216msjv';
const REDIRECT_INDEX_URL = 'https://app.nocodb.com/api/v2/tables/m5oicmtoi8r75kt/records?offset=0&limit=1&viewId=vwnkrkslt1tjqkwi';
const REDIRECT_INDEX_PATCH_URL = 'https://app.nocodb.com/api/v2/tables/m5oicmtoi8r75kt/records';

const headers = {
  'xc-token': TOKEN,
  'Content-Type': 'application/json'
};

// Create a fetch wrapper with timeout
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      cache: 'no-store' // Disable fetch caching
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export async function getDealerData(): Promise<string> {
  try {
    // Fetch dealer list and redirect index in parallel for better performance
    const [dealersRes, indexRes] = await Promise.all([
      fetchWithTimeout(DEALERS_URL, { headers }),
      fetchWithTimeout(REDIRECT_INDEX_URL, { headers })
    ]);

    const [dealersData, indexData] = await Promise.all([
      dealersRes.json(),
      indexRes.json()
    ]);

    const dealers = dealersData.list;

    if (!dealers || dealers.length === 0) {
      throw new Error("No dealers available.");
    }

    const redirectRow = indexData.list?.[0];

    if (!redirectRow || typeof redirectRow.current_index !== 'number') {
      throw new Error("Invalid redirect index.");
    }

    const currentIndex = redirectRow.current_index;
    const selectedDealer = dealers[currentIndex]; // Use current index, don't update yet

    if (!selectedDealer['Username PGO']) {
      throw new Error("Selected dealer missing URL.");
    }

    return selectedDealer['Username PGO'];
  } catch (error) {
    console.error("Error in getDealerData:", error);
    throw error;
  }
}

export async function updateDealerIndex(): Promise<void> {
  try {
    // Fetch dealer list and redirect index in parallel
    const [dealersRes, indexRes] = await Promise.all([
      fetchWithTimeout(DEALERS_URL, { headers }),
      fetchWithTimeout(REDIRECT_INDEX_URL, { headers })
    ]);

    const [dealersData, indexData] = await Promise.all([
      dealersRes.json(),
      indexRes.json()
    ]);

    const dealers = dealersData.list;

    if (!dealers || dealers.length === 0) {
      throw new Error("No dealers available.");
    }

    const redirectRow = indexData.list?.[0];

    if (!redirectRow || typeof redirectRow.current_index !== 'number') {
      throw new Error("Invalid redirect index.");
    }

    const currentIndex = redirectRow.current_index;
    const nextIndex = (currentIndex + 1) % dealers.length;

    // Step 3: Update index in NocoDB
    const updateResponse = await fetchWithTimeout(REDIRECT_INDEX_PATCH_URL, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        current_index: nextIndex,
        Id: 34,
      })
    });

    if (!updateResponse.ok) {
      throw new Error("Failed to update index.");
    }

    console.log("Dealer index updated successfully");
  } catch (error) {
    console.error("Error in updateDealerIndex:", error);
    throw error;
  }
}

export async function getPageContent(url: string): Promise<string> {
  try {
    if (!url) {
      throw new Error("URL is required");
    }

    const response = await fetchWithTimeout(`https://publicgoldofficial.com/page/${url}`, {
      cache: 'no-store' // Disable fetch caching
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.status}`);
    }

    const content = await response.text();
    return content;
  } catch (error) {
    console.error("Error in getPageContent:", error);
    throw error;
  }
} 