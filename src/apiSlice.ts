// Import the RTK Query methods from the React-specific entry point
import { createEntityAdapter } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const correctWordsAdapter = createEntityAdapter()

// Define our single API slice object
export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    getCorrectWords: builder.query({
      query: () => '/answer_words.txt',
      transformResponse: (response: string) => {
        const words = response.split('\n')
        const getRandomIndex = (max) => Math.floor(Math.random() * max)

        return Array(3)
          .fill(null)
          .map(() =>
            Array(3)
              .fill(null)
              .map(() => words[getRandomIndex(words.length)])
          )
      },
    }),
    getPossibleWords: builder.query({
      query: () => '/possible_words.txt',
      transformResponse: (response: string) => {
        return response.split('\n')
      },
    }),
  }),
})

export const { useGetCorrectWordsQuery, useGetPossibleWordsQuery } = apiSlice
