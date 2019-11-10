import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] }
    } else if (!squares.includes(null)) {
      return { winner: true, line: null }
    }
  }
  return { winner: null, line: null };
}

function Square ({ value, highlight, onClick }) {
  return (
    <button
      className={ highlight ? "square highlight" : "square" }
      onClick={ onClick }
    >
      { value }
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={ i }
        value={ this.props.squares[i] }
        highlight={ this.props.won ? this.props.won.includes(i) : null }
        onClick={ () => this.props.onClick(i) }
      />
    )
  }

  renderBoard(i) {
    let board = []
    // Outer loop
    for (let x = 0; x < i; x++) {
      let square = []
      // Inner loop
      for (let y = 0; y < i; y++) {
        square.push(this.renderSquare((x * i) + y))
      }
      board.push(<div className="board-row" key={ x }>{ square }</div>)
    }

    return board
  }

  render() {
    return (
      <div>{ this.renderBoard(3) }</div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        pos: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      reversed: false,
    }

    this.handleCheckbox = this.handleCheckbox.bind(this)
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = [...current.squares]
    const pos = { col: (i % 3) + 1, row: Math.floor(i / 3) % 3 + 1 }
    if (calculateWinner(squares).winner || squares[i]) return

    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([{
        squares: squares,
        pos: pos,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }

  handleCheckbox(event) {
    this.setState({ reversed: event.target.checked })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const gameState = calculateWinner(current.squares)
    const reverseMoves = this.state.reversed

    const moves = history.map((step, move) => {
      const desc = move
        ? `Go to move #${ move }: (${step.pos.col}, ${step.pos.row})`
        : 'Go to game start'
      return (
        <li key={ move }>
          <button onClick={ () => this.jumpTo(move) }>
            { move === history.length - 1
                ? <strong>{ desc }</strong>
                : desc
            }
          </button>
        </li>
      )
    })
    const reversedMoves = [...moves].reverse()

    let status
    if (gameState.winner && gameState.line) {
      status = `Winner: ${gameState.winner}`
    } else if (gameState.winner && !gameState.line) {
      status = "No winner, game is a draw"
    } else {
      status = `Next player: ${ this.state.xIsNext ? 'X' : 'O' }`
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            won={ gameState.line }
            squares={ current.squares }
            onClick={ i => this.handleClick(i) }
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <label>
            <input
              type="checkbox"
              checked={ this.state.reversed }
              onChange={ this.handleCheckbox }
            />
            Reverse moves
          </label>
          <ol>
            { reverseMoves
                ? reversedMoves
                : moves
            }
          </ol>
        </div>
      </div>
    )
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
)
