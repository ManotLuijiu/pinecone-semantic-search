import { indexName } from '@/config';
import { queryPineconeVectorStoreAndQueryLLM } from '@/utils';
import { PineconeClient } from '@pinecone-database/pinecone';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { PINECONE_API_KEY, PINECONE_ENVIRONMENT } = process.env;
  const body = await req.json();
  const client = new PineconeClient();
  await client.init({
    apiKey: PINECONE_API_KEY || '',
    environment: PINECONE_ENVIRONMENT || '',
  });
  const text = await queryPineconeVectorStoreAndQueryLLM(
    client,
    indexName,
    body,
  );
  return NextResponse.json({
    data: text,
  });
}
