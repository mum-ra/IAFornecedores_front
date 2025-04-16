import { useState } from 'react';
import ClassificadorFornecedor from './components/ClassificadorFornecedor';
import UploadCsvTreinamento from './components/UploadCsvTreinamento';

export default function App() {
  const [modeloTreinado, setModeloTreinado] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-5xl p-6 border rounded shadow-md bg-white space-y-6">
      <UploadCsvTreinamento onTreinamentoConcluido={() => setModeloTreinado(true)} />
      <ClassificadorFornecedor modeloTreinado={modeloTreinado} />
      </div>
    </div>
  );
}
