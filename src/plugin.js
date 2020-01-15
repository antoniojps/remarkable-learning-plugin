const TOKENS = {
  CAROUSEL: 'carousel',
  CAROUSEL_OPEN: 'carousel_open',
}

/**
 * Remarkable block parser that recognizes callouts.
 * @todo Add options.
 */
export const parser = (
  state,
  startLine,
  endLine,
  checkMode = true
) => {
  console.log({state, startLine, endLine, checkMode})
};

/**
 * Remarkable carousel renderer.
 */
export function openRenderer(
  opts
) {
  return (tokens, idx, options, env) => {
    const token = tokens[idx];
    const { pictures } = token
    const picturesElement = pictures.map(attributes => {
      const attributesStringArray = attributes.reduce((acc, current) => {
        const currentAttributeString = `${current.key}=${current.value}`
        acc.push(currentAttributeString)
        return acc
      }, [])
      const attributesString = attributesStringArray.join(' ')
      return `<picture ${attributesString} />`
    })
    return `
  <carousel>
    ${picturesElement}
  </carousel>
    `;
  };
}

const plugin = (
  md,
  opts
) => {
    md.block.ruler.before('htmlblock', TOKENS.CAROUSEL, parser, opts);
    md.renderer.rules[TOKENS.CAROUSEL_OPEN] = openRenderer(opts);
  };

  export default plugin