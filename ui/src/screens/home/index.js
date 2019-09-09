import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Select, MenuItem, InputLabel } from '@material-ui/core'
import { gql } from 'apollo-boost'
import _ from 'lodash'
import SearchBox from '../../components/SearchBox'
import PokemonCard from '../../components/PokemonCard'
import * as S from './styled'

export default function HomeScreen() {
  const { loading, error, data } = useQuery(gql`
    {
      pokemonMany {
        name
        num
        img
        type
        weaknesses
      }
    }
  `)

  const [values, setValues] = React.useState({
    searchOpt: 0,
  });

  function handleChange(event) {
    setValues(oldValues => ({
      ...oldValues,
      [event.target.name]: event.target.value,
    }));
  }

  function searchString(pokemon) {
    if (values.searchOpt === 1) {
      return pokemon.type.toString().toLowerCase()
    } else if (values.searchOpt === 2) {
      return pokemon.weaknesses.toString().toLowerCase()
    }
    return pokemon.name.toLowerCase()
  }

  if (loading)
    return (
      <S.Container>
        <p>Loading...</p>
      </S.Container>
    )
  if (error)
    return (
      <S.Container>
        <p>Error :(</p>
      </S.Container>
    )
  return (
    <S.Container>
      <h1>Pokédex</h1>
      <InputLabel htmlFor="search-select">Search On...</InputLabel>
        <Select
          value={values.searchOpt}
          onChange={handleChange}
          inputProps={{
            name: 'searchOpt',
            id: 'search-select',
          }}
        >
          <MenuItem value={0}>Name</MenuItem>
          <MenuItem value={1}>Type</MenuItem>
          <MenuItem value={2}>Weakness</MenuItem>
        </Select>

      <SearchBox
        suggestions={data.pokemonMany.map(pokemon => ({
          label: pokemon.name,
          value: pokemon.num,
        }))}
      >
        {searchValue => (
          <S.Grid>
            {data.pokemonMany
              .filter(pokemon =>
                searchValue
                  ? _.deburr(searchString(pokemon)).includes(
                      _.deburr(searchValue.toLowerCase())
                    )
                  : true
              )
              .map(pokemon => (
                <S.CardContainer key={pokemon.num}>
                  <S.CardLink to={`/${pokemon.num}`}>
                    <PokemonCard
                      key={pokemon.num}
                      pokemon={pokemon}
                      isSmall
                      animateHovering
                    />
                  </S.CardLink>
                </S.CardContainer>
              ))}
          </S.Grid>
        )}
      </SearchBox>
    </S.Container>
  )
}
