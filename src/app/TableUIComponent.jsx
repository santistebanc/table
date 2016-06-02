import React from 'react';
import Table from './Table.jsx';
import PaginationIndex from './PaginationIndex.jsx';
import SearchBar from './SearchBar.jsx';
import SortController from './SortController.jsx'
import CheckBoxList from './CheckBoxList.jsx'

require('./TableUIComponent.less');

export default class TableUIComponent extends React.Component {
  constructor(props){
    super(props);
    this.state = {data: [], headers: [],
      loading: true,
      selectedOptionShow: props.pageSize,
      headerHeight: props.headerHeight,
      rowHeight: props.rowHeight,
      bodyHeight: props.bodyHeight,
      frozen: props.frozen,
      pageSize: props.pageSize,
      currentpage: 0,
      rowsamount: 0,
      sortModes:props.definition.map(d=>{}),
      selectedColumns: props.definition.map((d,i)=>i),
      showColumnsCheckList: false}
      this.callid = 0;
  }
  getTableData({pageSize=this.state.pageSize, currentpage=this.state.currentpage, filterquery=this.state.filterquery, sortModes=this.state.sortModes, callback=()=>{}}){
    //here you would send to the server the query arguments for filtering, sorting, etc
    console.log('heer')
    let sorteddata;
    this.callid ++;
    this.setState({loading: true});
    console.log('calling backend',this.callid);
    callAjax(this.props.backend, loadedData.bind(this,this.callid));

    function loadedData(num,newdata){
      console.log('call successful',num,this.callid);
      if(num == this.callid){ //callid used to prevent inconsistent loading of content due to different speeds of server responses
        this.callid = 0;

        const selectionFiltered = (d,i)=>this.props.selection(d,i).filter((a,x)=>this.state.selectedColumns.indexOf(x)>-1); //select only specified columns
        const selecteddata = JSON.parse(newdata).map(selectionFiltered); //select the columns to display
        this.state.loading = false; //data has been retrieved, no more loding
        this.state.headers = this.props.definition.filter((a,x)=>this.state.selectedColumns.indexOf(x)>-1); //select only specified columns
        this.state.data = offlineFormating(selecteddata);
        this.state.rowsamount = sorteddata.length;
        this.setState(this.state);
        callback();
      }
    }

    function offlineFormating(data){
      const filtereddata = filterquery?data.filter(containsquery):data;  //filter data according to search query
      const dir = sortModes.indexOf(1)>-1?1:-1;
      const field = sortModes.indexOf(1)>-1?sortModes.indexOf(1):sortModes.indexOf(2);
      if(field>-1){
        sorteddata = filtereddata.sort((a,b)=>{
          console.log('sorting', dir, field)
          if (a[field] < b[field])
            return -1*dir;
          else if (a[field] > b[field])
            return 1*dir;
          else
            return 0;
        });
      }else{
        sorteddata = filtereddata
      }
      return filtereddata.slice(pageSize*currentpage,pageSize*(currentpage+1));  //limit data to only amount specified in page
    }

    function containsquery(value){ //function to look for matching ocurrences on the search query
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
    this.getTableData({sortModes:this.state.sortModes});
  }
  handleChangePage(page){
    this.getTableData({currentpage:page, callback:()=>{
      this.setState({currentpage: page});
    }});
  }
  handleChangeSelectedOptionShow(evt){
    const ps = parseInt(evt.target.value);
    this.setState({selectedOptionShow: ps});
    this.getTableData({currentpage:0,pageSize:ps,callback:()=>{
      this.setState({currentpage:0,pageSize:ps});
    }});
  }
  handleChangeSelectedColumns(evt){
    const cols = evt.target.value;
    console.log(evt.target.value);
    this.setState({selectedColumns: cols});
    //this.getTableData({selectedColumns: cols,callback:()=>{}});
  }
  handleChangeSearchQuery(query){
    this.getTableData({currentpage:0,filterquery:query,callback:()=>{
      this.setState({filterquery: query, currentpage: 0});
    }});
  }
  handleDoubleClickHeader(col){
    console.log('there2');
    this.setState({frozen: col});
  }
  handleClickCell({cell, rownum}){
    console.log('You clicked: ', cell, ' in row ',rownum)
  }
  handleChangeCheckBoxList(idx,val){
    if(this.state.selectedColumns.indexOf(idx)>-1 && !val){
      this.state.selectedColumns.splice(this.state.selectedColumns.indexOf(idx), 1);
    }else if(val){
      this.state.selectedColumns.push(idx);
    }
    this.setState(this.state);
    this.getTableData({});
  }
  componentDidMount(){
    this.getTableData({});
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

    function clickColumnsBut(){
      this.setState({showColumnsCheckList: !this.state.showColumnsCheckList});
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
          <div style={{display:'inline-block', padding:3, float:'left'}}>
            <button onClick={clickColumnsBut.bind(this)}>Columns</button></div>
          <div style={{display:'inline-block', padding:5, float:'right',width: 110, textAlign: 'right'}}>{this.state.loading?
              <span><i className="fa fa-circle-o-notch fa-spin fa-fw"></i>{'Loading...'}</span>
              :
              'Ready'}
          </div>
          <SearchBar style={{float:'right'}} onChange={this.handleChangeSearchQuery.bind(this)}/>
        </div>
        {this.state.showColumnsCheckList && <CheckBoxList names={this.props.definition.map(d=>d.name)} values={this.state.selectedColumns} onChange={this.handleChangeCheckBoxList.bind(this)}/>}
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
    const cont = (d,i)=>{// this is where the headers can be customized
      let sortc;
      if(d.type!='flag'){
        sortc = <SortController mode={this.state.sortModes[i]} onChange={this.handleChangeSortMode.bind(this,i)} style={{height: this.state.headerHeight}}/>
      }
      return <div className={'headerContent'} title={d.name} onDoubleClick={this.handleDoubleClickHeader.bind(this,i)}>
        <div style={{padding: 5, height: '100%', display: 'inline-block', textOverflow: 'ellipsis',overflow: 'hidden',fontWeight: 'bold'}}>{d.name}</div>
        {sortc}
      </div>
    }
    return this.state.headers.map((d,i)=>{return {width:d.width, content:cont(d,i)}});
  }
  renderRows(){
    const rows = this.state.data;
    return rows.map((row,i)=>row.map(
      (cell,j)=>{
        let inside;
        switch(this.state.headers[j].type){ //here is where you create your own custom types
          case 'id':
          inside = <div className={'cellContent'} onClick={this.handleClickCell.bind(this,{cell:cell, rownum:i})}
            style={{padding: '10px 5px', textAlign:'right', color:'DodgerBlue', fontWeight: 'bold', backgroundColor:'Lavender'}} title={cell}>{cell}</div>
          break;
          case 'string':
          inside = <div className={'cellContent'} onClick={this.handleClickCell.bind(this,{cell:cell, rownum:i})}
            style={{padding: '10px 5px', textOverflow: 'ellipsis',overflow: 'hidden'}} title={cell}>{cell}</div>
          break;
          case 'amount':
          inside = <div className={'cellContent'} onClick={this.handleClickCell.bind(this,{cell:cell, rownum:i})}
            style={{padding: '10px 5px', textAlign:'right'}} title={cell}>{formatAmount(cell)}</div>
          break;
          case 'areakm2':
          inside = <div className={'cellContent'} onClick={this.handleClickCell.bind(this,{cell:cell, rownum:i})}
            style={{padding: '8px 5px', textAlign:'right'}} title={cell}>{formatAmount(cell)}{' km'}<sup>2</sup></div>
          break;
          case 'flag':
          inside = <div className={'cellContent'} onClick={this.handleClickCell.bind(this,{cell:cell, rownum:i})}
            style={{padding: 5}}
            title={cell}><div style={{width: '100%',height: '100%',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundImage: 'url("http://flags.fmcdn.net/data/flags/normal/'+ cell.trim().toLowerCase() +'.png")'}}/></div>
          break;
          default:
          inside = <div className={'cellContent'}
            title={cell}>{cell}</div>
        }
        return inside;
      }
    ));
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
