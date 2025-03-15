import React, { useState, useEffect, useRef } from "react";

interface BankBalanceProps {
  initialBalance?: string;
  initialLastUpdated?: string;
}

const BankBalance: React.FC<BankBalanceProps> = ({
  initialBalance = "₹0.00",
  initialLastUpdated = "Never",
}) => {
  const [balance, setBalance] = useState<string>(initialBalance);
  const [lastUpdated, setLastUpdated] = useState<string>(initialLastUpdated);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedBalance = localStorage.getItem("balance") || "₹0.00";
    const savedLastUpdated = localStorage.getItem("lastUpdated") || "Never";

    setBalance(savedBalance);
    setLastUpdated(
      savedLastUpdated
        ? `Last updated: ${savedLastUpdated}`
        : "Last updated: Never"
    );

    applyColorCoding(savedBalance);
  }, []);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const formatBalance = (amount: number): string => {
    return (
      "₹" +
      amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  };

  const applyColorCoding = (balanceText: string): void => {
    const balanceElement = document.getElementById("balance-amount");
    if (!balanceElement) return;

    const amount = parseFloat(balanceText.replace(/[₹,]/g, ""));

    if (amount < 10000) {
      balanceElement.style.color = "#ff4d4d";
    } else if (amount >= 10000 && amount <= 50000) {
      balanceElement.style.color = "#ffa64d";
    } else {
      balanceElement.style.color = "#4dff88";
    }
  };

  const handleBalanceUpdate = (): void => {
    const now = new Date();
    const formattedDate = now.toLocaleString();
    setLastUpdated(`Last updated: ${formattedDate}`);

    applyColorCoding(balance);

    localStorage.setItem("balance", balance);
    localStorage.setItem("lastUpdated", formattedDate);

    setIsEditing(false);
  };

  const handleBalanceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setBalance(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();

      const amount = parseFloat(balance.replace(/[₹,]/g, "")) || 0;
      setBalance(formatBalance(amount));

      handleBalanceUpdate();
    }
  };

  const handleBlur = (): void => {
    const amount = parseFloat(balance.replace(/[₹,]/g, "")) || 0;
    setBalance(formatBalance(amount));

    handleBalanceUpdate();
  };

  return (
    <div className="finance-section">
      <div className="balance-card">
        <div className="balance-header">
          <h3>Current Bank Balance</h3>
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        </div>
        <input
          className="balance-amount bg-transparent border-none w-full"
          id="balance-amount"
          ref={inputRef}
          value={balance}
          disabled={!isEditing}
          onChange={handleBalanceChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
        <div className="last-updated">{lastUpdated}</div>
      </div>
    </div>
  );
};

export default BankBalance;
