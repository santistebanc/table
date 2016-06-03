import React from 'react';

require('./SortController.less');

export default class SortController extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }
  handleClick(e){
    this.props.onChange();
  }
  handleDoubleClick(e){
    e.stopPropagation();
  }
  render () {
    const {direction, style} = this.props;
    return <div className={'sortController'} style={style} onClick={this.handleClick.bind(this)} onDoubleClick={this.handleDoubleClick.bind(this)}>
    {direction==1?<i className="fa fa-sort-asc"/>:direction==-1?<i className="fa fa-sort-desc"/>:<i className="fa fa-sort nosort"/>}
  </div>
  }
}
SortController.SortController = {
  onChange: ()=>{}
}
