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
    const dist = evt.target.scrollLeft+evt.target.offsetWidth;
    if(evt.target.scrollTop == 0 && evt.target.scrollLeft !== this.lastScrollLeft){
      this.setState({rowswidth: (evt.target.scrollLeft+this.refs.table.offsetWidth), scroll: evt.target.scrollLeft})
    }
    this.lastScrollLeft = evt.target.scrollLeft;
    this.lastScrollTop = evt.target.scrollTop;
  }
  componentDidMount(){
    this.setState({rowswidth: (this.refs.table.offsetWidth-1)});
  }
  render () {
    console.log('rendered');
    const {definition, data, options} = this.props;
    return (
        <div ref={'table'} className={'table'} onScroll={this.handleTableSideScroll.bind(this)}>
          <div ref={'headers'} className={'headers'}>
            <div className={'fixedheaders'} style={{left: this.state.scroll}}>
              {definition.map((header,i)=>{
                if(i < options.frozen){
                  return <Header key={i} {...header} options={options}/>
                }
              })}
            </div>
            {definition.map((header,i)=>{
              if(i < options.frozen){
                return <Header key={i+'p'} width={header.width}><span>&nbsp;</span></Header>
              }else{
                return <Header key={i} {...header} options={options}/>
              }
            })}
            <Header width={this.scrollbarsize} options={options}><span>&nbsp;</span></Header>
          </div>
          <div ref={'rows'} className={'rows'} style={{width:this.state.rowswidth, height: this.props.options.bodyHeight}}>
            {data.map((row,i)=>
              <Row key={i} options={options}>
                <div className={'fixedcells'} style={{left: this.state.scroll}}>
                  {row.map((cell,j)=>{
                    if(j < options.frozen){
                      return <Cell key={j} header={definition[j]} options={options}>{cell===''?'-':cell}</Cell>
                    }
                  })}
                </div>
                {row.map((cell,j)=>{
                  if(j < options.frozen){
                    return <Cell key={j+'p'} header={{width: definition[j].width}} options={options}><span>&nbsp;</span></Cell>
                  }else{
                    return <Cell key={j} header={definition[j]} options={options}>{cell===''?'-':cell}</Cell>
                  }
                })}
                <Cell header={{width: this.scrollbarsize}} options={options}><span>&nbsp;</span></Cell>
              </Row>
            )}
          </div>
        </div>
    );
  }
}
Table.defaultProps = {
  options:{}
}

class Header extends React.Component {
  render () {
    const {name, width, options} = this.props;
    return (
      <div className={'header'} style={{width:width, height: options.headerHeight}}>
        {this.props.children || name}
      </div>
    );
  }
}
Header.defaultProps = {
  width: defaultwidth,
  options:{}
}

class Row extends React.Component {
  render () {
    const {options} = this.props;
    return (
      <div className={'row'} style={{width:'100%', height: options.rowHeight}}>
        {this.props.children}
      </div>
    );
  }
}
Row.defaultProps = {
  options:{}
}

class Cell extends React.Component {
  render () {
    const {width} = this.props.header;
    const {rowHeight} = this.props.options;
    return (
      <div className={'cell'} style={{width:width, height: rowHeight}}>
        {this.props.children}
      </div>
    );
  }
}
Header.defaultProps = {
  header: {},
  options: {}
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
