import { Router } from "express";
import { body, param, query } from "express-validator";
import { validateJwt } from "../middleware/validate-jwt.js";
import { isAdminLogged } from "../middleware/is-logged.js";
import { validateRequestParams } from "../middleware/validate-request-params.js";
import {
  putHotel,
  hotelPost,
  hotelsGet,
  getHotelById,
  hotelDelete,
} from "../controller/hoteles.controller.js";

const router = Router();

router.get(
  "/",
  [
    query("limite")
      .optional()
      .isNumeric()
      .withMessage("El límite debe ser un valor numérico"),
    query("desde")
      .optional()
      .isNumeric()
      .withMessage("El valor desde debe ser numérico"),
    validateRequestParams,
  ],
  hotelsGet,
);

router.get(
  "/:id",
  [param("id").isMongoId(), validateRequestParams],
  getHotelById,
);

router.put(
  "/:id",
  [
    validateJwt,
    isAdminLogged,
    param("id").isMongoId(),
    body("name", "La actualizacion de nombre del hotel no puede estar vacia")
      .optional()
      .isLength({ min: 4 }),
    body(
      "country",
      "Al actualizar el pais el espacio no tiene que dejar el espacio vacio",
    )
      .optional()
      .isLength({ min: 3 }),
    body("address", "La direccion puede ser mas especifica")
      .optional()
      .isLength({ min: 10 }),
    body(
      "description",
      "La direccion se necesita que ser mas accesible in entendible para los clientes",
    )
      .optional()
      .isLength({ min: 30 }),
    validateRequestParams,
  ],
  putHotel,
);

router.post(
  "/",
  [
    validateJwt,
    isAdminLogged,
    body(
      "name",
      "El nombre de ser definido, no puede estar vacío, debe tener 4 caracteres minimo",
    ).isLength({ min: 4 }),
    body("country", "El país donde se ubica el hotel es necesario").isLength({
      min: 3,
    }),
    body(
      "address",
      "La dirección se necesitra saber para poder ubicar de mejor manera",
    ).isLength({ min: 10 }),
    body(
      "description",
      "La descripción debe ser clara y entendible para los clientes",
    ).isLength({ min: 30 }),
    validateRequestParams,
  ],
  hotelPost,
);

router.delete(
  "/:id",
  [
    validateJwt,
    isAdminLogged,
    param("id", "No es un id válido").isMongoId(),
    param("id").isMongoId(),
    validateRequestParams,
  ],
  hotelDelete,
);

export default router;
