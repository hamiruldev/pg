'use client';

import { useEffect, useState } from "react";

const TOKEN = 'Ns-d1nsty5IhoxzzTef6xZY_zrmbZwI5FDq-ai-C';

const DEALERS_URL = 'https://app.nocodb.com/api/v2/tables/m21ipqeu0aarax6/records?offset=0&limit=25&viewId=vwymej52p216msjv';
const REDIRECT_INDEX_URL = 'https://app.nocodb.com/api/v2/tables/m5oicmtoi8r75kt/records?offset=0&limit=1&viewId=vwnkrkslt1tjqkwi';
const REDIRECT_INDEX_PATCH_URL = 'https://app.nocodb.com/api/v2/tables/m5oicmtoi8r75kt/records';

const options = {
  headers: {
    'xc-token': TOKEN,
    'Content-Type': 'application/json'
  }
};

async function handleRedirect() {
  try {
    // Step 1: Get dealer list
    const dealersRes = await fetch(DEALERS_URL, options);
    const dealersData = await dealersRes.json();
    const dealers = dealersData.list;

    if (!dealers || dealers.length === 0) {
      console.error("No dealers available.");
      return;
    }

    // Step 2: Get current redirect index
    const indexRes = await fetch(REDIRECT_INDEX_URL, options);
    const indexData = await indexRes.json();

    const redirectRow = indexData.list?.[0];

    if (!redirectRow || typeof redirectRow.current_index !== 'number') {
      console.error("Invalid redirect index.");
      return;
    }

    const currentIndex = redirectRow.current_index;
    const nextIndex = (currentIndex + 1) % dealers.length;
    const selectedDealer = dealers[nextIndex];

    if (!selectedDealer.url) {
      console.error("Selected dealer missing URL.");
      return;
    }

    // Step 3: Update index in NocoDB
    const updateOptions = {
      ...options,
      method: 'PATCH',
      body: JSON.stringify({
        current_index: nextIndex,
        Id: 34,
      })
    };

    const updateResponse = await fetch(REDIRECT_INDEX_PATCH_URL, updateOptions);
    const updateData = await updateResponse.json();

    if (!updateResponse.ok) {
      console.error("Failed to update index:", updateData);
      return;
    }

    // Step 4: Redirect user using window.location only after successful update
    window.location.href = selectedDealer.url;

  } catch (err) {
    console.error("Redirect error:", err);
  }
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initRedirect = async () => {
      setIsLoading(true);
      await handleRedirect();
    };
    initRedirect();
  }, []);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div className="loading-spinner" style={{
          width: '50px',
          height: '50px',
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p>Redirecting...</p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return null;
}

