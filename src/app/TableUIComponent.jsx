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
      headerHeight: props.headerHeight,
      rowHeight: props.rowHeight,
      bodyHeight: props.bodyHeight,
      frozen: props.frozen,
      pageSize: props.pageSize,
      currentpage: 0,
      rowsamount: 0,
      sortModes:props.definition.map(d=>{})}
  }
  getTableData(){
    //here you would send to the server the query arguments for filtering, sorting, etc

    const {pageSize, currentpage, filterquery, sortModes} = this.state;

    let filtereddata;
    console.log('calling backend');
    callAjax(this.props.backend, loadedData.bind(this));

    function loadedData(newdata){
      const selecteddata = JSON.parse(newdata).map(this.props.selector); //select the columns to display
      console.log('call successful');
      //if offline filtering enabled
      this.state.data = offlineFormating(selecteddata);
      this.state.rowsamount = filtereddata.length;
      this.setState(this.state);
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
    this.state.currentpage = page;
    this.getTableData();
    this.setState({currentpage: this.state.currentpage});
  }
  handleChangeSearchQuery(query){
    this.state.filterquery = query;
    this.getTableData();
    this.setState({filterquery: this.state.filterquery, currentpage: 0});
  }
  componentDidMount(){
    this.getTableData(this.state.pageSize,this.state.currentpage);
  }
  render () {
    console.log('rendering');

    const columns = this.renderColumns();
    const rows = this.renderRows();

    return (<div style={{width: '80%', margin:'0 auto', height: 400}}>
        <SearchBar onChange={this.handleChangeSearchQuery.bind(this)}/>
        <Table rows={rows} columns={columns} frozen={this.state.frozen} headerHeight={this.state.headerHeight} rowHeight={this.state.rowHeight} bodyHeight={this.state.bodyHeight} />
        <PaginationIndex pageSize={this.state.pageSize}
          range={8}
          totalsize={this.state.rowsamount}
          current={this.state.currentpage}
          onChange={this.handleChangePage.bind(this)}/>
      </div>);
  }
  renderColumns(){
    const def = this.props.definition;
    return def.map((d,i)=>{
      return {width:d.width, content:
      d.name===''?
      <div className={'headerContent'}>&nbsp;</div>
      :
      <div><div className={'headerContent'} style={{display: 'inline-block'}}>{d.name}</div>
      <SortController mode={this.state.sortModes[i]} onChange={this.handleChangeSortMode.bind(this,i)}
        style={{display: 'inline-block', float: 'right', height: this.state.headerHeight, padding:'3px'}}/>
      </div>
  }});
  }
  renderRows(){
    const rows = this.state.data;
    return rows.map((row,i)=>row.map((cell,j)=><div className={'cellContent'}>{cell===''?<span>&nbsp;</span>:cell}</div>));
  }
}

function callAjax(url, callback){
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
