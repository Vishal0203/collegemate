import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {List, ListItem} from 'material-ui/List';
import {Tabs, Tab} from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import * as instituteActions  from '../../actions/institutes/index';
import * as snackbarActions  from '../../actions/snackbar/index';
import {Card, CardHeader, CardText, CardTitle, CardActions} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import CreateInstituteForm from './CreateInstituteForm'
import {hashHistory} from 'react-router';

class InstituteSettingsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'a',
      searchText: '',
      chosenInstitute: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.props.actions.fetchInstituteRequest();
  };

  componentWillMount() {
    if (this.props.auth_user.user.default_institute != null) {
      hashHistory.replace('/');
    }
  }

  get styles() {
    return {
      headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400,
      },
      wrap: {
        boxSizing: 'border-box',
        maxWidth: '55%',
        margin: '0 auto',
      },
      footerImage: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        zIndex: '-1'
      }
    }
  }

  handleChange(value) {
    this.setState({
      value,
      searchText: this.state.searchText
    });
  };

  handleUpdateInput(searchText) {
    this.setState({
      value: this.state.value,
      searchText
    });
  };

  handleNewRequest(chosenRequest) {
    if (this.state.searchText == chosenRequest.institute_name) {
      this.setState({
        value: this.state.value,
        searchText: this.state.searchText,
        chosenInstitute: chosenRequest
      })
    } else {
      this.setState({
        value: this.state.value,
        searchText: this.state.searchText,
        chosenInstitute: null
      });
      this.props.actions.toggleSnackbar('The institute you are trying to select does not exist.')
    }
  }

  onProceed() {
    if (this.state.chosenInstitute) {
      this.props.actions.selectInstituteRequest(this.state.chosenInstitute.inst_profile_guid)
    } else {
      this.props.actions.toggleSnackbar('Please select an institute.')
    }
  }

  render() {
    const dataSourceConfig = {
      text: 'institute_name',
      value: 'inst_profile_guid'
    };

    return (
      <div className="main-content">
        <div style={{marginTop: '4%'}}>
          <Grid>
           <div style={this.styles.wrap}>
             <Paper zDepth={0} style={{backgroundColor: 'transparent'}}>
               <Tabs
                 value={this.state.value}
                 onChange={this.handleChange}
                 className="transparent-tabs"
               >
                 <Tab label="Select Institute" value="a" className="dark-text-tab">
                   <div>
                     <h2 style={this.styles.headline}>Tell us where you belong</h2>
                     <p>
                       Select your institute from the list below.
                       This helps us update you with on going events at your college and lot more things.
                       If not, create a new Institute to get going.
                     </p>
                     <div>
                       <AutoComplete
                         listStyle={{maxHeight: 200, overflow: 'auto'}}
                         hintText="Type to Search"
                         onUpdateInput={(searchText) => this.handleUpdateInput(searchText)}
                         onNewRequest={(chosenRequest) => this.handleNewRequest(chosenRequest)}
                         openOnFocus={true}
                         fullWidth={true}
                         dataSource={this.props.institutes.list}
                         dataSourceConfig={dataSourceConfig}
                         filter={AutoComplete.fuzzyFilter}
                       />
                       <div style={{marginTop: 10}}>
                         <RaisedButton label="Proceed" onClick={() => this.onProceed()} primary={true}/>
                       </div>
                     </div>
                   </div>
                 </Tab>
                 <Tab label="Create Institute" value="b" className="dark-text-tab">
                   <div>
                     <h2 style={this.styles.headline}>Get Started here</h2>
                     <CreateInstituteForm parentProps={this.props}/>
                   </div>
                 </Tab>
               </Tabs>
             </Paper>
           </div>
          </Grid>
          <img style={this.styles.footerImage} src={require('../../styles/images/institutes.png')}/>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    institutes: state.institutes
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...instituteActions,
      ...snackbarActions
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(InstituteSettingsContainer);      
