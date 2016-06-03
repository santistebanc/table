import React from 'react';
import ReactDOM from 'react-dom';
import TableUIComponent from './TableUIComponent.jsx';

class Index extends React.Component {
  constructor(props){
    super(props);
    let def = [{name:'Id', type:'id', width: 45},
    {name:'Flag', type:'flag', width: 50},
    {name:'Country', type:'string', width: '25% 100'},
    {name:'Official Name', type:'string', width: '50% 150'},
    {name:'Capital', type:'string', width: '25% 100'},
    {name:'Area', type:'areakm2', width: 120}];
    this.state = {tabledata: {
      backend: '/countries/slow',
      definition: def,
      selection: (d,i)=>[i,d.cca2,d.name.common,d.name.official,d.capital,d.area],
      headerHeight: 30,
      bodyHeight: 400,
      tableWidth: 1000,
      rowHeight: 38,
      frozen:2,
      pageSize: 25}};
  }
  render () {
    return (<div>
      <p> Table!</p>
      <div style={{margin:'0 auto',width: 1000}}>
        <TableUIComponent {...this.state.tabledata} />
      </div>
    </div>);
  }
}

ReactDOM.render(<Index/>, document.getElementById('root'));
