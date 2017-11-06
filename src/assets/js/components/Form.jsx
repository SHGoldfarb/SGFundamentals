import React, { Component } from 'react';

class Form extends Component{
  constructor(props){
    super(props);
    this.state = {
      text: "",
    }
    this.handleWrite = this.handleWrite.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleWrite(e) {
    this.setState({
      text: e.target.value,
    })
  }
  async handleSubmit() {
    const { url, ...props } = this.props;
    if(this.state.text.trim() != '') {
      const response = await fetch(url, {
        method: 'post',
        headers: { Accept: 'application/json'},
        credentials: 'same-origin',
        body: JSON.stringify({
          ...props,
          content: this.state.text,
        })
      })
      const data = await response.json();
      this.props.reloadData();
      this.setState({
        text: "",
      })
    } else {
      alert("No puedes enviar una respuesta vacia")
    }
  }
  render(){
    return(
      <div style={{marginLeft: "15px"}}>
        <label for="text">Tu Respuesta</label>
        <textarea
          id="text"
          value={this.state.text}
          onChange={this.handleWrite}
        />
        <button
          onClick={this.handleSubmit}
        >
          Enviar
        </button>
    </div>
    )
  }
}

export default Form;