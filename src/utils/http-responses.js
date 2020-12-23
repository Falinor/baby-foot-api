import Http from 'http-status'

export const ok = (resource) => ({
  status: Http.OK,
  body: resource
})

export const created = (location) => (resource) => ({
  status: Http.CREATED,
  body: resource,
  location: `${location}/${resource.id}`
})

export const noContent = () => ({
  status: Http.NO_CONTENT,
  body: null
})

const httpError = (httpStatus) => (error) => ({
  status: httpStatus,
  name: Http[httpStatus].replace(/\s/g, '') + 'Error',
  body: error
})

export const notFound = httpError(Http.NOT_FOUND)
export const unprocessableEntity = httpError(Http.UNPROCESSABLE_ENTITY)
