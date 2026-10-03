import * as XLSX from 'xlsx'

self.onmessage = ({ data }: MessageEvent<Uint8Array>) => {
  try {
    if (data.byteLength > 16 * 1024 * 1024) throw new Error('Spreadsheet exceeds 16 MiB preview limit')
    const book = XLSX.read(data, { type: 'array', cellDates: true, sheetRows: 1000 })
    const names = book.SheetNames.slice(0, 20)
    const sheets = names.map(name => {
      const sheet = book.Sheets[name]
      if (sheet['!ref']) {
        const range = XLSX.utils.decode_range(sheet['!ref'])
        range.e.r = Math.min(range.e.r, range.s.r + 999)
        range.e.c = Math.min(range.e.c, range.s.c + 99)
        sheet['!ref'] = XLSX.utils.encode_range(range)
      }
      return XLSX.utils.sheet_to_html(sheet, { editable: false, header: '', footer: '' })
    })
    self.postMessage({ names, sheets })
  } catch (error) {
    self.postMessage({ error: error instanceof Error ? error.message : 'Spreadsheet parsing failed' })
  }
}
