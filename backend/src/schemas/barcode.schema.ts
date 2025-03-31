import Joi from 'joi';

const barcodeSchema = Joi.object({
  barcode: Joi.string().required(),
  title: Joi.string().required(),
  brand: Joi.string().required(),
});

export default barcodeSchema;
