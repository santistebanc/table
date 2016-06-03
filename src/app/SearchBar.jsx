import React from 'react';

require('./SearchBar.less');

export default class SearchBar extends React.Component {
  constructor(props){
    super(props);
    this.state = {query: ''};
  }
  handleChangeQuery(evt){
    this.props.onChange(evt.target.value);
    this.setState({query: evt.target.value});
  }
  render () {
    //const {current, pagesize, totalsize} = this.props;
    return <div className={'searchbar'} style={this.props.style}>
        <input style={{width:'100%'}} type="text" placeholder="Search.." value={this.state.query} onChange={this.handleChangeQuery.bind(this)}/>
    </div>
  }
}
SearchBar.defaultProps = {
  onChange: ()=>{}
}
