# Third-party notices

## deepseek-tts-api

`src/deepseek/` vendors the DeepSeek web "read aloud" client from
[Eyeing0721/deepseek-tts-api](https://github.com/Eyeing0721/deepseek-tts-api)
(MIT License, © Eyeing0721), copied into this plugin and re-exported by
`src/deepseek/index.mjs`.

It is kept in-tree (rather than pulled from npm/GitHub at runtime) so that
0KAY DeepSeek TTS is fully self-contained: no external CLI and no third-party
runtime dependency. The protocol implementation is unmodified; only the entry
point re-export is our own. See the upstream project for the protocol notes and
license text.

If you use this, please also star the upstream project.
