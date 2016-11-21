import React, {Component} from 'react';
import Header from '../Header';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as interactionActions  from '../../actions/interactions/index';

class InteractionsContainer extends Component {

  constructor(props) {
    super(props);
    this.props.actions.fetchTags({type: 'posts'});
  }

  render() {
    return (
      <div className="main-content">
        <Header title="Help your college mates by answering their questions."
                type="Interaction"
                parentProps={this.props}
                hasButton={true}
                buttonLabel="Ask a question"/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    interactions: state.interactions
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({...interactionActions}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(InteractionsContainer);
