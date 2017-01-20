export default (type, value, decimalLength = null) => {

  if (type === 'id') { // 身份证类型

    // 第一位不能是0
    if (value.length > 0 && !(value[0] * 1 > 0) && value[0].toLowerCase() !== 'x') {
      return false
    }

    // 最后一位之前必须是整数
    if (value.length < 18 && !Number.isInteger(value.slice(0, -1) * 1)) {
      return false
    }

    // 最后一位必须是X或者数字
    if (value.length === 18 && (value[14].toLowerCase() !== 'x' && isNaN(value[14]))) {
      return false
    }

    // 不能超过18位
    if (value.length > 18) {
      return false
    }

    return true

  } else if (type === 'number') { // 数字类型

    if (decimalLength === 0) { // 小数点后位数是0

      // 必须是整数
      if (!Number.isInteger(value * 1)) {
        return false
      }

      return true

    } else {

      let dotIndex = value.indexOf('.')
      let decimal = dotIndex > 0 ? value.slice(dotIndex + 1) : ''

      // 第一位必须是数字或者小数点
      if (value.length > 0 && isNaN(value[0]) && value[0] !== '.') {
        return false
      }

      // 第一位是0的时候，第二位必须是小数点
      if (value.length >= 2 && value[0] * 1 === 0 && value[1] !== '.') {
        return false
      }

      // 小数点只允许出现一次
      if (dotIndex > 0 && dotIndex !== value.lastIndexOf('.')) {
        return false
      }

      // 小数点后的内容不为空并且不是整数
      if (decimal.length && !Number.isInteger(decimal * 1)) {
        return false
      }

      // 如果指定了限定位数，则小数点后的位数不能大于限定位数
      if (decimalLength > 0 && decimal.length > decimalLength) {
        return false
      }

    }

    return true

  }

  return true

}