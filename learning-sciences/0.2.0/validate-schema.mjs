// Minimal JSON Schema walker covering the subset this rack's schema uses.
// Used because the repository has no JSON Schema dependency; keeps rack.schema.json enforced rather than decorative.
export function validate(schema, data) {
  const errors = [];
  const defs = schema.$defs ?? {};
  const resolve = (s) => (s.$ref ? resolve(defs[s.$ref.replace("#/$defs/", "")]) : s);

  const walk = (s0, value, path) => {
    const s = resolve(s0);
    if (s.const !== undefined && value !== s.const) return errors.push(`${path}: expected const ${s.const}`);
    if (s.enum && !s.enum.includes(value)) return errors.push(`${path}: ${JSON.stringify(value)} not in enum`);
    if (s.type === "string") {
      if (typeof value !== "string") return errors.push(`${path}: expected string`);
      if (s.minLength && value.length < s.minLength) errors.push(`${path}: shorter than ${s.minLength}`);
      if (s.pattern && !new RegExp(s.pattern).test(value)) errors.push(`${path}: does not match ${s.pattern}`);
      return;
    }
    if (s.type === "integer" || s.type === "number") {
      if (typeof value !== "number") return errors.push(`${path}: expected number`);
      if (s.type === "integer" && !Number.isInteger(value)) errors.push(`${path}: expected integer`);
      if (s.minimum !== undefined && value < s.minimum) errors.push(`${path}: below minimum`);
      if (s.maximum !== undefined && value > s.maximum) errors.push(`${path}: above maximum`);
      return;
    }
    if (s.type === "array") {
      if (!Array.isArray(value)) return errors.push(`${path}: expected array`);
      if (s.minItems && value.length < s.minItems) errors.push(`${path}: fewer than ${s.minItems} items`);
      if (s.items) value.forEach((v, i) => walk(s.items, v, `${path}[${i}]`));
      return;
    }
    if (s.type === "object" || s.properties || s.required) {
      if (typeof value !== "object" || value === null || Array.isArray(value)) return errors.push(`${path}: expected object`);
      for (const key of s.required ?? []) if (!(key in value)) errors.push(`${path}: missing required "${key}"`);
      const props = s.properties ?? {};
      for (const [key, v] of Object.entries(value)) {
        if (props[key]) walk(props[key], v, `${path}.${key}`);
        else if (s.additionalProperties === false) errors.push(`${path}: unexpected property "${key}"`);
        else if (typeof s.additionalProperties === "object") walk(s.additionalProperties, v, `${path}.${key}`);
      }
    }
  };
  walk(schema, data, "$");
  return errors;
}
