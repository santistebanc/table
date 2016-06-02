import React from 'react';

require('./CheckBoxList.less');

export default class CheckBoxList extends React.Component {
  constructor(props){
    super(props);
    this.state = {query: ''};
  }
  handleChangeCheckBox(idx,evt){
    this.props.onChange(idx,evt.target.checked);
  }
  render () {
    const {names, values, style} = this.props;
    console.log(names);
    return <div className={'checkboxlist'} style={style}>
        {names.map((name,idx)=><div><input key={idx} type="checkbox" checked={values.indexOf(idx)>-1} value={name} onChange={this.handleChangeCheckBox.bind(this,idx)}/>{name}</div>)}
    </div>
  }
}
CheckBoxList.defaultProps = {
  onChange: ()=>{}
}
