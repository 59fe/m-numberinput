import React from 'react'
import './keyboard.css'

export default class Keyboard extends React.Component{

  constructor(props) {

    super(props)
    this.defaultState = {
      inputFieldIndex: null,
      show: false,
      skin: null,
      symbol: '.',
      height: '50%',
      onKeyDown: null
    }
    this.timer = null
    this.state = this.defaultState

  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  render() {

    let { inputFieldIndex, show, height, skin, symbol } = this.state

    let keyboardClassName = 'number-input-keyboard ' + skin
    let symbolButtonClassName = symbol ? '' : 'disabled'

    if (show) {
      keyboardClassName = keyboardClassName + ' active'
    }

    return (
      <div data-number-input-index={inputFieldIndex} style={{ height }} className={keyboardClassName}>
        <button data-number-input-index={inputFieldIndex} onClick={::this.handleInput} data-value="1">1</button>
        <button data-number-input-index={inputFieldIndex} onClick={::this.handleInput} data-value="2">2</button>
        <button data-number-input-index={inputFieldIndex} onClick={::this.handleInput} data-value="3">3</button>
        <button data-number-input-index={inputFieldIndex} onClick={::this.handleInput} data-value="4">4</button>
        <button data-number-input-index={inputFieldIndex} onClick={::this.handleInput} data-value="5">5</button>
        <button data-number-input-index={inputFieldIndex} onClick={::this.handleInput} data-value="6">6</button>
        <button data-number-input-index={inputFieldIndex} onClick={::this.handleInput} data-value="7">7</button>
        <button data-number-input-index={inputFieldIndex} onClick={::this.handleInput} data-value="8">8</button>
        <button data-number-input-index={inputFieldIndex} onClick={::this.handleInput} data-value="9">9</button>
        <button
          data-number-input-index={inputFieldIndex}
          onClick={::this.handleInput}
          className={symbolButtonClassName}
          data-value={symbol}
        >{symbol}</button>
        <button data-number-input-index={inputFieldIndex} onClick={::this.handleInput} data-value="0">0</button>
        <button data-number-input-index={inputFieldIndex} onClick={::this.handleInput} data-value="delete"></button>
      </div>
    )

  }

  handleInput(event) {

    let value = event.currentTarget.dataset.value
    this.state.onKeyDown && this.state.onKeyDown(value)

  }

  show(props) {

    clearTimeout(this.timer)
    this.setState({ ...props, show: true })

  }

  hide() {

    this.setState({
      show: false,
      height: this.defaultState.height
    })

    this.timer = setTimeout(() => {
      this.setState(this.defaultState)
    }, 100)

  }

}