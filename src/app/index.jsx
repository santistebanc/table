import React from 'react';
import ReactDOM from 'react-dom';
import Table from './Table.jsx';
import PaginationIndex from './PaginationIndex.jsx';
import SearchBar from './SearchBar.jsx';

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


class Index extends React.Component {
  constructor(props){
    super(props);
    let def = [{name:'Id', type:'number', width: 40},
    {name:'Country', type:'string', width: 300},
    {name:'Official Name', type:'string', width: 400},
    {name:'Capital', type:'string', width: 300},
    {name:'Area', type:'number', width: 100}];
    this.state = {tabledata: {definition: def,
      data: [],
      options:{headerHeight: 30, rowHeight: 30, bodyHeight: 400, frozen:1}},
      pagesize: 20,
      currentpage: 0,
      rowsamount: 0}
  }
  getTableData(size, page, query){
    //here you would send to the server the query arguments for filtering, sorting, etc
    let filtereddata;
    console.log('calling backend');
    callAjax('/countries', loadedData.bind(this));

    function loadedData(newdata){
      const selecteddata = JSON.parse(newdata).map((d,i)=>[i,d.name.common,d.name.official,d.capital,d.area]); //select the columns to display
      console.log('call successful');
      //if offline filtering enabled
      this.state.tabledata.data = offlineFormating(selecteddata);
      this.setState({tabledata: this.state.tabledata, rowsamount: filtereddata.length});
    }

    function offlineFormating(data){
      filtereddata = query?data.filter(containsquery):data;  //filter data according to search query
      return filtereddata.slice(size*page,size*(page+1));  //limit data to only amount specified in page
    }

    function containsquery(value){
      for(let i=0;i < value.length;i++){
        if(value[i].toString().toLowerCase().trim().indexOf(query.toLowerCase().trim()) > -1) return true;
      }
    }
  }
  handleChangePage(page){
    this.state.currentpage = page;
    this.getTableData(this.state.pagesize,this.state.currentpage);
    this.setState({currentpage: this.state.currentpage});
  }
  handleChangeSearchQuery(query){
    this.state.filterquery = query;
    this.getTableData(this.state.pagesize,this.state.currentpage,this.state.filterquery);
    this.setState({currentpage: this.state.currentpage});
  }
  componentDidMount(){
    this.getTableData(this.state.pagesize,this.state.currentpage);
  }
  render () {
    return (<div>
      <p> Table!</p>
      <div style={{width: '80%', margin:'0 auto', height: 400}}>
        <SearchBar onChange={this.handleChangeSearchQuery.bind(this)}/>
        <Table {...this.state.tabledata} />
        <PaginationIndex pagesize={this.state.pagesize}
          range={8}
          totalsize={this.state.rowsamount}
          current={this.state.currentpage}
          onChange={this.handleChangePage.bind(this)}/>
      </div>
    </div>);
  }
}

ReactDOM.render(<Index/>, document.getElementById('root'));
