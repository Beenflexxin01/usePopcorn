import { useState, useEffect } from "react";

const KEY = "a19f0502";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
    //   callback?.();
      const controller = new AbortController();
      async function fetchedMovies() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            return new Error("Something went wrong with fetching movies");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (error.name === "AbortError") {
            console.error(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (query < 3) {
        setMovies([]);
        setError("");
        return;
      }

      fetchedMovies();

      return function () {
        controller.abort();
      };
    },
    [query, error.name]
  );

  return { movies, isLoading, error };
}
