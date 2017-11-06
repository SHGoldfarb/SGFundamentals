import React, { Component } from 'react';
import Answer from './Answer';
import Voting from './Voting';
import Report from './Report';
import Form from './Form';

const TagsContainer = ({ tags, isAdmin, removeTag, allTags }) => {
  return (
    <ul className="unstyled in-line tags">
      {tags.map(t => 
        <Tag
          key={t.id}
          content={t.name}
          id={t.id}
          isAdmin={isAdmin}
          removeTag={removeTag}
          allTags={allTags}
        />)}
    </ul>
  )
}
const Tag = ({ content, id, isAdmin, removeTag }) => {
  return (
    <li>
      {content}
      { parseInt(isAdmin, 10) ? (
      <button class="close-icon" onClick={() => removeTag(id)}>X</button>
      ) : (
        undefined
      )}
    </li>
  )
}

class Question extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      newTagName: "",
    }
    this.loadData = this.loadData.bind(this);
    this.onVote = this.onVote.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.handleAddTag = this.handleAddTag.bind(this);
    this.handleWriteTag = this.handleWriteTag.bind(this);
  }
  async loadData() {
    const response = await fetch(`/questions/${this.props.id}`, {
      headers: { Accept: 'application/json' },
    });
    const data = await response.json();
    this.setState({
      ...data.question,
      comments: data.comments,
      allTags: data.tags,
      loading: false,
    })
  }
  async componentWillMount() {
    await this.loadData();
    
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
  async addTag() {
    const { newTagName } = this.state;
    const response = await fetch(`/tags`,{
      method: 'post',
      headers: { Accept: 'application/json'},
      credentials: 'same-origin',
      body: JSON.stringify({
        questionId: this.state.id,
        name: newTagName,
      })
    })
    const data = response.json()
    this.setState({
      tags: [
        ...this.state.tags,
        {
          id: this.state.tags[this.state.tags.length - 1].id +1,
          name: newTagName,
        }
      ],
      newTagName: ""
    })
  }
  handleAddTag(e) {
    e.preventDefault();
    this.addTag();
  }
  handleWriteTag(e) {
    e.preventDefault();
    this.setState({
      newTagName: e.target.value
    })
  }
  async removeTag(id) {
    const index = this.state.tags.findIndex(e => e.id === id)
    const response = await fetch(`/tags/unset/${id}`,{
      method: 'PATCH',
      headers: { Accept: 'application/json'},
      credentials: 'same-origin',
      body: JSON.stringify({
        questionId: this.state.id,
      })
    })
    const data = response.json()
    this.setState({
      tags: [
        ...this.state.tags.slice(0, index),
        ...this.state.tags.slice(index + 1),
      ]
    })
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
          <TagsContainer
            tags={this.state.tags}
            isAdmin={this.props.isAdmin} 
            removeTag={this.removeTag}
          />
          {parseInt(this.props.isAdmin, 10) ? (
            <form onSubmit={this.handleAddTag}>
              <input 
                list="tags"
                type="text"
                value={this.state.newTagName}
                onChange={this.handleWriteTag}
                placeholder="Agregar etiqueta"
              />
              <datalist id="tags">
                {this.state.allTags.map(t => <option key={t.id} value={t.name} />)}
              </datalist>
            </form>
          ) : (
            undefined
          )}
        </span>,
        <h2>{this.state.title}</h2>,
        <div className="row nowrap start">
          <Voting 
            votes={this.state.votes}
            userId={parseInt(this.props.userId, 10)}
            vote={type => this.onVote(this.props.id, type)}
          />
          <p>{this.state.content}</p>
        </div>,
        <div style={{fontSize: "14px"}}>
          <br />
          By <a href={`/users/${this.state.user.id}`}>{this.state.user.username}</a>
          {parseInt(this.props.userId, 10) ? (
            <Report resource="question" resourceId={this.state.id} />
          ) : (
            undefined
          )}
          {
            parseInt(this.props.userId, 10) === parseInt(this.state.user.id, 10) ||
            parseInt(this.props.isAdmin, 10) ? (
              <a href={`/questions/${this.state.id}/edit`}>Editar</a>
            ) : (
              undefined
            )
          }
        </div>,
        parseInt(this.props.userId, 10) ? (
        <Form
          url="/comments/"
          userId={this.props.userId}
          questionId={this.state.id}
          reloadData={this.loadData}
        /> ) : (
          undefined
        ),
        this.state.comments.map(c => 
          <Answer
            {...c}
            reloadData={this.loadData}
            userId={parseInt(this.props.userId, 10)}
          />
        )
        ]
      )
    }
  }
}

export default Question