import { getGameBySlug } from "@/lib/gameQueries";
import GameEmulator from "@/components/GameEmulator";

export async function generateMetadata({ params }) {
  const { slug } = params;
  const game = await getGameBySlug(slug);
  const title = game?.title + " - TheNextGamePlatform" || "TheNextGamePlatform Retro Game";
  const description = game?.description || "Discover the best free Retro Games";

  return {
    title,
    description,
  };
}

export default async function Page({ params }) {
  const { slug } = params; // Await the params if necessary
  const game = await getGameBySlug(slug); // Fetch game details

  if (!game) {
    return <div>Game not found</div>; // Return a fallback UI if no game is found
  }

  return (
    <div>
      <nav className="rounded-md w-full mb-4">
        <ol className="list-reset flex">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <span className="text-gray-500 mx-2">/</span>
          </li>
          <li>
            <a href={game?.categories[0]?.title}>{game?.categories[0]?.title}</a>
          </li>
          <li>
            <span className="text-gray-500 mx-2">/</span>
          </li>
          <li>
            <span className="text-gray-500">{game?.title}</span>
          </li>
        </ol>
      </nav>

      <GameEmulator game={game} />

      <div className="mt-8">
        {/* Display Related Games */}
        <h2 className="text-xl font-bold">Related Games</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {/* Replace with actual related games */}
          {game?.relatedGames?.map((relatedGame) => (
            <div key={relatedGame.id} className="bg-white p-4 rounded-md shadow-md">
              <h3 className="font-semibold">{relatedGame.title}</h3>
              <p>{relatedGame.description}</p>
              <a href={`/game/${relatedGame.slug}`} className="text-blue-500 mt-2 inline-block">Play Now</a>
            </div>
          ))}

          {/* Fallback if no related games are available */}
          {!game?.relatedGames?.length && (
            <p>No related games available at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}

