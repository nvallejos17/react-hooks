// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [{status, pokemon, error}, setState] = React.useState({
    status: 'idle',
    pokemon: null,
    error: null,
  })

  React.useEffect(() => {
    if (pokemonName) {
      setState({status: 'pending'})
      fetchPokemon(pokemonName).then(
        pokemon =>
          setState({
            pokemon,
            status: 'resolved',
          }),
        // NOTE: Using ".then" second argument instead of ".catch" will ONLY catch errors on the fetchPokemon call. This is useful when we don't want to catch other kind of errors. For example, when calling setPokemon (React handles their own errors, but we can catch them anyway)
        error =>
          setState({
            error,
            status: 'rejected',
          }),
      )
    }
  }, [pokemonName])

  return (
    <>
      {status === 'idle' && 'Submit a pokemon'}
      {status === 'pending' && <PokemonInfoFallback name={pokemonName} />}
      {status === 'resolved' && <PokemonDataView pokemon={pokemon} />}
      {status === 'rejected' && (
        <div role="alert">
          There was an error:{' '}
          <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
        </div>
      )}
    </>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
