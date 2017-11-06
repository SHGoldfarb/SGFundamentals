import React, { Component } from 'react';
import Voting from './Voting';
import Report from './Report';
import Form from './Form';

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
              <div>
                {this.props.content}
              </div>
              {this.props.sub || !this.props.userId ? (
                undefined
              ) : (
              <Form
                url="/comments"
                userId={this.props.userId}
                commentId={this.props.id}
                reloadData={this.props.reloadData}
              />
              )}
            </div>
            <div className="in-line" style={{
              marginTop: "10px",
              fontSize: "14px",
            }}>
              By: &nbsp; <a href={`/users/${this.props.user.id}`}>{this.props.user.username}</a>
              &nbsp; {this.props.createdAt}
              {parseInt(this.props.userId, 10) > 0 ? (
                <Report resource="comment" resourceId={this.props.id} />
              ) : (
                undefined
              )}
              {
                parseInt(this.props.userId, 10) === parseInt(this.props.user.id, 10) ||
                parseInt(this.props.isAdmin, 10) ? (
                  <a href={`/comments/${this.props.id}/edit`}>Editar</a>
                ) : (
                  undefined
                )
              }
            </div>
          </div>
        </div> 
        {this.props.child ? (
          this.props.child.map(comment => 
            <Answer
              {...comment}
              sub
              userId={parseInt(this.props.userId, 10)}
              reloadData={this.props.reloadData}
            />)
        ): (
          undefined
        )}
      </div>
    )
  }
}
export default Answer;
