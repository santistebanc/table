import React from 'react';
import ReactDOM from 'react-dom';
import Table from './Table.jsx';

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
    let def = [{name:'Id', type:'number', width: 30},
    {name:'Country', type:'string', width: 300},
    {name:'Official Name', type:'string', width: 400},
    {name:'Capital', type:'string', width: 300},
    {name:'Area', type:'number', width: 100}];
    this.state = {tabledata: {definition: def,
      data: [],
      options:{headerHeight: 30, rowHeight: 30, bodyHeight: 400, frozen:1}},
      pagesize: 50,
      pagenumber: 0}
  }
  getTableData(size, page){
    callAjax('/countries',(data)=>{
      let dat = JSON.parse(data).map((d,i)=>[i,d.name.common,d.name.official,d.capital,d.area]);
      this.state.tabledata.data = dat.slice(size*page,size*(page+1));
      this.setState({tabledata: this.state.tabledata});
    });
  }
  componentDidMount(){
    this.getTableData(this.state.pagesize,this.state.pagenumber);
  }
  render () {
    return (<div>
      <p> Table!</p>
      <div style={{width: '80%', margin:'0 auto', height: 400}}>
        <Table {...this.state.tabledata} />
      </div>
    </div>);
  }
}

ReactDOM.render(<Index/>, document.getElementById('root'));
