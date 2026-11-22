// `Item` is a react-stately *collection* component (identified by a static
// `getCollectionNode`), so it must be re-exported rather than wrapped — a
// function wrapper would break the collection builder that RudiSelect relies on.
/**
 * One entry in a `RudiSelect` or `RudiComboBox` list. Its children are the visible content; set `textValue`
 * when the children are not plain text (used for typeahead and filtering). Give it a `key` (or `id`).
 *
 * @example
 * <RudiOption key="us">United States</RudiOption>
 */
export { Item as RudiOption } from 'react-stately'
/** Props for `RudiOption`: `children`, `textValue`, `aria-label`, and `key`. Re-exported from react-stately. */
export type { ItemProps as RudiOptionProps } from 'react-stately'
