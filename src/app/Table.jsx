import React from 'react';

require('./Table.less');

const defaultwidth = 200;

export default class Table extends React.Component {
  constructor(props){
    super(props);
    this.state = {scroll: 0};
    this.lastScrollLeft = 0;
    this.lastScrollTop = 0;
  }
  handleTableSideScroll(evt){
    if(evt.target.scrollTop == 0 && evt.target.scrollLeft !== this.lastScrollLeft){
      this.setState({rowswidth: (evt.target.scrollLeft+this.refs.table.offsetWidth), scroll: evt.target.scrollLeft})
    }
    this.lastScrollLeft = evt.target.scrollLeft;
    this.lastScrollTop = evt.target.scrollTop;
  }
  render () {
    const {columns, rows, frozen, headerHeight, bodyHeight, tableWidth, rowHeight, showSideScroll, scrollBarWidth} = this.props;

    return (
        <div ref={'table'} className={'table'} onScroll={this.handleTableSideScroll.bind(this)} style={{width: tableWidth}}>
          <div ref={'headers'} className={'headers'} style={{height: headerHeight}}>
            <div className={'fixedheaders'} style={{left: this.state.scroll, height: headerHeight}}>
              {columns.slice(0,frozen).map((col,i)=><Header key={i} height={headerHeight} width={col.width}>{col.content}</Header>)}
            </div>
            {columns.map((col,i)=>{
              if(i < frozen){
                return <Header key={i+'p'} height={headerHeight} width={col.width}><div className={'headerContent'}>&nbsp;</div></Header>
              }else{
                return <Header key={i} height={headerHeight} width={col.width}>{col.content}</Header>
              }
            })}
            {showSideScroll && <Header height={headerHeight} width={scrollBarWidth}><div className={'headerContent'}>&nbsp;</div></Header>}
          </div>
          <div ref={'rows'} className={'rows'} style={{width:this.state.rowswidth, height: bodyHeight}}>
            {rows.map((row,i)=>
              <Row key={i} height={rowHeight}>
                <div className={'fixedcells'} style={{left: this.state.scroll}}>
                  {row.slice(0,frozen).map((cell,j)=><Cell key={j} height={rowHeight} width={columns[j].width}>{cell}</Cell>)}
                </div>
                {row.map((cell,j)=>{
                  if(j < frozen){
                    return <Cell key={j+'p'} height={rowHeight} width={columns[j].width} className={'placeholdercell'}><div className={'cellContent'}>&nbsp;</div></Cell>
                  }else{
                    return <Cell key={j} height={rowHeight} width={columns[j].width}>{cell}</Cell>
                  }
                })}
              </Row>
            )}
          </div>
        </div>
    );
  }
}

class Header extends React.Component {
  render () {
    const {width=defaultwidth, height} = this.props;
    return (
      <div className={'header'} style={{width:width, height: height}}>
        {this.props.children}
      </div>
    );
  }
}

class Row extends React.Component {
  render () {
    const {height} = this.props;
    return (
      <div className={'row'} style={{height: height}}>
        {this.props.children}
      </div>
    );
  }
}

class Cell extends React.Component {
  render () {
    const {width=defaultwidth, height} = this.props;
    return (
      <div className={'cell'} style={{width:width, height: height}}>
        {this.props.children}
      </div>
    );
  }
}
