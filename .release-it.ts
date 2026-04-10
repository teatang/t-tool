/* eslint-disable no-template-curly-in-string */
import type { Config } from 'release-it'

export default {
  git: {
    commitMessage: 'chore(release): release v${version}',
    tagName: 'v${version}',
  },
  npm: {
    publish: false,
  },
} satisfies Config
