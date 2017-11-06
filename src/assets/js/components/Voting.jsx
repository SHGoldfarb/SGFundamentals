import React, { Component } from 'react';
import _ from 'lodash';

class Voting extends Component{
  constructor(props){
    super(props)
    this.handleVote = this.handleVote.bind(this)
  }
  handleVote(type){
    this.props.vote(type)
  }
  render(){
    const { userId, votes } = this.props;
    const total = _.filter(votes, { type: true }).length - _.filter(votes, { type: false }).length;
    if(userId){
      const myVote = votes.find(v => v.userId === userId)
      return(
        <div class="votes-div">        
          <div
            className={`triangle triangle-up ${myVote && myVote.type ? "selected" : ""}`}
            onClick={() => this.handleVote('1')}
          >
          </div>
          <p class={`votes-count ${total < 0 ? "negative" : ""}`}>
            {total}
          </p>
          <div
            className={`triangle triangle-down ${myVote && !myVote.type ? "selected" : ""}`}
            onClick={() => this.handleVote('0')}
          >
          </div>
        </div>
      )
    } else {
      return(
        <div class="votes-div">        
          <p class={`votes-count ${total < 0 ? "negative" : ""}`}>
            {total}
          </p>
        </div>
      )
    }
  }
}

export default Voting;
