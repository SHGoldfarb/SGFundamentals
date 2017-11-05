import React, { Component } from 'react';
import Voting from './Voting'

class Answer extends Component {
  constructor(props){
    super(props)
    this.state = {
      votes: props.votes,
    }
  }
  async onVote(id, type) {
    const response = await fetch(`/vote/comment/${id}`, {
      method: 'post',
      credentials: "same-origin",
      headers: { Accept: 'application/json' },
      body: JSON.stringify({
        type
      })
    });
    const data = await response.json();
    this.setState({
        votes: data.votes
      }
    )
  }
  render() {
    return(
      <div 
        className={`${this.props.sub ? "sub" : ""}comment-box`}
        style={{marginLeft: this.props.sub ? "50px" : "auto"}}
      >
        <div className="in-line">
          <div className="comment-content" style={{marginRight: "20px"}}>
            <div className="row nowrap">
              <Voting
                votes={this.state.votes}
                userId={parseInt(this.props.userId, 10)}
                vote={type => this.onVote(this.props.id, type)}
              />
              {this.props.content}
            </div>
            <div className="in-line" style={{
              marginTop: "10px",
              fontSize: "14px",
            }}>
              By: &nbsp; <a href={`/users/${this.props.user.id}`}>{this.props.user.username}</a>
              &nbsp; {this.props.createdAt}
            </div>
          </div>
        </div> 
        {this.props.child ? (
          this.props.child.map(comment => <Answer {...comment} sub userId={parseInt(this.props.userId, 10)} />)
        ): (
          undefined
        )}
      </div>
    )
  }
}
export default Answer;
