// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 text-center">
          <img 
            src="/images/LOGO.png" 
            alt="King of Apes Logo" 
            className="img-fluid mb-4"
            style={{ maxWidth: '200px' }}
          />
          
          <h1 className="display-4 mb-4">Welcome to King of Apes</h1>
          
          <p className="lead mb-4">
            This simplified application demonstrates wallet connectivity and NFT minting functionality.
          </p>
          
          <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
            <Link to="/nft-mint" className="btn btn-primary btn-lg px-4 gap-3">
              Mint NFT
            </Link>
          </div>
        </div>
      </div>
      
      <div className="row mt-5">
        <div className="col-md-6 offset-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Features</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Wallet Connectivity</li>
                <li className="list-group-item">NFT Minting Interface</li>
                <li className="list-group-item">React Router Navigation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
