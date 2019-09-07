import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import _ from 'lodash'

import SearchBox from '../../components/SearchBox'
import PokemonCard from '../../components/PokemonCard'
import * as S from './styled'

import { Select, MenuItem, InputLabel } from '@material-ui/core'

function handleChange() {
  console.log('changing');
}

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

      <InputLabel htmlFor="age-helper">Search On</InputLabel>
      <Select
        value={1}
        onChange={handleChange}
        inputProps={{
          name: 'age',
          id: 'age-simple',
        }}
      >
        <MenuItem value={1}>All</MenuItem>
        <MenuItem value={2}>Type</MenuItem>
        <MenuItem value={3}>Weaknesses</MenuItem>
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
                  ? _.deburr(pokemon.name.toLowerCase()).includes(
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
