import { createContext, useState, type ReactNode } from 'react';

export type PaymentStatus = 'IDLE' | 'PROCESSING' | 'SUCCESS' | 'FAILED';

interface PaymentContextType {
  status: PaymentStatus;
  setStatus: (status: PaymentStatus) => void;
  activeProcessingPlan: string | null;
  setActiveProcessingPlan: (plan: string | null) => void;
  paymentError: string | null;
  setPaymentError: (error: string | null) => void;
}

export const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<PaymentStatus>('IDLE');
  const [activeProcessingPlan, setActiveProcessingPlan] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  return (
    <PaymentContext.Provider
      value={{
        status,
        setStatus,
        activeProcessingPlan,
        setActiveProcessingPlan,
        paymentError,
        setPaymentError,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};