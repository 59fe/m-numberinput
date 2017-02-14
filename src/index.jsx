import React from 'react'
import ReactDOM from 'react-dom'
import Keyboard from './keyboard'
import validateDataType from './data-types'
import './index.css'

export default class NumberInput extends React.Component{

  constructor(props) {

    super(props)
    this.state = {
      value: props.defaultValue ? props.defaultValue.toString() : '',
      focus: false,
      disabled: false,
      matched: false,
      cursorPosition: null
    }

    this.timer = null
    this.inputFieldIndex = 0
    this.keyboard = null
    this.inputFieldId = 0

  }

  componentWillMount() {

    // 支持同一个页面存在多个输入框，使用递增的序号来避免冲突
    if (typeof window.__REACT_NUMBER_INPUT_INDEX__ === 'undefined') {
      window.__REACT_NUMBER_INPUT_INDEX__ = 0
    } else {
      window.__REACT_NUMBER_INPUT_INDEX__ += 1
    }

    this.inputFieldIndex = window.__REACT_NUMBER_INPUT_INDEX__
    this.inputFieldId = this.props.id || ('react-number-input-' + this.inputFieldIndex)

    // 按需往页面中添加键盘组件，多个输入框使用同一个键盘组件
    if (!window.__REACT_NUMBER_KEYBOARD__) {

      let keyboardHolder = document.createElement('div')
      document.body.appendChild(keyboardHolder)
      window.__REACT_NUMBER_KEYBOARD__ = ReactDOM.render(<Keyboard />, keyboardHolder)

    }

    // 得到键盘组件实例对象
    this.keyboard = window.__REACT_NUMBER_KEYBOARD__

  }

  componentDidMount() {

    // 注册事件监听器
    document.body.addEventListener('click', this.handleFocusOrBlur.bind(this), false)

    // autoFocus为true的时候，自动弹出键盘
    this.props.autoFocus && setTimeout(() => {
      this.handleFocus()
    }, 0)

  }

  componentWillUnmount() {

    // 文本框组件卸载之前，调用handleBlur来隐藏键盘组件
    this.handleBlur()

    // 清除定时器
    clearTimeout(this.timer)

    // 移除事件监听器
    document.body.removeEventListener('click', this.handleFocusOrBlur.bind(this), false)

  }

  render() {

    let { skin, placeholder, showCursor } = this.props
    let { value, focus, disabled, matched, cursorPosition } = this.state
    let fieldClassNames = []

    // 是否显示或者隐藏输入框光标
    let cursor = showCursor !== false ? <span className="react-number-input-cursor"></span> : null

    // 指定skin参数，则将其添加到组件样式名
    skin && fieldClassNames.push(skin)

    // 设置不同状态的样式名
    focus && fieldClassNames.push('focus')
    matched && fieldClassNames.push('matched')
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
    let matched = false

    if (newValue !== 'delete') { //非删除操作

      value = this.valueAfterInsert(newValue)
      cursorPosition !== null && (cursorPosition = cursorPosition + 1)

      if (value[0] === '.') {
        value = '0' + value
        cursorPosition !== null && (cursorPosition = cursorPosition + 1)
      }

    } else { // 删除操作

      // 光标位置在最前的时候不执行操作
      if (cursorPosition === -1) {
        return false
      }

      // 获取删除后的数据
      value = this.valueAfterDelete()

      // 如果光标不是在最后，则将光标位置前移
      cursorPosition !== null && (cursorPosition = cursorPosition - 1)

    }

    // 根据输入框类型来验证用户输入行为是否有效
    if (!validateDataType(type, value, decimal)) {
      applyChange = false
      value = this.state.value
      cursorPosition = this.state.cursorPosition
    }

    // 根据指定的数据最大长度来验证用户输入行为是否有效
    if (!isNaN(maxLength) && value.length > maxLength) {
      applyChange = false
      value = this.state.value
    }

    // 根据指定的数据最大值来验证用户输入行为是否有效
    if (!isNaN(max) && value * 1 > max) {
      applyChange = false
      value = this.state.value
    }

    // 如果指定了验证正则表达式
    if (Object.prototype.toString.call(matchReg) === "[object RegExp]") {

      if (matchReg.test(this.state.value)) {

        // 当前数据匹配指定的正则表达式，则执行onMatch回调
        matched = true
        this.props.onMatch && this.props.onMatch(this.state.value)

      } else {

        // 否则执行onNotMatch回调
        matched = false
        this.props.onNotMatch && this.props.onNotMatch(this.state.value)

      }

    }

    // 按需执行用户传入的onChange回调，如果onChange回调返回false，则用户此次的输入行为不生效
    if (typeof this.props.onChange === 'function') {
      applyChange = this.props.onChange(value, newValue)
    }

    // 非删除操作或者输入行为有效，才应用此次输入，同时更改光标位置和正则匹配结果
    (applyChange !== false || newValue === 'delete') && this.setState({ value, cursorPosition, matched })

  }

  handleFocusOrBlur(e) {

    // 由于某些移动端浏览器的缺陷，不能借用原生的表单控件来让本组件支持blur和focus，
    // 所以采用通过事件代理的方式来判断当前元素是否需要获得或者失去焦点，模拟blur和focus

    // 获取当前点击对象的numberInputIndex或者valueIndex
    let numberInputIndex = e.target.dataset['numberInputIndex']
    let valueIndex = e.target.dataset.valueIndex

    if (typeof numberInputIndex !== 'undefined') {
      numberInputIndex = numberInputIndex * 1
    }

    // 当前输入框以及键盘按钮都附加上了numberInputIndex
    // 当这些对象被点击的时候，会让当前输入框保持focus状态
    if (numberInputIndex === this.inputFieldIndex) {

      // 确保focus会在可能的blur之后执行
      setTimeout(() => {
        this.handleFocus()
      }, 0)

      if (valueIndex >= 0) {

        // 点击输入框内部的字符元素，会得到该字符的valueIndex
        // 然后根据valueIndex来更改光标的位置
        this.setState({
          cursorPosition: valueIndex - 1
        })

      } else {

        // 如果没有获取到，则将光标移到最后
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

    // 如果指定type为id(身份证)或者number，则限定symbol为X或者小数点
    if (type === 'id') {
      symbol = 'X'
    } else if (type === 'number') {
      symbol = '.'
    }

    // 滑出键盘组件，传递必要状态
    this.keyboard.show({
      ...keyboard, symbol,
      inputFieldIndex: this.inputFieldIndex,
      onKeyDown: this.handleChange.bind(this)
    })

    this.setState({
      focus: true
    })

    // 按需触发onFocus回调
    this.props.onFocus && this.props.onFocus()

  }

  handleBlur() {

    // 隐藏键盘组件
    this.keyboard.hide()

    this.setState({
      focus: false
    })

    // 按需触发onBlur回调
    this.props.onBlur && this.props.onBlur()

  }

  getValue() {

    // 通过组件实例方法来获取当前的值
    return this.state.value

  }

  setValue(value) {

    // 通过组件实例方法来设置值
    this.handleChange(value)

  }

  clear() {

    // 通过组件实例方法来清空值
    this.setState({ value: '' })
  
  }

  disable() {

    // 通过组件实例方法来禁用组件
    this.setState({ disabled: true })

  }

  enable() {

    // 通过组件实例方法来启用组件
    this.setState({ disabled: false })

  }

  // 计算插入操作之后的值
  valueAfterInsert(newValue) {

    let { value, cursorPosition } = this.state

    // 根据当前光标位置执行插入操作
    if (cursorPosition === null) {
      return value + newValue
    } else {
      return value.slice(0, cursorPosition + 1) + newValue + value.slice(cursorPosition + 1)
    }

  }

  // 计算删除操作之后的值
  valueAfterDelete() {

    let { value, cursorPosition } = this.state
    let valueArray = value.split('')

    // 根据当前光标位置执行删除操作
    if (cursorPosition === null) {
      return value.slice(0, -1)
    } else {
      return valueArray.splice(cursorPosition, 1).join('')
    }

  }

}