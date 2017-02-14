import React from 'react'
import ReactDOM from 'react-dom'
import NumberInput from '../src'

class Demo extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      value: 111
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        value: 333
      })
    }, 3000)
  }

  render() {

    return (
      <div className="demo">
        <NumberInput 
          defaultValue={this.state.value}
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