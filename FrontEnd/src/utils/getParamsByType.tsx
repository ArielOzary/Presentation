interface Props {
  type: string
  queryParams: URLSearchParams
}

export const paramsByType = ({ type, queryParams }: Props) => {
  const allParams = queryParams.getAll(type)

  if (!allParams.length) {
    return undefined
  } else {
    return allParams.map(id => (type === 'clients' ? id : Number(id)))
  }
}
