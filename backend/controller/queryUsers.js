const key1 = (keyword) => {
  return keyword
    ? {
        name: {
          $regex: keyword,
          $options: 'i',
        },
      }
    : {}
}

const key2 = (keyword) => {
  return keyword
    ? {
        email: {
          $regex: keyword,
          $options: 'i',
        },
      }
    : {}
}
export const Query = (keywords) => {
  return [{ ...key1(keywords) }, { ...key2(keywords) }]
}
