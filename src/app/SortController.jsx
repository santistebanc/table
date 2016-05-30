import React from 'react';

require('./SortController.less');

export default class SortController extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }
  handleClick(){
    this.props.onChange();
  }
  render () {
    const {mode, style} = this.props;
    return <button className={'sortController'} style={style} onClick={this.handleClick.bind(this)}>
    {mode==1?<i className="fa fa-sort-asc"></i>:mode==2?<i className="fa fa-sort-desc"></i>:<i>&nbsp;</i>}
  </button>
  }
}
SortController.SortController = {
  onChange: ()=>{}
}
