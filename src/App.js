import React, { useState, useEffect, useCallback } from 'react'
import MoviesList from './components/MoviesList'
import AddMovie from './components/AddMovie'
import './App.css'

function App() {
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchMovieHandler = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`
      )
      const data = await response.json()
      console.log(data.results)

      const loadedMovies = []

      data.results.forEach((movie) => {
        console.log(movie.id)
        loadedMovies.push({
          id: movie.id,
          title: movie.title,
          openingText: movie.overview,
          releaseDate: movie.release_date,
        })
      })

      for (const movie in data.results) {
        console.log(movie['id'])
        // loadedMovies.push({
        //   id: movie.id,
        //   title: movie.title,
        //   openingText: movie.overview,
        //   releaseDate: movie.release_date,
        // })
        // console.log(loadedMovies)
      }

      // if (!response.ok) {
      //   throw new Error('Something went wrong.')
      // }
      setMovies(loadedMovies)
    } catch (error) {
      setError(error.message)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    fetchMovieHandler()
  }, [fetchMovieHandler])

  const addMovieHandler = async (movie) => {
    const response = await fetch(
      `https://react-http-538cd-default-rtdb.firebaseio.com/movies.json`,
      {
        method: 'POST',
        body: JSON.stringify(movie),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    const data = await response.json()
    console.log(data)
  }

  let content = <p>Found no Movies</p>

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />
  }

  if (error) {
    content = <p>{error}</p>
  }

  if (isLoading) {
    content = <p>Loading.....</p>
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  )
}

export default App
