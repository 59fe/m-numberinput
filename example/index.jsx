import React from 'react'
import ReactDOM from 'react-dom'
import NumberInput from '../src'

class Demo extends React.Component {

  render() {

    return (
      <div className="demo">
        <NumberInput 
          defaultValue={11123}
          skin="numer-field"
          placeholder="哈哈哈"
          type="id"
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