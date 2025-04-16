import HomeClient from '@/components/movies/HomeClient';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Popular Movies</h1>
      <HomeClient />
    </main>
  );
}