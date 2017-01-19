import React from 'react'
import ReactDOM from 'react-dom'
import Keyboard from './keyboard'
import './index.css'

// TODO
// placeholder等

export default class NumberInput extends React.Component{

  constructor(props) {

    super(props)
    this.state = {
      value: props.defaultValue || '',
      focus: false,
      disabled: false
    }

    this.timer = null
    this.inputFieldIndex = 0
    this.keyboard = null
    this.inputFieldId = 0

  }

  componentWillMount() {

    if (typeof window.__REACT_NUMBER_INPUT_INDEX__ === 'undefined') {
      window.__REACT_NUMBER_INPUT_INDEX__ = 0
    } else {
      window.__REACT_NUMBER_INPUT_INDEX__ += 1
    }

    this.inputFieldIndex = window.__REACT_NUMBER_INPUT_INDEX__
    this.inputFieldId = this.props.id || ('react-number-input-' + this.inputFieldIndex)

    if (!window.__REACT_NUMBER_KEYBOARD__) {

      let keyboardHolder = document.createElement('div')
      document.body.appendChild(keyboardHolder)
      window.__REACT_NUMBER_KEYBOARD__ = ReactDOM.render(<Keyboard />, keyboardHolder)

    }

    this.keyboard = window.__REACT_NUMBER_KEYBOARD__

  }

  componentDidMount() {
    document.body.addEventListener('click', this.handleFocusOrBlur.bind(this), false)
  }

  componentWillUnmount() {

    clearTimeout(this.timer)
    document.body.removeEventListener('click', this.handleFocusOrBlur.bind(this), false)

  }

  render() {

    let { skin } = this.props
    let { value, focus, disabled } = this.state
    let fieldClassNames = []

    skin && fieldClassNames.push(skin)
    focus && fieldClassNames.push('focus')
    disabled && fieldClassNames.push('disabled')

    fieldClassNames.push("react-number-input")

    return (
      <div
        id={this.inputFieldId}
        data-number-input-index={this.inputFieldIndex}
        className={fieldClassNames.join(' ')}
      >{this.state.value}</div>
    )

  }

  getValue() {
    return this.state.value
  }

  setValue(value) {
    this.handleChange(value)
  }

  handleChange(newValue) {

    let { value } = this.state
    let { matchReg, maxLength } = this.props
    let validation = true

    if (newValue !== 'delete') {  
      value += newValue
    } else {
      value = value.slice(0, -1)
    }

    if (!isNaN(maxLength) && value.length > maxLength) {
      validation = false
      value = this.state.value
    }

    if (Object.prototype.toString.call(matchReg) === "[object RegExp]" && !matchReg.test(value)) {
      validation = false
      value = this.state.value
    }

    if (typeof this.props.onChange === 'function') {
      validation = this.props.onChange(value, newValue)
    }

    (validation !== false || newValue === 'delete') && this.setState({ value })

  }

  handleFocusOrBlur(e) {

    let numberInputIndex = e.target.dataset['numberInputIndex']

    if (typeof numberInputIndex !== 'undefined') {
      numberInputIndex = numberInputIndex * 1
    }

    if (numberInputIndex === this.inputFieldIndex) {
      setTimeout(() => {
        this.handleFocus()
      }, 0)
    } else {
      this.handleBlur()
    }

  }

  handleFocus() {

    this.keyboard.show({
      ...this.props.keyboard,
      symbol: this.props.symbol,
      inputFieldIndex: this.inputFieldIndex,
      onKeyDown: this.handleChange.bind(this)
    })

    this.setState({
      focus: true
    })

    this.props.onFocus && this.props.onFocus()

  }

  handleBlur() {

    this.keyboard.hide()

    this.setState({
      focus: false
    })

    this.props.onBlur && this.props.onBlur()

  }

}