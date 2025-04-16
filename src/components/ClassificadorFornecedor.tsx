import { useState } from "react";

interface Props {
  modeloTreinado: boolean;
}

export default function ClassificadorFornecedor({ modeloTreinado }: Props) {
  const [tempoEntrega, setTempoEntrega] = useState(0);
  const [qualidade, setQualidade] = useState(0);
  const [custo, setCusto] = useState(0);
  const [categoria, setCategoria] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [metricas, setMetricas] = useState<any>(null);

  const classificar = async () => {
    setErro(null);
    setCategoria(null);

    try {
      const resposta = await fetch("https://localhost:7069/api/fornecedor/classificar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tempoEntrega, qualidade, custo }),
      });

      if (!resposta.ok) {
        const erro = await resposta.text();
        setErro(erro);
      } else {
        const categoria = await resposta.text();
        setCategoria(categoria);
      }
    } catch (e) {
      setErro("Erro ao conectar com a API.");
    }
  };

  const avaliarModelo = async () => {
    try {
      const resposta = await fetch(
        "https://localhost:7069/api/fornecedor/avaliar-modelo?caminhoTesteCsv=C:/lab/FornecedorIA/fornecedores_treino.csv",
        { method: "POST" }
      );

      const resultado = await resposta.json();
      setMetricas(resultado);
    } catch (error) {
      console.error("Erro ao avaliar modelo", error);
    }
  };

  const classeClassificada = ['Crítico', 'Médio', 'Confiável']

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-3xl p-6 border rounded shadow-md bg-white space-y-6">
        <h1 className="text-2xl font-bold text-center">Classificação de Fornecedor</h1>

        <div className="grid grid-cols-1 gap-4">
          <label className="flex flex-col">
            Tempo de Entrega
            <input
              type="number"
              value={tempoEntrega}
              onChange={(e) => setTempoEntrega(Number(e.target.value))}
              className="border p-2 rounded"
            />
          </label>

          <label className="flex flex-col">
            Qualidade
            <input
              type="number"
              value={qualidade}
              onChange={(e) => setQualidade(Number(e.target.value))}
              className="border p-2 rounded"
            />
          </label>

          <label className="flex flex-col">
            Custo
            <input
              type="number"
              value={custo}
              onChange={(e) => setCusto(Number(e.target.value))}
              className="border p-2 rounded"
            />
          </label>
        </div>

        <button
          onClick={classificar}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          disabled={!modeloTreinado}
        >
          Classificar
        </button>

        {categoria && <p>Categoria: <strong>{categoria}</strong></p>}
        {erro && <p className="text-red-600">{erro}</p>}
        {!modeloTreinado && <p className="text-yellow-600">⚠️ O modelo ainda não foi treinado.</p>}

        {modeloTreinado && (
          <button
            onClick={avaliarModelo}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Avaliar Modelo
          </button>
        )}

        {metricas && (
          <>
                      <div>
              <h2 className="text-lg font-semibold mt-4">Legenda das Métricas</h2>
              <table className="w-full text-sm border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-1">Métrica</th>
                    <th className="border p-1">Fórmula</th>
                    <th className="border p-1">Descrição</th>
                    <th className="border p-1">Melhor Valor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-1">Acurácia (Accuracy)</td>
                    <td className="border p-1">(TP + TN) / (TP + TN + FP + FN)</td>
                    <td className="border p-1">Proporção de classificações corretas.</td>
                    <td className="border p-1">Próximo de 1 (100%)</td>
                  </tr>
                  <tr>
                    <td className="border p-1">Precisão (Precision)</td>
                    <td className="border p-1">TP / (TP + FP)</td>
                    <td className="border p-1">Entre os classificados como positivos, quantos realmente são positivos.</td>
                    <td className="border p-1">Próximo de 1</td>
                  </tr>
                  <tr>
                    <td className="border p-1">Revocação (Recall)</td>
                    <td className="border p-1">TP / (TP + FN)</td>
                    <td className="border p-1">Entre os realmente positivos, quantos foram corretamente identificados.</td>
                    <td className="border p-1">Próximo de 1</td>
                  </tr>
                  <tr>
                    <td className="border p-1">F1 Score</td>
                    <td className="border p-1">2 * (Precisão * Revocação) / (Precisão + Revocação)</td>
                    <td className="border p-1">Média harmônica entre precisão e revocação.</td>
                    <td className="border p-1">Próximo de 1</td>
                  </tr>
                  <tr>
                    <td className="border p-1">Log Loss</td>
                    <td className="border p-1">-1/N * Σ(y log(p) + (1 - y) log(1 - p))</td>
                    <td className="border p-1">Penaliza predições erradas e confiantes. Mede incerteza.</td>
                    <td className="border p-1">Próximo de 0</td>
                  </tr>
                  <tr>
                    <td className="border p-1">Log Loss Reduction</td>
                    <td className="border p-1">1 - (LogLoss_model / LogLoss_base)</td>
                    <td className="border p-1">Quanto o modelo é melhor que um classificador aleatório.</td>
                    <td className="border p-1">Próximo de 1</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-2">Métricas por Classe</h2>
              <table className="w-full border text-sm">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-1">Classe</th>
                    <th className="border p-1">Precisão</th>
                    <th className="border p-1">Revocação</th>
                    <th className="border p-1">F1 Score</th>
                  </tr>
                </thead>
                <tbody>
                  {metricas.metricasPorClasse.map((linha: any, i: number) => (
                    <tr key={i}>
                      <td className="border p-1">{classeClassificada[i]}</td>
                      <td className="border p-1">{linha.precisao}</td>
                      <td className="border p-1">{linha.revocacao}</td>
                      <td className="border p-1">{linha.f1Score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <h2 className="text-lg font-semibold mt-4">Métricas Agregadas</h2>
              <ul className="list-disc list-inside text-sm">
                <li><strong>Macro Accuracy:</strong> {metricas.macroAccuracy}</li>
                <li><strong>Micro Accuracy:</strong> {metricas.microAccuracy}</li>
                <li><strong>Log Loss:</strong> {metricas.logLoss}</li>
                <li><strong>Log Loss Reduction:</strong> {metricas.logLossReduction}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold mt-4">Matriz de Confusão</h2>
              <table className="w-full border text-sm">
                <tbody>
                  <tr className="text-center">
                    <td></td>
                    <td>{classeClassificada[0]}</td>
                    <td>{classeClassificada[1]}</td>
                    <td>{classeClassificada[2]}</td>
                    </tr>
                  {metricas.matrizConfusao.map((linha: number[], i: number) => (
                    <tr key={i}>
                      <td className="w-1">{classeClassificada[i]}</td>
                      {linha.map((val: number, j: number) => (
                        <td key={j} className={`${i!=j?'bg-[#FFCCCC]':'bg-[#CCCCFF]'} border p-1 text-center`}>{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>


          </>
        )}
      </div>
    </div>
  );
}
