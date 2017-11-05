import React, { Component } from 'react';
import Answer from './Answer';
import Voting from './Voting';

const TagsContainer = ({tags}) => {
  return (
    <ul className="unstyled in-line tags">
      {tags.map(t => <Tag key={t.id} content={t.name} /> )}
    </ul>
  )
}
const Tag = ({content}) => {
  return <li>{content}</li>
}

class Question extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
    }
    this.onVote = this.onVote.bind(this)
  }
  async componentWillMount() {
    const response = await fetch(`/questions/${this.props.id}`, {
      headers: { Accept: 'application/json' },
    });
    const data = await response.json();
    console.log(data);
    this.setState({
      ...data.question,
      comments: data.comments,
      allTags: data.tags,
      loading: false,
    })
  }
  async onVote(id, type) {
    const response = await fetch(`/vote/question/${id}`, {
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
    if(this.state.loading){
      return(
        <h1>Cargando ...</h1>
      )
    } else{
      return(
        [
        <span>
          <TagsContainer tags={this.state.tags} />
        </span>,
        <h2>{this.state.title}</h2>,
        <div className="row nowrap start">
          <Voting 
            votes={this.state.votes} userId={parseInt(this.props.userId, 10)}
            vote={type => this.onVote(this.props.id, type)}
          />
          <p>{this.state.content}</p>
        </div>,
        <div style={{fontSize: "14px"}}>
          <br />
          By <a href={`/users/${this.state.user.id}`}>{this.state.user.username}</a>
        </div>,
        this.state.comments.map(c => <Answer {...c} userId={parseInt(this.props.userId, 10)}/>)
        ]
      )
    }
  }
}

export default Question