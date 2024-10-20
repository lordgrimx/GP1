import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';

interface TestResult {
  id: string;
  name: string;
  correct: number;
  date: string;
}

const Dashboard: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [newTest, setNewTest] = useState({ name: '', correct: '' });

  useEffect(() => {
    // TODO: Fetch test results from backend
    // For now, we'll use mock data
    const mockData: TestResult[] = [
      { id: '1', name: 'TYT Matematik Deneme 1', correct: 35, date: '2024-03-15' },
      { id: '2', name: 'AYT Fizik Deneme 2', correct: 28, date: '2024-03-18' },
    ];
    setTestResults(mockData);
  }, []);

  const handleAddTest = (e: React.FormEvent) => {
    e.preventDefault();
    const newTestResult: TestResult = {
      id: Date.now().toString(),
      name: newTest.name,
      correct: parseInt(newTest.correct),
      date: new Date().toISOString().split('T')[0],
    };
    setTestResults([...testResults, newTestResult]);
    setNewTest({ name: '', correct: '' });
  };

  const handleDeleteTest = (id: string) => {
    setTestResults(testResults.filter(test => test.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Deneme Sonuçları</h2>
      <form onSubmit={handleAddTest} className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="Deneme Adı"
          value={newTest.name}
          onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
          className="flex-grow px-3 py-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Doğru Sayısı"
          value={newTest.correct}
          onChange={(e) => setNewTest({ ...newTest, correct: e.target.value })}
          className="w-24 px-3 py-2 border rounded"
          required
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          <PlusCircle className="h-5 w-5" />
        </button>
      </form>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left">Deneme Adı</th>
            <th className="px-4 py-2 text-left">Doğru Sayısı</th>
            <th className="px-4 py-2 text-left">Tarih</th>
            <th className="px-4 py-2 text-left">İşlem</th>
          </tr>
        </thead>
        <tbody>
          {testResults.map((test) => (
            <tr key={test.id} className="border-b">
              <td className="px-4 py-2">{test.name}</td>
              <td className="px-4 py-2">{test.correct}</td>
              <td className="px-4 py-2">{test.date}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleDeleteTest(test.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;