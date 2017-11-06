import React, { Component } from 'react';

class Report extends Component{
  constructor(props){
    super(props)
    this.state = {
      loading: false,
    }
    this.handleClick = this.handleClick.bind(this)
  }
  async handleClick() {
    const { resource, resourceId } = this.props;
    await fetch('/reports',{
      method: 'post',
      headers: { Accept: 'application/json' },
      credentials: "same-origin",
      body: JSON.stringify({
        resource,
        resourceId,
      })
    }).then(
      response => response.json()
    ).then(
      json => {
        alert('Reportado con exito')
      }
    )
  }
  render() {
    return(
      <button
        disabled={this.state.loading}
        className="delete-button"
        onClick={this.handleClick}
      >
        Reportar
      </button>
    )
  }
}

export default Report;
