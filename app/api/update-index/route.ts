import { NextResponse } from 'next/server';

const TOKEN = 'Ns-d1nsty5IhoxzzTef6xZY_zrmbZwI5FDq-ai-C';
const DEALERS_URL = 'https://app.nocodb.com/api/v2/tables/m21ipqeu0aarax6/records?offset=0&limit=25&viewId=vwymej52p216msjv';
const REDIRECT_INDEX_URL = 'https://app.nocodb.com/api/v2/tables/m5oicmtoi8r75kt/records?offset=0&limit=1&viewId=vwnkrkslt1tjqkwi';
const REDIRECT_INDEX_PATCH_URL = 'https://app.nocodb.com/api/v2/tables/m5oicmtoi8r75kt/records';

const headers = {
  'xc-token': TOKEN,
  'Content-Type': 'application/json'
};

export async function GET() {
  try {
    // Step 1: Get dealer list
    const dealersRes = await fetch(DEALERS_URL, { headers });
    const dealersData = await dealersRes.json();
    const dealers = dealersData.list;

    if (!dealers || dealers.length === 0) {
      return NextResponse.json({ error: "No dealers available." }, { status: 500 });
    }

    // Step 2: Get current redirect index
    const indexRes = await fetch(REDIRECT_INDEX_URL, { headers });
    const indexData = await indexRes.json();

    const redirectRow = indexData.list?.[0];

    if (!redirectRow || typeof redirectRow.current_index !== 'number') {
      return NextResponse.json({ error: "Invalid redirect index." }, { status: 500 });
    }

    const currentIndex = redirectRow.current_index;
    const nextIndex = (currentIndex + 1) % dealers.length;
    const selectedDealer = dealers[nextIndex];

    if (!selectedDealer.url) {
      return NextResponse.json({ error: "Selected dealer missing URL." }, { status: 500 });
    }

    // Step 3: Update index in NocoDB
    const updateResponse = await fetch(REDIRECT_INDEX_PATCH_URL, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        current_index: nextIndex,
        Id: 34,
      })
    });

    if (!updateResponse.ok) {
      return NextResponse.json({ error: "Failed to update index." }, { status: 500 });
    }

    // Return the selected dealer URL
    return NextResponse.json({ url: selectedDealer.url });

  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
} 