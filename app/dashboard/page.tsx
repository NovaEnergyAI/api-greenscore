import React from 'react';
import { KeyIcon, DocumentTextIcon, EyeIcon, CheckCircleIcon, CloudArrowDownIcon } from '@heroicons/react/24/outline';

export default function Page() {
  return (
    <div className="dashboard-page">
      <h2 className="dashboard-page__heading">Ceramic Integration Demo</h2>
      <p className="dashboard-page__text">Welcome to the Ceramic Integration Demo. Follow the steps below to interact with the network:</p>
      <div className="dashboard-page__steps">
        <div className="dashboard-card">
          <div className="dashboard-card__content">
            <KeyIcon className="dashboard-card__icon" />
            <div>
              <p className="dashboard-card__title">Step 1: Authenticate</p>
              <p className="dashboard-card__description">Authenticate yourself on the Ceramic Network to start using the dashboard features.</p>
            </div>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card__content">
            <DocumentTextIcon className="dashboard-card__icon" />
            <div>
              <p className="dashboard-card__title">Step 2: Create a Stream</p>
              <p className="dashboard-card__description">Use a Document ID to create a new stream on the Ceramic Network and save your data.</p>
            </div>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card__content">
            <EyeIcon className="dashboard-card__icon" />
            <div>
              <p className="dashboard-card__title">Step 3: View a Stream</p>
              <p className="dashboard-card__description">Fetch a stream by its ID to view detailed information and verify the data.</p>
            </div>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card__content">
            <CloudArrowDownIcon className="dashboard-card__icon" />
            <div>
              <p className="dashboard-card__title">Step 4: Fetch All Streams</p>
              <p className="dashboard-card__description">View all the fetched streams stored on the Ceramic Network to get a comprehensive overview.</p>
            </div>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card__content">
            <CheckCircleIcon className="dashboard-card__icon" />
            <div>
              <p className="dashboard-card__title">Step 5: Attest to Data</p>
              <p className="dashboard-card__description">Attest to the data models stored on the Ceramic Network, ensuring data integrity and trust.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
