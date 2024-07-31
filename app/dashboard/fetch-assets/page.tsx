'use client';

import React, { useEffect, useState } from 'react';

interface EVPNode {
  id: string; 
  content: {
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
  };
  metadata: {
    controllers: string[];
    model: {
      _type: number;
      _cid: {
        "/": string;
      };
    };
    unique: Record<string, any>;
  };
  log: Array<{
    cid: {
      "/": string;
    };
    type: number;
    timestamp: number;
  }>;
}

const FetchAssetsPage = () => {
  const [evpOutputs, setEVPOutputs] = useState<EVPNode[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/ceramic/fetch-assets');
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        if (result.success && result.data) {
          setEVPOutputs(result.data);
        } else {
          console.error('No data returned');
          setError('No data returned');
        }
      } else {
        console.error('Failed to fetch EVP outputs');
        setError('Failed to fetch EVP outputs');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error fetching data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>EVP Report Outputs:</h1>
      {error && <p>{error}</p>}
      <ul>
        {evpOutputs.map((node, index) => (
          <li key={index}>
            <hr />
            <p>Type: {node.content.type}</p>
            <p>Date: {node.content.greenscore.date}</p>
            <p>Green Score: {node.content.greenscore.greenscoreDetails.green_score}</p>
            <p>Created At: {node.content.audit_document.created_at}</p>
            <p>Stream ID: {node.id}</p>
            <p>Metadata - CID: {node.metadata.model._cid["/"]}</p>
            <p>Metadata - Controller: {node.metadata.controllers.join(', ')}</p>
            <p>Log: {node.log.map(logEntry => `CID: ${logEntry.cid["/"]}, Type: ${logEntry.type}, Timestamp: ${logEntry.timestamp}`).join('; ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FetchAssetsPage;
