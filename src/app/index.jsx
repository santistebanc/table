import React from 'react';
import ReactDOM from 'react-dom';
import TableUIComponent from './TableUIComponent.jsx';

class Index extends React.Component {
  constructor(props){
    super(props);
    let def = [{name:'Id', type:'id', width: 45},
    {name:'Flag', type:'flag', width: 50},
    {name:'Country', type:'string', width: 300},
    {name:'Official Name', type:'string', width: 300},
    {name:'Capital', type:'string', width: 150},
    {name:'Area', type:'areakm2', width: 150}];
    this.state = {tabledata: {
      backend: '/countries/slow',
      definition: def,
      selection: (d,i)=>[i,d.cca2,d.name.common,d.name.official,d.capital,d.area],
      headerHeight: 30,
      bodyHeight: 400,
      rowHeight: 38,
      frozen:2,
      pageSize: 25}};
  }
  render () {
    return (<div>
      <p> Table!</p>
      <div style={{width: '80%', margin:'0 auto'}}>
        <TableUIComponent {...this.state.tabledata} />
      </div>
    </div>);
  }
}

ReactDOM.render(<Index/>, document.getElementById('root'));
