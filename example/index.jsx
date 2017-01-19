import React from 'react'
import ReactDOM from 'react-dom'
import NumberInput from '../src'

class Demo extends React.Component {

  render() {

    return (
      <div className="demo">
        <NumberInput 
          skin="numer-field"
          symbol="."
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