import React from 'react';
import Table from './Table.jsx';
import PaginationIndex from './PaginationIndex.jsx';
import SearchBar from './SearchBar.jsx';
import SortController from './SortController.jsx'

require('./TableUIComponent.less');

export default class TableUIComponent extends React.Component {
  constructor(props){
    super(props);
    this.state = {data: [],
      loading: true,
      selectedOptionShow: props.pageSize,
      headerHeight: props.headerHeight,
      rowHeight: props.rowHeight,
      bodyHeight: props.bodyHeight,
      frozen: props.frozen,
      pageSize: props.pageSize,
      currentpage: 0,
      rowsamount: 0,
      sortModes:props.definition.map(d=>{})}
      this.callid = 0;
  }
  getTableData({pageSize=this.state.pageSize, currentpage=this.state.currentpage, filterquery=this.state.filterquery, sortModes=this.state.sortModes, callback=()=>{}}){
    //here you would send to the server the query arguments for filtering, sorting, etc

    let filtereddata;
    this.callid ++;
    this.setState({loading: true});
    console.log('calling backend',this.callid);
    callAjax(this.props.backend, loadedData.bind(this,this.callid));

    function loadedData(num,newdata){
      console.log('call successful',num,this.callid);
      if(num == this.callid){
        const selecteddata = JSON.parse(newdata).map(this.props.selector); //select the columns to display
        this.state.loading = false;
        //if offline filtering enabled
        this.state.data = offlineFormating(selecteddata);
        this.state.rowsamount = filtereddata.length;
        this.setState(this.state);
        callback();
      }
    }

    function offlineFormating(data){
      filtereddata = filterquery?data.filter(containsquery):data;  //filter data according to search query
      return filtereddata.slice(pageSize*currentpage,pageSize*(currentpage+1));  //limit data to only amount specified in page
    }

    function containsquery(value){
      for(let i=0;i < value.length;i++){
        if(value[i].toString().toLowerCase().trim().indexOf(filterquery.toLowerCase().trim()) > -1) return true;
      }
    }
  }
  handleChangeSortMode(c){
    const newvalue = ((this.state.sortModes[c]||0)+1)%3;
    this.state.sortModes = this.state.sortModes.map(s=>0);
    this.state.sortModes[c] = newvalue;
    this.setState({sortModes: this.state.sortModes});
  }
  handleChangePage(page){
    this.getTableData({currentpage:page, callback:()=>{
      this.state.currentpage = page;
      this.setState({currentpage: this.state.currentpage});
    }});
  }
  handleChangeSelectedOptionShow(evt){
    const ps = parseInt(evt.target.value);
    this.setState({selectedOptionShow: parseInt(evt.target.value)});
    this.getTableData({currentpage:0,pageSize:ps,callback:()=>{
      this.state.currentpage = 0;
      this.state.pageSize = ps;
      this.setState(this.state);
    }});
  }
  handleChangeSearchQuery(query){
    this.getTableData({currentpage:0,filterquery:query,callback:()=>{
      this.state.filterquery = query;
      this.setState({filterquery: this.state.filterquery, currentpage: 0});
    }});
  }
  componentDidMount(){
    this.getTableData(this.state.pageSize,this.state.currentpage);
  }
  render () {
    console.log('rendering');

    const {pageSize, currentpage, rowsamount} = this.state;

    const columns = this.renderColumns();
    const rows = this.renderRows();

    let showmessage = 'nothing to show';
    if(rowsamount<=pageSize){
      showmessage = <span>{'Showing the '}{rowsamount}{' entries'}</span>
    }else{
      showmessage = <span>{'Showing '}{pageSize*currentpage+1}{' to '}{rowsamount>pageSize*(currentpage+1)?pageSize*(currentpage+1):rowsamount}{' of '}{rowsamount}{' entries'}</span>
    }

    return (
      <div style={{width: '80%', margin:'0 auto', height: 400}}>
        <div>
          <div style={{display:'inline-block', padding:5}}>{'Show '}
            <select value={this.state.selectedOptionShow} onChange={this.handleChangeSelectedOptionShow.bind(this)}>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>{' entries'}</div>
          <div style={{display:'inline-block', padding:5, float:'right',width: 110, textAlign: 'right'}}>{this.state.loading?
              <span><i className="fa fa-circle-o-notch fa-spin fa-fw"></i>{'Loading...'}</span>
              :
              'Ready'}
          </div>
          <SearchBar style={{float:'right'}} onChange={this.handleChangeSearchQuery.bind(this)}/>
        </div>
        <div style={{padding:5}}>
        <Table rows={rows} columns={columns}
          frozen={this.state.frozen}
          headerHeight={this.state.headerHeight}
          rowHeight={this.state.rowHeight}
          bodyHeight={this.state.bodyHeight} />
        </div>
        <div>
        <div style={{display:'inline-block', padding:5}}>{showmessage}</div>
        <PaginationIndex style={{float:'right'}}
          pageSize={this.state.pageSize}
          range={8}
          totalsize={this.state.rowsamount}
          current={this.state.currentpage}
          onChange={this.handleChangePage.bind(this)}/>
        </div>
      </div>
    );
  }
  renderColumns(){
    const def = this.props.definition;
    const cont = (d,i)=>{// this is where the headers can be customized
      if(d.name===''){
        return <div className={'headerContent'}>&nbsp;</div>
      }else{
        return <div><div className={'headerContent'} style={{display: 'inline-block', textOverflow: 'ellipsis',overflow: 'hidden',fontWeight: 'bold'}} title={d.name}>{d.name}</div>
        <SortController mode={this.state.sortModes[i]} onChange={this.handleChangeSortMode.bind(this,i)}
          style={{display: 'inline-block', float: 'right', height: this.state.headerHeight, padding:'3px'}}/>
        </div>
      }
    }
    return def.map((d,i)=>{return {width:d.width, content:cont(d,i)}});
  }
  renderRows(){
    const rows = this.state.data;
    const cells = (cell,j)=>{
      let inside;
      switch(this.props.definition[j].type){ //here is where you create your own custom types
        case 'id':
        inside = <div className={'cellContent'}
          style={{textAlign:'right', color:'DodgerBlue', fontWeight: 'bold', backgroundColor:'Lavender'}} title={cell}>{cell}</div>
        break;
        case 'string':
        inside = <div className={'cellContent'}
          style={{textOverflow: 'ellipsis',overflow: 'hidden'}} title={cell}>{cell}</div>
        break;
        case 'amount':
        inside = <div className={'cellContent'}
          style={{textAlign:'right'}} title={cell}>{formatAmount(cell)}</div>
        break;
        case 'areakm2':
        inside = <div className={'cellContent'}
          style={{textAlign:'right'}} title={cell}>{formatAmount(cell)}{' km'}<sup>2</sup></div>
        break;
        default:
        inside = <div className={'cellContent'}
          title={cell}>{cell}</div>
      }

      return inside;
    }
    return rows.map((row,i)=>row.map(cells));
  }
}

function formatAmount(num, s=' ', n=0){
  const re = '\\d(?=(\\d{3})+' + (n > 0 ? '\\.' : '$') + ')';
  return num.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&'+s);
}

function callAjax(url, callback){ //replace this with custom ajax caller
    var xmlhttp;
    // compatible with IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            callback(xmlhttp.responseText);
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}
