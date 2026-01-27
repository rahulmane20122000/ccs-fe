import React, { useState, useEffect } from "react";
import { authAPI } from "../services/api";
import { User, Mail, Plus, Trash2 } from "lucide-react";

const LinkedAccounts = ({ userId }) => {
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLinkedAccounts();
    
    // Check URL params for link success/error
    const params = new URLSearchParams(window.location.search);
    const linkedAccountStatus = params.get('linkedAccount');
    const linkedEmail = params.get('email');
    const errorReason = params.get('reason');
    
    if (linkedAccountStatus === 'success') {
      // Refresh the list
      setTimeout(() => loadLinkedAccounts(), 500);
      alert(`Successfully linked account: ${linkedEmail || 'Unknown'}`);
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (linkedAccountStatus === 'error') {
      // Show specific error messages
      let errorMessage = 'Failed to link account. Please try again.';
      
      if (errorReason === 'primary_account') {
        errorMessage = '⚠️ This email is already registered as your primary account. You cannot link your primary account as a linked account.';
      } else if (errorReason === 'already_linked') {
        errorMessage = '⚠️ This email is already linked to another user account.';
      } else if (errorReason === 'save_failed') {
        errorMessage = '❌ Failed to save the linked account. Please try again.';
      } else if (errorReason === 'oauth_failed') {
        errorMessage = '❌ Google authentication failed. Please try again.';
      }
      
      alert(errorMessage);
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [userId]);

  const loadLinkedAccounts = async () => {
    setLoading(true);
    const accounts = await authAPI.getLinkedAccounts(userId);
    setLinkedAccounts(accounts);
    setLoading(false);
  };

  const handleLinkAccount = () => {
    authAPI.linkGoogleAccount(userId);
  };

  const handleUnlinkAccount = async (accountId) => {
    if (window.confirm("Are you sure you want to unlink this account?")) {
      const success = await authAPI.unlinkAccount(userId, accountId);
      if (success) {
        loadLinkedAccounts();
      } else {
        alert("Failed to unlink account. Please try again.");
      }
    }
  };

  return (
    <div className="linked-accounts-container">
      <div className="linked-accounts-header">
        <h2>Linked Google Accounts</h2>
        <button className="btn-link-account" onClick={handleLinkAccount}>
          <Plus size={18} />
          Link Another Account
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading linked accounts...</div>
      ) : (
        <div className="accounts-list">
          {linkedAccounts.length === 0 ? (
            <div className="empty-state">
              <Mail size={48} color="#999" />
              <p>No linked accounts yet</p>
              <p className="empty-subtitle">Link additional Google accounts to analyze all your spending in one place</p>
            </div>
          ) : (
            linkedAccounts.map((account) => (
              <div key={account.id} className={`account-card ${account.isPrimary ? 'primary-account' : ''}`}>
                <div className="account-info">
                  {account.picture ? (
                    <img 
                      src={account.picture} 
                      alt={account.name} 
                      className="account-avatar" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="account-avatar-placeholder">
                      <User size={24} />
                    </div>
                  )}
                  <div className="account-details">
                    <div className="account-name">
                      {account.name || "Unknown"}
                      {account.isPrimary && (
                        <span className="primary-badge">Primary</span>
                      )}
                    </div>
                    <div className="account-email">{account.email}</div>
                  </div>
                </div>
                {!account.isPrimary && (
                  <button
                    className="btn-unlink"
                    onClick={() => handleUnlinkAccount(account.id)}
                    title="Unlink this account"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default LinkedAccounts;
