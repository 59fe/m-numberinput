import React from 'react'
import ReactDOM from 'react-dom'
import Keyboard from './keyboard'
import validateDataType from './data-types'
import './index.css'

export default class NumberInput extends React.Component{

  constructor(props) {

    super(props)
    this.state = {
      value: props.defaultValue || '',
      focus: false,
      disabled: false,
      cursorPosition: null
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

    this.props.autoFocus && setTimeout(() => {
      this.handleFocus()
    }, 0)

  }

  componentWillUnmount() {

    this.handleBlur()
    clearTimeout(this.timer)
    document.body.removeEventListener('click', this.handleFocusOrBlur.bind(this), false)

  }

  render() {

    let { skin, placeholder, showCursor } = this.props
    let { value, focus, disabled, cursorPosition } = this.state
    let fieldClassNames = []

    let cursor = showCursor !== false ? <span className="react-number-input-cursor"></span> : null

    skin && fieldClassNames.push(skin)
    focus && fieldClassNames.push('focus')
    disabled && fieldClassNames.push('disabled')

    fieldClassNames.push("react-number-input")

    return (
      <div
        id={this.inputFieldId}
        data-number-input-index={this.inputFieldIndex}
        className={fieldClassNames.join(' ')}
      >
        {cursorPosition === -1 && cursor}
        {
          value.length ?
            value.split('').map((v, index) => {
              let item = [<span data-value-index={index} data-number-input-index={this.inputFieldIndex} key={index} className="react-number-input-value-item">{v}</span>]
              if (cursorPosition === index) {
                item.push(cursor)
              }
              return item
            }) :
              <span className="react-number-input-placeholder">{placeholder}</span>
        }
        {cursorPosition === null && cursor}
      </div>
    )

  }

  handleChange(newValue) {

    let { value, cursorPosition } = this.state
    let { type, matchReg, maxLength, max, decimal } = this.props
    let applyChange = true

    if (newValue !== 'delete') {

      value = this.valueAfterInsert(newValue)
      cursorPosition !== null && (cursorPosition = cursorPosition + 1)

      if (value[0] === '.') {
        value = '0' + value
        cursorPosition !== null && (cursorPosition = cursorPosition + 1)
      }

    } else {

      if (cursorPosition === -1) {
        return false
      }

      value = this.valueAfterDelete()
      cursorPosition !== null && (cursorPosition = cursorPosition - 1)

    }

    if (!validateDataType(type, value, decimal)) {
      applyChange = false
      value = this.state.value
      cursorPosition = this.state.cursorPosition
    }

    if (!isNaN(maxLength) && value.length > maxLength) {
      applyChange = false
      value = this.state.value
    }

    if (!isNaN(max) && value * 1 > max) {
      applyChange = false
      value = this.state.value
    }

    if (Object.prototype.toString.call(matchReg) === "[object RegExp]" && matchReg.test(this.state.value)) {
      applyChange = false
    }

    if (typeof this.props.onChange === 'function') {
      applyChange = this.props.onChange(value, newValue)
    }

    (applyChange !== false || newValue === 'delete') && this.setState({ value, cursorPosition })

  }

  handleFocusOrBlur(e) {

    let numberInputIndex = e.target.dataset['numberInputIndex']
    let valueIndex = e.target.dataset.valueIndex

    if (typeof numberInputIndex !== 'undefined') {
      numberInputIndex = numberInputIndex * 1
    }

    if (numberInputIndex === this.inputFieldIndex) {

      setTimeout(() => {
        this.handleFocus()
      }, 0)

      if (valueIndex >= 0) {

        this.setState({
          cursorPosition: valueIndex - 1
        })

      } else {

        this.setState({
          cursorPosition: null
        })

      }

    } else {
      this.handleBlur()
    }

  }

  handleFocus() {

    let { symbol, keyboard, type } = this.props

    if (type === 'id') {
      symbol = 'X'
    } else if (type === 'number') {
      symbol = '.'
    }

    this.keyboard.show({
      ...keyboard, symbol,
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

  getValue() {
    return this.state.value
  }

  setValue(value) {
    this.handleChange(value)
  }

  clear() {
    this.setState({ value: '' })
  }

  disable() {
    this.setState({ disabled: true })
  }

  enable() {
    this.setState({ disabled: false })
  }

  valueAfterInsert(newValue) {

    let { value, cursorPosition } = this.state

    if (cursorPosition === null) {
      return value + newValue
    } else {
      return value.slice(0, cursorPosition + 1) + newValue + value.slice(cursorPosition + 1)
    }

  }

  valueAfterDelete() {

    let { value, cursorPosition } = this.state
    let valueArray = value.split('')

    if (cursorPosition === null) {
      return value.slice(0, -1)
    } else {

      valueArray.splice(cursorPosition, 1)
      return valueArray.join('')

    }

  }

}