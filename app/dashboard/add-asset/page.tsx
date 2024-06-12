'use client'

import React, { useState } from 'react';

export default function Page() {
    const [jsonInput, setJsonInput] = useState('');

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];  
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (typeof e.target?.result === 'string') {
                    setJsonInput(e.target.result); 
                } else {
                    alert('Failed to load the file as text');
                }
            };
            reader.readAsText(file);
        } else {
            alert('No file selected or file access was denied.');
        }
    };

    const addEVPAsset= async () => {
        console.log("Sending request to API");
        let jsonData;

        try {
            jsonData = JSON.parse(jsonInput);
            console.log(jsonData);
        } catch (error) {
            alert('Invalid JSON format');
            return;
        }

        const response = await fetch('/api/ceramic/add-asset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData),
        });

        const result = await response.json();
        console.log("Response from API:", result);
        
        if (result.success) {
            console.log('Audit Report added successfully:', result.data);
            alert('Audit Report added successfully');
        } else {
            console.error('Failed to add audit report:', result.message);
            alert('Failed to add audit report');
        }
    };

    return (
        <div>
            <h1>Add Audit Report</h1>
            <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste your JSON here or upload a file below."
                style={{ width: '300px', height: '200px' }}
            />
            <div>
                <input type="file" onChange={handleFileUpload} accept=".json" />
            </div>
            <button onClick={addEVPAsset}>Submit EVP Report</button>
        </div>
    );
}
