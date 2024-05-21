const validateDuration = (value, { req }) => {
  if (!value || typeof value !== "object" || !value.hours || !value.minutes) {
    throw new Error(
      "La duración debe ser un objeto con las propiedades hours y minutes",
    );
  }
  if (typeof value.hours !== "number" || typeof value.minutes !== "number") {
    throw new Error("Las propiedades hours y minutes deben ser números");
  }
  if (value.hours < 0 || value.minutes < 0) {
    throw new Error("Las propiedades hours y minutes no pueden ser negativas");
  }

  if (value.minutes > 59) {
    throw new Error(
      "Los minutos no pueden ser mayores a 59, para definir horas usar la propiedad hours",
    );
  }
  return true;
};

export default validateDuration;
