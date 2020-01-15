/* eslint-disable no-param-reassign */

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
) => {
  state.tokens.forEach((token, index) => {
    if (token.type !== 'inline') return false
    const DOM = new DOMParser()
    const generatedDocument = DOM.parseFromString(token.content, 'text/html')
    const carouselElements = generatedDocument.getElementsByTagName('carousel')
    const carousel = carouselElements.length === 1 ? carouselElements[0] : null
    if (!carousel) return false
    const pictureElements = generatedDocument.getElementsByTagName('picture')
    const picturesArr = Array.from(pictureElements)
    const pictures = picturesArr.map(picture => {
      const attributes = Array.from(picture.attributes)
      return attributes.map(attribute => ({ key: attribute.name, value: attribute.value }))
    })

    if (pictures.length === 0) return false

    // Register token
    state.tokens[index] = {
      type: TOKENS.CAROUSEL_OPEN,
      level: state.level,
      lines: token.lines,
      pictures,
      block: true
    }

    const prevTokenIndex = index - 1
    const nextTokenIndex = index + 1

    const prevToken = state.tokens[prevTokenIndex]
    const nextToken = state.tokens[nextTokenIndex]

    if (prevToken.type === 'paragraph_open') state.tokens.splice(prevTokenIndex, 1)
    if (nextToken.type === 'paragraph_close') state.tokens.splice(nextTokenIndex, 1)

    state.line = token.lines[1] + 1
    return true
  })
  console.log(state)
};

/**
 * Remarkable carousel renderer.
 */
export function openRenderer() {
  return (tokens, idx) => {
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
