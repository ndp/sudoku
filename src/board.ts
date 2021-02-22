type TIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type TCellCoord = [TIndex, TIndex]
type TValue = null | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type TCell = [TCellCoord, TValue]
export type TRange = TCellCoord[];
type TRowOfBoard = [TValue, TValue, TValue, TValue, TValue, TValue, TValue, TValue, TValue];
type TBoard = [
  TRowOfBoard,
  TRowOfBoard,
  TRowOfBoard,
  TRowOfBoard,
  TRowOfBoard,
  TRowOfBoard,
  TRowOfBoard,
  TRowOfBoard,
  TRowOfBoard
]

type TFormat = 'raw' | 'formatted'


function EmptyRow (): TRowOfBoard {
  return Array.from(Array(9)).map(_ => null) as TRowOfBoard
}

function assertsRowString (s: string): asserts s {
  if (s.length !== 9) throw 'string must be 9 digits'
}


function Row (s: string): TRowOfBoard {
  const VALID_VALUES = '123456789'

  assertsRowString(s)

  return s.split('')
          .map(x => (VALID_VALUES.includes(x) ? x : null)) as unknown as TRowOfBoard
}

function EmptyBoard (): TBoard {
  return [...Array(9)].map(_ => EmptyRow()) as TBoard
}

export function setBoardValue (b: TBoard, coord: TCellCoord, v: TValue): TBoard {
  const newBoard = [...b] as TBoard
  const [r, c] = [coord[0], coord[1]]
  let oldRow = b[r]
  newBoard[r] = setRowValue(oldRow, c, v)
  return newBoard
}

function setRowValue (r: TRowOfBoard, i: TIndex, v: TValue): TRowOfBoard {
  const newRow = [...r] as TRowOfBoard
  newRow[i] = v
  return newRow
}

function* asColumnStrings (r: TRowOfBoard, format: TFormat): Generator<string> {
  for (let i = 0; i < r.length; i++) {
    if (i && format != 'raw') yield (i % 3 === 0) ? ' | ' : '  '
    yield `${r[i] || '·'}`
  }
}

function* asGridRowStrings (b: TBoard, format: TFormat): Generator<string> {
  for (let i = 0; i < b.length; i++) {
    if (format != 'raw' && i && i % 3 === 0) yield '--------+---------+---------'
    yield [...asColumnStrings(b[i], format)].join('')
  }
}

export function asGrid (b: TBoard, format: TFormat = 'formatted'): string {
  return [...asGridRowStrings(b, format)].join("\n")
}


export function Board (sdm?: string): TBoard {
  const board = EmptyBoard()
  if (!sdm) return board

  return [...Array(9)].map((r, i) => {
    const offset = i * 9
    const rowStr = sdm.slice(0 + offset, 9 + offset)
    return Row(rowStr)
  }) as TBoard
}
