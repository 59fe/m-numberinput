# React Number Input Mobile
React 移动端数字输入框组件


### 安装
```
npm install react-number-input-mobile --save
```

### 使用
```javascript
import React from 'react'
import ReactDom from 'react-dom'
import NumberInput from 'react-number-input-mobile'

class Demo extends React.Component {

  render() {

    return (
      <div className="demo">
        <NumberInput 
          skin="numer-field"
          placeholder="哈哈哈"
          type="id"
          onMatch={::this.handleMatch}
          keyboard={{
            skin: 'bar',
            height: '40%'
          }}
        />
      </div>
    )

  }

}

ReactDOM.render(<Demo />, document.querySelector('#root'))
```

该示例已经包含在git项目中，要亲自感受，可以clone此项目，然后在项目目录执行以下命令

```
npm i && npm run sample
open http://localhost:5998
```

### 组件属性
| 属性名                | 类型          | 说明    |
| ---------------------- | ------------- | :----- |
| skin | String | 会作为class属性附加到输入框组件的DOM元素上，可用于自定义输入框组件的样式 |
| id | String | 会作为id属性附加到输入框组件的DOM元素上，如果页面需要多处使用此组件，请勿传相同的值 |
| placeholder| String | 输入框为空时的占位文字 |
| showCursor| Boolean | 是否显示光标，默认true |
| type| String | 输入框类型，目前支持传入'id'(身份证号码)和'number'(普通数字) |
| symbol| String | 指定键盘组件左下角按钮对应的输入字符，当指定type属性为'id'或者'number'时，symbol强制为'X'或者'.' |
| decimal| Integer | 小数点后的位数限制 |
| maxLength| Integer | 输入的最大位数限制 |
| max| Number | 输入的最大数值限制 |
| matchReg| RegExp | 传入一个正则表达式 |
| onChange| function | 当用户输入有效值时候的回调方法，在该回调中return false可以阻止用户输入|
| onMatch| function | 当输入框的值与matchReg匹配时调用|
| onNotMatch| function | 当输入框的值与matchReg不匹配时调用|
| keyboard| Object | 可以简单自定义该输入框组件对应的键盘组件|
| keyboard.skin| String| 会作为class属性附加到键盘组件的DOM元素上，可用于自定义键盘组件的样式 |
| keyboard.height | String | 传入一个有效的CSS高度以指定键盘组件的高度|