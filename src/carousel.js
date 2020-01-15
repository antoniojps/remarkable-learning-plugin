/* eslint-disable no-param-reassign */

const TOKENS = {
  CAROUSEL: 'carousel',
  CAROUSEL_OPEN: 'carousel_open',
  CAROUSEL_CLOSE: 'carousel_close',
}

/**
 * Remarkable block parser that recognizes callouts.
 * @todo Add options.
 */
export const parser = (
  state,
  startLine,
  endLine,
  silent
) => {
  // position of line start in src + number of spaces used to indent it
  const lineStart = state.bMarks[startLine] + state.tShift[startLine]
  // position of line end in src
  const lineEnd = state.eMarks[startLine]

  // check if line starts with '<'
  const tagMarker = state.src.charCodeAt(lineStart);

  // Wrong marker
  if (tagMarker !== 60 /* '<' */) return false;

  // check if enough chars for <carousel>
  const tag = '<carousel>'
  const tagNumberOfChars = tag.length
  if (lineStart + tagNumberOfChars > lineEnd) return false;

  const lineText = state.src.slice(lineStart, lineEnd).trim();
  if (lineText !== tag) return false

  if (silent) return true;

  // scan for tag ending
  let nextLine = startLine;
  let hasEnding = false;
  const tagClosed = '</carousel>'

  while (nextLine < endLine) {
    nextLine++;

    if (nextLine >= endLine) break;

    const nextLineStart = state.bMarks[nextLine] + state.tShift[nextLine];
    const nextLineEnd = state.eMarks[nextLine];

    if (state.src.charCodeAt(nextLineStart) !== tagMarker) continue;
    const nextLineText = state.src.slice(nextLineStart, nextLineEnd).trim();
    if (nextLineText === tagClosed) {
      hasEnding = true;
      break;
    }
  }

  // Ensure nested parsing stops at delimiting block
  const oldMax = state.lineMax;
  state.lineMax = nextLine + (hasEnding ? -1 : 0);
  const oldParentType = state.parentType;
  state.parentType = 'carousel';

  let lines = [startLine, 0]

  // Let register token and progress
  state.tokens.push({
    type: TOKENS.CAROUSEL_OPEN,
    level: state.level,
    lines,
  });
  state.parser.tokenize(state, startLine + 1, nextLine);
  state.tokens.push({
    type: TOKENS.CAROUSEL_CLOSE,
    level: state.level
  });

  // Revert
  lines[1] = nextLine;
  state.line = nextLine + (hasEnding ? 1 : 0);
  state.lineMax = oldMax;
  state.parentType = oldParentType;

  return true
};

/**
 * Remarkable admonition renderer.
 */
export function openRenderer(
  admonitionOpts
) {
  return (tokens, idx, options, env) => {
    return `<carousel>`;
  };
}

/**
 * Callout closing tag renderer
 */
export function closeRenderer(
  opts
){
  return (tokens, idx, options, env) => {
    return `</carousel>`;
  };
}

const plugin = (
  md,
  opts
) => {
  md.block.ruler.before('htmlblock', TOKENS.CAROUSEL, parser, opts);
  md.renderer.rules[TOKENS.CAROUSEL_OPEN] = openRenderer(opts);
  md.renderer.rules[TOKENS.CAROUSEL_CLOSE] = closeRenderer(opts);

};

export default plugin
