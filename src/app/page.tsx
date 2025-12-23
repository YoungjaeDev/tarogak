export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-900 to-black text-white">
      <h1 className="text-4xl font-bold mb-4">타로각</h1>
      <p className="text-lg text-gray-300 mb-8">AI가 해석하는 당신만의 타로 리딩</p>
      <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors">
        카드 뽑기
      </button>
    </main>
  );
}
