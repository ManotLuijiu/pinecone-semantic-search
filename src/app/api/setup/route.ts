import { NextResponse } from "next/server";
import { PineconeClient } from '@pinecone-database/pinecone';
import {TextLoader} from 'langchain/document_loaders/fs/text'
import {PDFLoader} from 'langchain/document_loaders/fs/pdf'
import {DirectoryLoader} from 'langchain/document_loaders/fs/directory'
import { createPineconeIndex,updatePinecone } from "@/utils";
import { indexName } from "@/config";

export async function POST() {
    const loader = new DirectoryLoader('../../../documents', {
        ".txt": (path) => new TextLoader(path),
        ".md": (path) => new TextLoader(path),
        ".pdf": (path) => new PDFLoader(path),
    })

    const {PINECONE_API_KEY,PINECONE_ENVIRONMENT} = process.env

    const docs = await loader.load()
    const vectorDimensions = 1536

    const client = new PineconeClient()
    await client.init({
        apiKey: PINECONE_API_KEY || '',
        environment: PINECONE_ENVIRONMENT || '',
    })

    try {
        await createPineconeIndex(client, indexName,vectorDimensions)
        await updatePinecone(client, indexName, docs)
    } catch (error) {
        console.error('error: ', error)
    }

    return NextResponse.json({
        data: 'successfully created index and loaded data into pinecone...'
    })
}


