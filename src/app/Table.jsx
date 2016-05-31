import React from 'react';

require('./Table.less');

const defaultwidth = 200;

export default class Table extends React.Component {
  constructor(props){
    super(props);
    this.state = {scroll: 0};
    this.scrollbarsize = getScrollbarWidth()+1;
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
    const {columns, rows, frozen, headerHeight, bodyHeight, rowHeight} = this.props;
    return (
        <div ref={'table'} className={'table'} onScroll={this.handleTableSideScroll.bind(this)}>
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
            <Header height={headerHeight} width={this.scrollbarsize}><div className={'headerContent'}>&nbsp;</div></Header>
          </div>
          <div ref={'rows'} className={'rows'} style={{width:this.state.rowswidth, height: bodyHeight}}>
            {rows.map((row,i)=>
              <Row key={i} height={rowHeight}>
                <div className={'fixedcells'} style={{left: this.state.scroll}}>
                  {row.slice(0,frozen).map((cell,j)=><Cell key={j} height={rowHeight} width={columns[j].width}>{cell}</Cell>)}
                </div>
                {row.map((cell,j)=>{
                  if(j < frozen){
                    return <Cell key={j+'p'} height={rowHeight} width={columns[j].width}><div className={'cellContent'}>&nbsp;</div></Cell>
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

function getScrollbarWidth() {
    var outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

    document.body.appendChild(outer);

    var widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = "scroll";

    // add innerdiv
    var inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);

    var widthWithScroll = inner.offsetWidth;

    // remove divs
    outer.parentNode.removeChild(outer);

    return widthNoScroll - widthWithScroll;
}
