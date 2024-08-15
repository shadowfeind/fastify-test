import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const productInput = {
  title: z.string(),
  price: z.number(),
  content: z.string().optional(),
};

const productGenerated = {
  id: z.number(),
  createdAt: z.string(),
  updateAt: z.string(),
};

const createProductSchema = z.object({
  ...productInput,
});

// for both single product and for response same object
const productResponseSchema = z.object({
  ...productInput,
  ...productGenerated,
});

const allProductsSchema = z.array(productResponseSchema);

export type CreateProductType = z.infer<typeof createProductSchema>;

export const { schemas: productSchemas, $ref } = buildJsonSchemas({
  createProductSchema,
  productResponseSchema,
  allProductsSchema,
});
