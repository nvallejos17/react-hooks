// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

const defaultOptions = {
  serialize: JSON.stringify,
  deserialize: JSON.parse,
}

const useLocalStorageState = (
  key,
  defaultValue = '',
  {serialize, deserialize} = defaultOptions,
) => {
  // NOTE: Calling useState with a function (lazy initialization) avoids performance bottlenecks. This is because that function is called only the first time the component is rendered (on mount). There is no need to always do this, but in this case, accessing localStorage could be expensive
  const [state, setState] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)

    return valueInLocalStorage
      ? deserialize(valueInLocalStorage)
      : typeof defaultValue === 'function'
      ? defaultValue()
      : defaultValue
  })

  // NOTE: Create a reference of the current key
  const prevKeyRef = React.useRef(key)

  // NOTE: Is very important to add the dependecy array, because we only want to write in localStorage everytime the state changes. If we don't add this dependency, the side effect will happen on every re-render of the component. For example, when a parent component gets re-rendered.
  React.useEffect(() => {
    // Check if the key name has changed, so we can remove unwanted key/value pairs from localStorage
    if (prevKeyRef.current !== key) {
      window.localStorage.removeItem(prevKeyRef.current)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(state))
  }, [key, serialize, state])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name', initialName)

  const handleChange = e => setName(e.target.value)

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
