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

const httpError = (httpStatus) => (error) => ({
  status: httpStatus,
  body: error
})

export const notFound = httpError(Http.NOT_FOUND)
export const unprocessableEntity = httpError(Http.UNPROCESSABLE_ENTITY)
