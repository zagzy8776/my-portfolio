/**
 * A very small, dependency-free syntax highlighter.
 *
 * It is deliberately limited: it tokenises strings, comments, numbers,
 * keywords and punctuation, then maps each token onto a CSS custom property so
 * code blocks inherit the site's dark/light theme instead of hard-coding
 * colours. Good enough for editorial code samples, and it adds zero kilobytes
 * of vendor JavaScript to the bundle.
 */

export type TokenType =
  | 'plain'
  | 'comment'
  | 'string'
  | 'number'
  | 'keyword'
  | 'function'
  | 'property'

export interface Token {
  type: TokenType
  value: string
}

const KEYWORDS: Record<string, string[]> = {
  css: [],
  scss: [],
  js: [
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
    'import', 'from', 'export', 'default', 'class', 'extends', 'new', 'await',
    'async', 'try', 'catch', 'throw', 'typeof', 'instanceof', 'null',
    'undefined', 'true', 'false', 'this', 'of', 'in', 'delete', 'void',
  ],
  ts: [
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
    'import', 'from', 'export', 'default', 'class', 'extends', 'implements',
    'interface', 'type', 'enum', 'namespace', 'new', 'await', 'async', 'try',
    'catch', 'throw', 'typeof', 'instanceof', 'null', 'undefined', 'true',
    'false', 'this', 'as', 'of', 'in', 'readonly', 'public', 'private',
    'protected', 'delete', 'void', 'satisfies',
  ],
  json: ['true', 'false', 'null'],
  bash: [
    'cd', 'ls', 'npm', 'npx', 'pnpm', 'yarn', 'git', 'node', 'echo', 'export',
    'sudo', 'curl', 'mkdir', 'rm', 'cp', 'mv',
  ],
  html: [],
  text: [],
}

const LINE_COMMENT: Record<string, string> = {
  js: '//',
  ts: '//',
  json: '//',
  css: '/*',
  scss: '//',
  bash: '#',
}

/** Maps a token type onto the theme-aware class list used by `CodeBlock`. */
export const TOKEN_CLASS: Record<TokenType, string> = {
  plain: 'text-text-primary',
  comment: 'text-muted/70 italic',
  string: 'text-[hsl(var(--token-string))]',
  number: 'text-[hsl(var(--token-number))]',
  keyword: 'text-[hsl(var(--token-keyword))]',
  function: 'text-[hsl(var(--token-function))]',
  property: 'text-[hsl(var(--token-property))]',
}

function keywordsFor(language: string): Set<string> {
  return new Set(KEYWORDS[language.toLowerCase()] ?? KEYWORDS.text)
}

/**
 * Tokenises a whole snippet. Newlines are preserved inside `plain` tokens so
 * the renderer can keep the original layout without extra bookkeeping.
 */
export function tokenize(code: string, language = 'text'): Token[] {
  const lang = language.toLowerCase()
  const keywords = keywordsFor(lang)
  const lineComment = LINE_COMMENT[lang]
  const tokens: Token[] = []

  const push = (type: TokenType, value: string) => {
    if (value) tokens.push({ type, value })
  }

  let i = 0
  let plain = ''

  while (i < code.length) {
    const char = code[i]
    const rest = code.slice(i)

    // Line comments (// in JS/TS, # in shell).
    if (lineComment && lineComment !== '/*' && rest.startsWith(lineComment)) {
      push('plain', plain)
      plain = ''
      const end = code.indexOf('\n', i)
      const value = end === -1 ? rest : code.slice(i, end)
      push('comment', value)
      i += value.length
      continue
    }

    // Block comments (CSS / SCSS).
    if (rest.startsWith('/*')) {
      push('plain', plain)
      plain = ''
      const end = code.indexOf('*/', i + 2)
      const value = end === -1 ? rest : code.slice(i, end + 2)
      push('comment', value)
      i += value.length
      continue
    }

    // Strings, including template literals.
    if (char === '"' || char === "'" || char === '`') {
      push('plain', plain)
      plain = ''
      let j = i + 1
      while (j < code.length && code[j] !== char) {
        if (code[j] === '\\') j += 1
        j += 1
      }
      const value = code.slice(i, Math.min(j + 1, code.length))
      push('string', value)
      i += value.length
      continue
    }

    // Numbers, but not the digits inside an identifier like `h1`.
    if (/[0-9]/.test(char) && !/[\w$-]/.test(code[i - 1] ?? '')) {
      push('plain', plain)
      plain = ''
      const match = rest.match(/^[0-9][0-9a-fA-FxX._%]*/)
      const value = match ? match[0] : char
      push('number', value)
      i += value.length
      continue
    }

    // Identifiers, keywords, custom properties and function calls.
    if (/[A-Za-z_$-]/.test(char)) {
      const match = rest.match(/^[A-Za-z0-9_$-]+/)
      const word = match ? match[0] : char
      const after = code[i + word.length]
      const isCss = lang === 'css' || lang === 'scss'

      const flush = () => {
        push('plain', plain)
        plain = ''
      }

      if (isCss && (word.startsWith('--') || (after === ':' && code[i + word.length + 1] !== ':'))) {
        flush()
        push('property', word)
        i += word.length
        continue
      }

      if (after === '(') {
        flush()
        push('function', word)
        i += word.length
        continue
      }

      if (!isCss && keywords.has(word)) {
        flush()
        push('keyword', word)
        i += word.length
        continue
      }

      plain += word
      i += word.length
      continue
    }

    // Everything else stays as plain text so the snippet reads naturally.
    plain += char
    i += 1
  }

  push('plain', plain)
  return tokens
}

