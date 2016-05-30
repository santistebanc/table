import React from 'react';
import ReactDOM from 'react-dom';
import TableUIComponent from './TableUIComponent.jsx';

class Index extends React.Component {
  constructor(props){
    super(props);
    let def = [{name:'Id', type:'number', width: 45},
    {name:'Country', type:'string', width: 300},
    {name:'Official Name', type:'string', width: 400},
    {name:'Capital', type:'string', width: 300},
    {name:'Area', type:'number', width: 100}];
    this.state = {tabledata: {
      backend: '/countries',
      definition: def,
      selector: (d,i)=>[i,d.name.common,d.name.official,d.capital,d.area],
      headerHeight: 30,
      bodyHeight: 400,
      rowHeight: 30,
      frozen:1,
      pageSize: 20}};
  }
  render () {
    return (<div>
      <p> Table!</p>
      <div style={{width: '80%', margin:'0 auto', height: 400}}>
        <TableUIComponent {...this.state.tabledata} />
      </div>
    </div>);
  }
}

ReactDOM.render(<Index/>, document.getElementById('root'));
