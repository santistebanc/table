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
    const {current, pageSize, totalsize, style} = this.props;
    let numbers = [];
    const range = this.props.range>=3?this.props.range:3;
    let num = (inside,i)=><li key={i}><a className={'pagenumber '+(current==i?'active':'')} onClick={this.handleClick.bind(this,i)}>{inside}</a></li>;
    let first = 0;
    if(current >= range-1){
      if(current >= Math.floor(totalsize/pageSize)){
        first = Math.floor((Math.floor(totalsize/pageSize)-2)/(range-2))*(range-2);
      }else{
        first = Math.floor((current-1)/(range-2))*(range-2)
      }
    }

    for(let i=first;i < totalsize/pageSize && i< first+range;i++){
      numbers.push(num(i+1,i));
    }
    const lastnumber = num(Math.floor(totalsize/pageSize)+1,Math.floor(totalsize/pageSize));
    return <div className={'pagination'} style={style}>
      <ul>
        <li><a onClick={this.handleClick.bind(this,(current > 0?current-1:current))}>{'«'}</a></li>
        {first > 0?num(1,0):''}
        {first > 0?<li><span className={'threedots'}>{'...'}</span></li>:''}
        {numbers}
        {(first+range) <= Math.floor(totalsize/pageSize)?<li><span className={'threedots'}>{'...'}</span></li>:''}
        {(first+range) <= Math.floor(totalsize/pageSize)?lastnumber:''}
        <li><a onClick={this.handleClick.bind(this,(current < Math.floor(totalsize/pageSize)?current+1:current))}>{'»'}</a></li>
      </ul>
    </div>
  }
}
PaginationIndex.defaultProps = {
  onChange: ()=>{}
}
