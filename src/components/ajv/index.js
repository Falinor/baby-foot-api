import Ajv from 'ajv';

const ajv = new Ajv(/* TODO(options) */);

export const validate = schemaRef => (req, res, next) => {
  const valid = ajv.validate(schemaRef, req.body);
  if (!valid) {
    return res.status(400).json(ajv.errors);
  }
  next();
};

export default ajv;
