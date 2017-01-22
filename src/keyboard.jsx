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

    this.deleteTimer = null
    this.deleteDelayTimer = null
    this.stateUpdateTimer = null
    this.state = this.defaultState

  }

  componentDidMount() {

    // 阻止页面滚动
    this.refs.keyboard.addEventListener('touchstart', this.disableKeyboardTouch.bind(this), false)
  }

  componentWillUnmount() {

    clearTimeout(this.deleteTimer)
    clearTimeout(this.deleteDelayTimer)
    clearTimeout(this.stateUpdateTimer)
    this.refs.keyboard.removeEventListener('touchstart', this.disableKeyboardTouch.bind(this), false)

  }

  render() {

    let { inputFieldIndex, show, height, skin, symbol } = this.state

    let keyboardClassName = 'number-input-keyboard ' + skin
    let symbolButtonClassName = symbol ? '' : 'disabled'

    if (show) {
      keyboardClassName = keyboardClassName + ' active'
    }

    return (
      <div ref="keyboard" data-number-input-index={inputFieldIndex} style={{ height }} className={keyboardClassName}>
        <button data-number-input-index={inputFieldIndex} onTouchStart={::this.handleInput} data-value="1">1</button>
        <button data-number-input-index={inputFieldIndex} onTouchStart={::this.handleInput} data-value="2">2</button>
        <button data-number-input-index={inputFieldIndex} onTouchStart={::this.handleInput} data-value="3">3</button>
        <button data-number-input-index={inputFieldIndex} onTouchStart={::this.handleInput} data-value="4">4</button>
        <button data-number-input-index={inputFieldIndex} onTouchStart={::this.handleInput} data-value="5">5</button>
        <button data-number-input-index={inputFieldIndex} onTouchStart={::this.handleInput} data-value="6">6</button>
        <button data-number-input-index={inputFieldIndex} onTouchStart={::this.handleInput} data-value="7">7</button>
        <button data-number-input-index={inputFieldIndex} onTouchStart={::this.handleInput} data-value="8">8</button>
        <button data-number-input-index={inputFieldIndex} onTouchStart={::this.handleInput} data-value="9">9</button>
        <button data-number-input-index={inputFieldIndex} onTouchStart={::this.handleInput} className={symbolButtonClassName} data-value={symbol}>{symbol}</button>
        <button data-number-input-index={inputFieldIndex} onTouchStart={::this.handleInput} data-value="0">0</button>
        <button data-number-input-index={inputFieldIndex} onTouchStart={::this.handleDeleteStart} onTouchEnd={::this.handleDeleteEnd} data-value="delete"></button>
      </div>
    )

  }

  show(props) {

    clearTimeout(this.deleteTimer)
    clearTimeout(this.deleteDelayTimer)
    clearTimeout(this.stateUpdateTimer)
    this.setState({ ...props, show: true })

  }

  hide() {

    this.setState({
      show: false,
      height: this.defaultState.height
    })

    this.stateUpdateTimer = setTimeout(() => {
      this.setState(this.defaultState)
    }, 100)

  }

  handleInput(event) {

    let value = event.target.dataset.value
    this.state.onKeyDown && this.state.onKeyDown(value)

  }

  handleDeleteStart(event) {

    this.state.onKeyDown && this.state.onKeyDown('delete')

    this.deleteDelayTimer = setTimeout(() => {
      this.deleteTimer = setInterval(() => {
        this.state.onKeyDown && this.state.onKeyDown('delete')
      }, 100)
    }, 800)

  }

  handleDeleteEnd() {
    clearTimeout(this.deleteTimer)
    clearTimeout(this.deleteDelayTimer)
  }

  disableKeyboardTouch(e) {
    e.preventDefault()
  }

}