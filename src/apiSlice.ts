// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define our single API slice object
export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    getCorrectWords: builder.query({
      query: () => ({ url: '/answer_words.txt', responseHandler: 'text' }),
      transformResponse: (response: string) => {
        const words = response.split('\n')
        const getRandomIndex = (max: number) => Math.floor(Math.random() * max)

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
      query: () => ({ url: '/possible_words.txt', responseHandler: 'text' }),
      transformResponse: (response: string) => {
        return response.split('\n')
      },
    }),
  }),
})

export const { useGetCorrectWordsQuery, useGetPossibleWordsQuery } = apiSlice
