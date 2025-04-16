import { useState } from "react";

interface Props {
  onTreinamentoConcluido: () => void;
}

export default function UploadCsvTreinamento({ onTreinamentoConcluido }: Props) {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [status, setStatus] = useState<"ok" | "erro" | null>(null);
  const [carregando, setCarregando] = useState(false);


  const enviarArquivo = async () => {
    if (!arquivo) {
      setMensagem("Selecione um arquivo CSV primeiro.");
      setStatus("erro");
      return;
    }
    setCarregando(true);

    const formData = new FormData();
    formData.append("Arquivo", arquivo);

    try {
      const resposta = await fetch("https://localhost:7069/api/fornecedor/upload-csv", {
        method: "POST",
        body: formData,
      });

      const texto = await resposta.text();
      setMensagem(texto);
      setStatus(resposta.ok ? "ok" : "erro");

      if (resposta.ok) {
        onTreinamentoConcluido();
      }
    } catch (error) {
      setMensagem("Erro ao enviar arquivo." + error);
      setStatus("erro");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Treinar Modelo com CSV</h2>

      <input
        type="file"
        accept=".csv"
        onChange={(e) => setArquivo(e.target.files?.[0] || null)}
        className="mb-4"
      />

      <button
        onClick={enviarArquivo}
        disabled={!arquivo || carregando}
        className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 ${carregando ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {carregando ? "Treinando..." : "Enviar CSV"}
      </button>

      {mensagem && (
        <p className={`mt-4 ${status === "ok" ? "text-green-600" : "text-red-600"}`}>
          {mensagem}
        </p>
      )}
    </div>
  );
}