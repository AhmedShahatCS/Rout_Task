export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    // Add more properties as needed based on your application requirements
  }

  export interface Transaction {
    id: number;
    customer_id: number; // ID of the customer associated with this transaction
    amount: number; // Transaction amount
    date: string; // Date of the transaction, stored as a string for simplicity
    // Add more properties as needed based on your application requirements
  }
