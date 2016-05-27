import React from 'react';

require('./PaginationIndex.less');

export default class PaginationIndex extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }
  handleClick(page){
    this.props.onChange(page);
  }
  render () {
    const {current, pagesize, totalsize} = this.props;
    let numbers = [];
    const range = this.props.range>=3?this.props.range:3;
    let num = (inside,i)=><li key={i}><a className={'pagenumber '+(current==i?'active':'')} onClick={this.handleClick.bind(this,i)}>{inside}</a></li>;
    let first = 0;
    if(current >= range-1){
      if(current >= Math.floor(totalsize/pagesize)){
        first = Math.floor((Math.floor(totalsize/pagesize)-2)/(range-2))*(range-2);
      }else{
        first = Math.floor((current-1)/(range-2))*(range-2)
      }
    }

    for(let i=first;i < totalsize/pagesize && i< first+range;i++){
      numbers.push(num(i+1,i));
    }
    const lastnumber = num(Math.floor(totalsize/pagesize)+1,Math.floor(totalsize/pagesize));
    return <div className={'pagination'}>
      <ul>
        <li><a onClick={this.handleClick.bind(this,(current > 0?current-1:current))}>{'«'}</a></li>
        {first > 0?num(1,0):''}
        {first > 0?<li><a>{'...'}</a></li>:''}
        {numbers}
        {(first+range) <= Math.floor(totalsize/pagesize)?<li><a>{'...'}</a></li>:''}
        {(first+range) <= Math.floor(totalsize/pagesize)?lastnumber:''}
        <li><a onClick={this.handleClick.bind(this,(current < Math.floor(totalsize/pagesize)?current+1:current))}>{'»'}</a></li>
      </ul>
    </div>
  }
}
PaginationIndex.defaultProps = {
  onChange: ()=>{}
}
