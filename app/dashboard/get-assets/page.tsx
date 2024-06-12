'use client'

import React, { useEffect, useState } from 'react';

// Define a simple interface for the document structure
interface DocumentNode {
  id: string; 
  type: string;
  greenscore: {
    date: string;
    greenscoreDetails: {
      green_score: number;
    };
  };
  audit_document: {
    created_at: string;
  };
}

interface Edge {
  node: DocumentNode;
}

const AddAssetPage = () => {
  // Initialize state with a type
  const [documents, setDocuments] = useState<Edge[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/ceramic/fetch-assets');
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.data.storageProviderAuditReportDocuments.edges);
      } else {
        console.error('Failed to fetch documents');
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>EVP Report Documents</h1>
      <ul>
        {documents.map(({ node }, index) => (
          <li key={index}>
            <h2>{node.type}</h2>
            <p>Date: {node.greenscore.date}</p>
            <p>Green Score: {node.greenscore.greenscoreDetails.green_score}</p>
            <p>Created At: {node.audit_document.created_at}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddAssetPage;
