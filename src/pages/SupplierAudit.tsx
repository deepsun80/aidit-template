'use client';

import { useState, useEffect } from 'react';
import SupplierList from '@/components/SupplierList';
import SupplierAssessmentView from '@/components/SupplierAssessmentView';
import RunAssessment from '@/components/RunAssessment';
import { allSuppliers } from '@/components/SupplierList';

type Supplier = {
  name: string;
  date: string;
  risk: 'low' | 'medium' | 'high';
};

export default function SupplierAudit() {
  const [activeSupplier, setActiveSupplier] = useState<Supplier | null>(null);
  const [runningAssessment, setRunningAssessment] = useState(false);

  useEffect(() => {
    setActiveSupplier(allSuppliers[1]);
  }, []);

  return (
    <div className='text-gray-900'>
      {!activeSupplier && (
        <SupplierList setActiveSupplier={setActiveSupplier} />
      )}

      {activeSupplier && !runningAssessment && (
        <SupplierAssessmentView
          supplier={activeSupplier}
          onRunAssessment={() => setRunningAssessment(true)}
          onBack={() => setActiveSupplier(null)}
        />
      )}

      {activeSupplier && runningAssessment && (
        <RunAssessment
          supplier={activeSupplier}
          onCancel={() => {
            setRunningAssessment(false);
          }}
        />
      )}
    </div>
  );
}
