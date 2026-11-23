/**
 * Removes empty event-handler props (`onPress={() => {}}`) from the code shown
 * under an example. Storybook renders action argTypes that way; they still log
 * to the Actions panel, but they're noise in code a reader will copy.
 */
export function stripActionStubs(code: string) {
  return code
    .replace(/^[ \t]*on[A-Z]\w*=\{\(\) => \{\}\}[ \t]*\n/gm, '')
    .replace(/ on[A-Z]\w*=\{\(\) => \{\}\}/g, '')
    // A tag left with no props closes on the next line: `<RudiButton\n>`.
    .replace(/<([\w.]+)\n[ \t]*(\/?>)/g, (_, tag, end) =>
      end === '/>' ? `<${tag} />` : `<${tag}>`,
    )
}
